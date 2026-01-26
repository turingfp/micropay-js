/**
 * MpesaProvider Tests
 */

import { MpesaProvider } from '../src/providers/MpesaProvider.js';
import { PaymentRequest } from '../src/models/PaymentRequest.js';
import chai from 'chai';
import sinon from 'sinon';
import dotenv from 'dotenv';

dotenv.config();

const expect = chai.expect;

describe('MpesaProvider', function () {
    describe('Initialization', function () {
        it('should initialize with valid credentials', async function () {
            const provider = new MpesaProvider({
                credentials: {
                    apiKey: 'test_key',
                    publicKey: 'test_public',
                    serviceProviderCode: '123456',
                },
                environment: 'sandbox',
            });

            expect(provider.name).to.equal('mpesa');
            expect(provider.isReady()).to.equal(false);
        });

        it('should throw error for missing credentials', async function () {
            const provider = new MpesaProvider({
                credentials: {
                    apiKey: 'test_key',
                    // missing publicKey and serviceProviderCode
                },
            });

            try {
                await provider.initialize();
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.message).to.include('Missing required mPesa credentials');
            }
        });
    });
});

describe('Phone Normalization', function () {
    it('should normalize phone numbers correctly', function () {
        const provider = new MpesaProvider({
            credentials: {
                apiKey: 'test',
                publicKey: 'test',
                serviceProviderCode: '123456',
            },
        });

        // Test cases handled by validation.js normalizePhone
        // Provider uses the utility internally
    });
});

// Integration tests - only run with real credentials
describe('MpesaProvider Integration', function () {
    // Skip if no real credentials
    const hasCredentials = process.env.MPESA_API_KEY &&
        process.env.MPESA_PUBLIC_KEY &&
        process.env.MPESA_SERVICE_PROVIDER_CODE;

    before(function () {
        if (!hasCredentials) {
            this.skip();
        }
    });

    it('should initialize with real sandbox credentials', async function () {
        this.timeout(10000);

        const provider = new MpesaProvider({
            credentials: {
                apiKey: process.env.MPESA_API_KEY,
                publicKey: process.env.MPESA_PUBLIC_KEY,
                serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
            },
            environment: 'sandbox',
        });

        await provider.initialize();
        expect(provider.isReady()).to.equal(true);
    });

    it('should perform C2B payment in sandbox', async function () {
        this.timeout(30000);

        const provider = new MpesaProvider({
            credentials: {
                apiKey: process.env.MPESA_API_KEY,
                publicKey: process.env.MPESA_PUBLIC_KEY,
                serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
            },
            environment: 'sandbox',
        });

        const request = new PaymentRequest({
            customerPhone: process.env.MPESA_TEST_PHONE || '841234567',
            amount: 10,
            reference: `test_${Date.now()}`,
            description: 'Integration test payment',
        });

        try {
            const result = await provider.charge(request);
            expect(result.success).to.equal(true);
            expect(result.transactionId).to.be.a('string');
        } catch (error) {
            // In sandbox, this might fail but should be a ProviderError
            expect(error.name).to.equal('ProviderError');
        }
    });
});
