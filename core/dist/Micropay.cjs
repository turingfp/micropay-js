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
import { normalizePhone, validatePhone } from './utils/PhoneUtils.js';
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
   * Create a Payment Intent
   */
  async createPaymentIntent(data) {
    if (!this.publicKey) throw new ConfigurationError('Public Key required');
    const response = await fetch(`${this.apiUrl}/payment_intents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.publicKey
        // 'Idempotency-Key': ... // Optional: could expose this
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to create payment intent');
    return result;
  }

  /**
   * Confirm a Payment Intent
   */
  async confirmPaymentIntent(intentId, data = {}) {
    if (!this.publicKey) throw new ConfigurationError('Public Key required');
    const response = await fetch(`${this.apiUrl}/payment_intents/${intentId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.publicKey
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to confirm payment intent');
    return result;
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
        return {
          success: result.success,
          session: session.toJSON(),
          transaction: transaction.toJSON()
        };
      }

      // 2. Platform Mode (Browser/Client with Public Key)
      if (this.publicKey) {
        session.awaitConfirmation();

        // Step A: Create Intent (if not already provided)
        let intent;
        if (session.intentId && session.clientSecret) {
          intent = {
            id: session.intentId,
            client_secret: session.clientSecret
          };
        } else {
          intent = await this.createPaymentIntent({
            amount: session.amount,
            currency: session.currency,
            customer_phone: this.normalizePhone(customerPhone),
            description: session.description,
            metadata: {
              ...session.metadata,
              product_id: session.productId // Pass product ID
            }
          });
        }

        // Link Intent ID to Transaction for tracking
        transaction.externalId = intent.id;

        // Step B: Confirm Intent (Trigger STK)
        const confirmedIntent = await this.confirmPaymentIntent(intent.id, {
          client_secret: intent.client_secret
        });
        if (confirmedIntent.status === 'processing') {
          // Handled successfully, but pending
        } else if (confirmedIntent.status === 'succeeded' || confirmedIntent.status === 'completed') {
          // Instant success (e.g. Demo or stored card)
          transaction.status = 'completed';
          session.complete(transaction);
        } else {
          // Check for immediate failure
          const errorMsg = confirmedIntent.metadata?.last_error || 'Payment confirmation failed';
          throw new PaymentError(errorMsg, 'PAYMENT_FAILED', intent.id);
        }
        return {
          success: true,
          pendingConfirmation: confirmedIntent.status === 'processing',
          session: session.toJSON(),
          transaction: transaction.toJSON(),
          intent: confirmedIntent
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
      throw error;
    }
  }
  async getTransactionStatus(transactionId) {
    if (!this.publicKey) {
      throw new PaymentError('Public Key required for status check in platform mode');
    }
    const response = await fetch(`${this.apiUrl}/status?id=${transactionId}`, {
      headers: {
        'x-api-key': this.publicKey
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch status');

    // Update local session if found
    for (const session of this.sessions.values()) {
      if (session.transaction?.id === transactionId || session.transaction?.externalId === transactionId) {
        if (data.transaction.status === 'completed' || data.transaction.status === 'succeeded') {
          session.complete(data.transaction.id);
        } else if (data.transaction.status === 'failed') {
          session.fail(new Error(data.transaction.error_message || 'Payment failed'));
        }
        break;
      }
    }
    return data.transaction;
  }

  /**
   * Manually trigger a reconciliation with the provider (e.g. M-Pesa Query API)
   * Use this if a callback was missed.
   */
  async syncTransactionStatus(transactionId) {
    if (!this.publicKey) {
      throw new PaymentError('Public Key required for reconciliation');
    }
    const response = await fetch(`${this.apiUrl}/payment_intents/${transactionId}/reconcile`, {
      method: 'POST',
      headers: {
        'x-api-key': this.publicKey,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Reconciliation failed');

    // Update local session
    await this.getTransactionStatus(transactionId);
    return data;
  }

  /**
   * Validate phone number format
   */
  validatePhone(phone) {
    return validatePhone(phone, this.country);
  }

  /**
   * Normalize phone to international format without leading plus or zeros
   */
  normalizePhone(phone) {
    return normalizePhone(phone, this.country);
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