/**
 * PaymentGateway Tests
 */

import { PaymentGateway } from '../src/PaymentGateway.js';
import { PaymentRequest } from '../src/models/PaymentRequest.js';
import { Transaction, TransactionStatus } from '../src/models/Transaction.js';
import chai from 'chai';
import sinon from 'sinon';

const expect = chai.expect;

describe('PaymentGateway', function () {
    describe('Initialization', function () {
        it('should create gateway with mPesa provider', function () {
            const gateway = new PaymentGateway({
                provider: 'mpesa',
                credentials: {
                    apiKey: 'test_key',
                    publicKey: 'test_public',
                    serviceProviderCode: '123456',
                },
            });

            expect(gateway.providerName).to.equal('mpesa');
            expect(gateway.environment).to.equal('sandbox');
        });

        it('should throw error for missing credentials', function () {
            expect(() => {
                new PaymentGateway({
                    provider: 'mpesa',
                });
            }).to.throw('credentials are required');
        });

        it('should throw error for unknown provider', function () {
            expect(() => {
                new PaymentGateway({
                    provider: 'unknown_provider',
                    credentials: { apiKey: 'test' },
                });
            }).to.throw('Unknown provider: unknown_provider');
        });
    });

    describe('Event Subscriptions', function () {
        it('should subscribe and receive events', function (done) {
            const gateway = new PaymentGateway({
                provider: 'mpesa',
                credentials: {
                    apiKey: 'test_key',
                    publicKey: 'test_public',
                    serviceProviderCode: '123456',
                },
            });

            gateway.on('test:event', (data) => {
                expect(data.message).to.equal('hello');
                done();
            });

            // Manually emit for testing
            gateway._emit('test:event', { message: 'hello' });
        });

        it('should allow unsubscribing from events', function () {
            const gateway = new PaymentGateway({
                provider: 'mpesa',
                credentials: {
                    apiKey: 'test_key',
                    publicKey: 'test_public',
                    serviceProviderCode: '123456',
                },
            });

            let callCount = 0;
            const unsubscribe = gateway.on('test:event', () => {
                callCount++;
            });

            gateway._emit('test:event', {});
            expect(callCount).to.equal(1);

            unsubscribe();
            gateway._emit('test:event', {});
            expect(callCount).to.equal(1); // Should not increase
        });
    });

    describe('Gateway Info', function () {
        it('should return correct gateway info', function () {
            const gateway = new PaymentGateway({
                provider: 'mpesa',
                credentials: {
                    apiKey: 'test_key',
                    publicKey: 'test_public',
                    serviceProviderCode: '123456',
                },
                environment: 'production',
            });

            const info = gateway.getInfo();
            expect(info.provider).to.equal('mpesa');
            expect(info.environment).to.equal('production');
            expect(info.isInitialized).to.equal(false);
        });
    });
});

describe('PaymentRequest', function () {
    it('should create valid payment request', function () {
        const request = new PaymentRequest({
            customerPhone: '841234567',
            amount: 100,
            reference: 'test_ref_001',
            description: 'Test payment',
        });

        expect(request.customerPhone).to.equal('841234567');
        expect(request.amount).to.equal(100);
        expect(request.currency).to.equal('MZN');
        expect(request.transactionReference).to.be.a('string');
    });

    it('should convert to mPesa format', function () {
        const request = new PaymentRequest({
            customerPhone: '841234567',
            amount: 50,
            reference: 'ref_001',
        });

        const mpesaFormat = request.toMpesaFormat();
        expect(mpesaFormat.from).to.equal('841234567');
        expect(mpesaFormat.amount).to.equal('50');
        expect(mpesaFormat.reference).to.equal('ref_001');
    });

    it('should throw validation error for invalid phone', function () {
        const request = new PaymentRequest({
            customerPhone: 'invalid',
            amount: 100,
            reference: 'test_ref',
        });

        expect(() => request.validate()).to.throw('Validation failed');
    });

    it('should throw validation error for invalid amount', function () {
        const request = new PaymentRequest({
            customerPhone: '841234567',
            amount: -10,
            reference: 'test_ref',
        });

        expect(() => request.validate()).to.throw('Validation failed');
    });
});

describe('Transaction', function () {
    it('should create transaction with generated ID', function () {
        const transaction = new Transaction({
            reference: 'ref_001',
            amount: 100,
        });

        expect(transaction.id).to.match(/^txn_/);
        expect(transaction.status).to.equal(TransactionStatus.PENDING);
    });

    it('should update status correctly', function () {
        const transaction = new Transaction({});

        transaction.updateStatus(TransactionStatus.PROCESSING);
        expect(transaction.status).to.equal(TransactionStatus.PROCESSING);

        transaction.updateStatus(TransactionStatus.COMPLETED);
        expect(transaction.status).to.equal(TransactionStatus.COMPLETED);
        expect(transaction.completedAt).to.not.be.null;
    });

    it('should track retry count', function () {
        const transaction = new Transaction({});
        transaction.updateStatus(TransactionStatus.FAILED, new Error('test'));

        expect(transaction.canRetry(3)).to.be.true;

        transaction.retry();
        expect(transaction.retryCount).to.equal(1);
        expect(transaction.status).to.equal(TransactionStatus.PENDING);
    });

    it('should serialize to JSON correctly', function () {
        const transaction = new Transaction({
            reference: 'ref_001',
            amount: 100,
            currency: 'MZN',
        });

        const json = transaction.toJSON();
        expect(json.reference).to.equal('ref_001');
        expect(json.amount).to.equal(100);
        expect(json.createdAt).to.be.a('string'); // ISO string
    });

    it('should deserialize from JSON correctly', function () {
        const original = new Transaction({
            reference: 'ref_001',
            amount: 100,
        });

        const json = original.toJSON();
        const restored = Transaction.fromJSON(json);

        expect(restored.id).to.equal(original.id);
        expect(restored.reference).to.equal(original.reference);
        expect(restored.createdAt).to.be.instanceOf(Date);
    });
});
