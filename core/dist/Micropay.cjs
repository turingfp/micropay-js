/**
 * Micropay - Main SDK client
 * 
 * @example
 * const micropay = createMicropay({
 *   publicKey: 'pk_live_xxx',
 *   provider: 'mpesa',
 *   environment: 'sandbox'
 * });
 * 
 * const session = micropay.createSession({
 *   amount: 50,
 *   productId: 'premium_unlock',
 *   description: 'Unlock Premium'
 * });
 */

import { PaymentSession, SessionStatus } from './PaymentSession.js';
import { MpesaProvider } from './providers/MpesaProvider.js';
import { ConfigurationError, ValidationError, PaymentError } from './errors.js';
import { PROVIDERS, ENVIRONMENTS, PHONE_PATTERNS, CURRENCIES } from './constants.js';
const PROVIDER_MAP = {
  [PROVIDERS.MPESA]: MpesaProvider
};
export class Micropay {
  constructor(config = {}) {
    this._validateConfig(config);
    this.publicKey = config.publicKey;
    this.secretKey = config.secretKey; // Only for server-side
    this.apiUrl = config.apiUrl || 'https://qlxtpdaphrqlmwvhgazr.supabase.co/functions/v1/micropay-api';
    this.providerName = config.provider || PROVIDERS.MPESA;
    this.environment = config.environment || ENVIRONMENTS.SANDBOX;
    this.country = config.country || 'KE';
    this.currency = config.currency || 'KES';
    this.onSessionUpdate = config.onSessionUpdate || (() => {});

    // Provider credentials (for direct API calls)
    this.credentials = config.credentials || null;
    this.provider = null;
    this.sessions = new Map();
    this.isInitialized = false;
  }
  _validateConfig(config) {
    if (!config.publicKey && !config.credentials) {
      throw new ConfigurationError('Either publicKey or credentials must be provided', ['publicKey', 'credentials']);
    }
  }

  /**
   * Initialize the SDK and provider
   */
  async initialize() {
    if (this.isInitialized) return;
    if (this.credentials) {
      const ProviderClass = PROVIDER_MAP[this.providerName];
      if (!ProviderClass) {
        throw new ConfigurationError(`Unknown provider: ${this.providerName}`);
      }
      this.provider = new ProviderClass({
        credentials: this.credentials,
        environment: this.environment
      });
      await this.provider.initialize();
    }
    this.isInitialized = true;
  }

  /**
   * Create a new payment session
   * 
   * @param {Object} options - Session options
   * @param {number} options.amount - Payment amount
   * @param {string} options.productId - Product identifier
   * @param {string} options.description - Payment description
   * @param {Function} options.onSuccess - Success callback
   * @param {Function} options.onError - Error callback
   * @returns {PaymentSession}
   */
  createSession(options = {}) {
    const session = new PaymentSession({
      ...options,
      currency: options.currency || this.currency,
      onStatusChange: data => {
        this.onSessionUpdate(data);
        options.onStatusChange?.(data);
      },
      onSuccess: options.onSuccess,
      onError: options.onError,
      onCancel: options.onCancel
    });
    this.sessions.set(session.id, session);
    return session;
  }

  /**
   * Get an existing session
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Process a payment session
   * 
   * @param {string} sessionId - Session ID
   * @param {string} customerPhone - Customer phone number
   */
  async processPayment(sessionId, customerPhone) {
    await this.initialize();
    const session = this.getSession(sessionId);
    if (!session) {
      throw new PaymentError(`Session not found: ${sessionId}`);
    }

    // Validate phone
    if (!this.validatePhone(customerPhone)) {
      throw new ValidationError('Invalid phone number format', 'customerPhone', customerPhone);
    }

    // Set phone and start processing
    session.setCustomerPhone(customerPhone);
    const transaction = session.startProcessing(this.providerName);
    try {
      // 1. Direct Provider Mode (Node.js backend with credentials)
      if (this.provider) {
        session.awaitConfirmation();
        const result = await this.provider.charge({
          customerPhone: this.normalizePhone(customerPhone),
          amount: session.amount,
          currency: session.currency,
          reference: session.productId || session.id,
          transactionReference: transaction.id,
          description: session.description
        });
        if (result.success) {
          session.complete(result.transactionId);
        } else {
          session.fail(result.error);
        }
        return {
          success: result.success,
          session: session.toJSON(),
          transaction: transaction.toJSON()
        };
      }

      // 2. Platform Mode (Browser/Client with Public Key)
      if (this.publicKey) {
        session.awaitConfirmation();
        const response = await fetch(`${this.apiUrl}/charge`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.publicKey
          },
          body: JSON.stringify({
            amount: session.amount,
            currency: session.currency,
            provider: this.providerName,
            customerPhone: this.normalizePhone(customerPhone),
            description: session.description,
            productId: session.productId,
            metadata: session.metadata
          })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new PaymentError(data.error || 'Payment failed via Platform', 'PLATFORM_ERROR', transaction.id);
        }
        if (data.success) {
          // Update session with the transaction ID from the platform
          session.complete(data.transaction.id);
        } else {
          session.fail(new Error('Unknown platform error'));
        }
        return {
          success: data.success,
          session: session.toJSON(),
          transaction: transaction.toJSON() // Note: Transaction ID might be updated to match platform's
        };
      }

      // 3. Mock/Client-only fallback (if nothing configured)
      // Just return session for UI handling
      return {
        success: true,
        session: session.toJSON(),
        pendingConfirmation: true
      };
    } catch (error) {
      session.fail(error);
      throw new PaymentError(error.message, error.code, transaction.id);
    }
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone) {
    const pattern = PHONE_PATTERNS[this.country];
    if (!pattern) return true; // Allow if no pattern
    return pattern.test(phone.replace(/\s/g, ''));
  }

  /**
   * Normalize phone to international format
   */
  normalizePhone(phone) {
    const countryCode = CURRENCIES[this.currency]?.country === 'MZ' ? '258' : CURRENCIES[this.currency]?.country === 'KE' ? '254' : '258';
    let cleaned = phone.replace(/[^\d+]/g, '');
    cleaned = cleaned.replace(/^(\+|00)/, '');
    if (!cleaned.startsWith(countryCode)) {
      cleaned = countryCode + cleaned;
    }
    return cleaned;
  }

  /**
   * Cancel a session
   */
  cancelSession(sessionId) {
    const session = this.getSession(sessionId);
    if (session) {
      session.cancel();
    }
  }

  /**
   * Get SDK info
   */
  getInfo() {
    return {
      provider: this.providerName,
      environment: this.environment,
      country: this.country,
      currency: this.currency,
      isInitialized: this.isInitialized,
      activeSessions: this.sessions.size
    };
  }
}

/**
 * Factory function for creating Micropay instance
 */
export function createMicropay(config) {
  return new Micropay(config);
}