/**
 * MpesaProvider - mPesa integration
 */

import { Client } from '@paymentsds/mpesa';
import { ConfigurationError, PaymentError, NetworkError } from '../errors.js';

export class MpesaProvider {
    constructor(config = {}) {
        this.name = 'mpesa';
        this.credentials = config.credentials || {};
        this.environment = config.environment || 'sandbox';
        this.client = null;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return;

        this._validateCredentials();

        this.client = new Client({
            apiKey: this.credentials.apiKey,
            publicKey: this.credentials.publicKey,
            serviceProviderCode: this.credentials.serviceProviderCode,
            initiatorIdentifier: this.credentials.initiatorIdentifier,
            securityCredential: this.credentials.securityCredential,
            debugging: this.environment === 'sandbox',
            timeout: this.credentials.timeout || 30,
        });

        this.isInitialized = true;
    }

    _validateCredentials() {
        const required = ['apiKey', 'publicKey', 'serviceProviderCode'];
        const missing = required.filter(key => !this.credentials[key]);

        if (missing.length > 0) {
            throw new ConfigurationError(
                `Missing mPesa credentials: ${missing.join(', ')}`,
                missing
            );
        }
    }

    async charge(request) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const response = await this.client.receive({
                from: request.customerPhone,
                amount: String(request.amount),
                reference: request.reference,
                transaction: request.transactionReference,
            });

            return {
                success: true,
                transactionId: response.transaction,
                conversationId: response.conversation,
                reference: response.reference,
                providerCode: response.response?.code,
                providerMessage: response.response?.desc,
            };
        } catch (error) {
            if (error.response) {
                throw new PaymentError(
                    error.response.statusText || 'Payment failed',
                    error.response.status,
                    request.transactionReference
                );
            }
            throw new NetworkError(error.message);
        }
    }

    async refund(transactionId, amount, reference) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (!this.credentials.initiatorIdentifier || !this.credentials.securityCredential) {
            throw new ConfigurationError(
                'Refund requires initiatorIdentifier and securityCredential'
            );
        }

        try {
            const response = await this.client.revert({
                transaction: transactionId,
                amount: String(amount),
                reference: reference,
            });

            return {
                success: true,
                transactionId: response.transaction,
                providerCode: response.response?.code,
            };
        } catch (error) {
            throw new PaymentError(`Refund failed: ${error.message}`);
        }
    }

    async queryStatus(queryRef, thirdPartyRef) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            const response = await this.client.query({
                subject: queryRef,
                reference: thirdPartyRef,
            });

            return {
                success: true,
                status: response.response?.code,
                message: response.response?.desc,
            };
        } catch (error) {
            throw new PaymentError(`Query failed: ${error.message}`);
        }
    }
}
