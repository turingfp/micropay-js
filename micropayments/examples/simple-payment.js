/**
 * Simple Payment Example
 * Demonstrates basic micropayment collection using the PaymentGateway
 */

import { PaymentGateway } from '@paymentsds/micropayments';
import dotenv from 'dotenv';

dotenv.config();

// Initialize the gateway
const gateway = new PaymentGateway({
    provider: 'mpesa',
    credentials: {
        apiKey: process.env.MPESA_API_KEY,
        publicKey: process.env.MPESA_PUBLIC_KEY,
        serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    },
    environment: 'sandbox', // Use 'production' for live payments
});

// Subscribe to events (optional)
gateway.on('payment:success', ({ transaction, result }) => {
    console.log('✅ Payment successful!');
    console.log('   Transaction ID:', result.transactionId);
    console.log('   Amount:', result.amount, result.currency);
});

gateway.on('payment:failed', ({ transaction, error }) => {
    console.log('❌ Payment failed:', error.message);
});

// Example: Charge a customer for unlocking a premium feature
async function unlockPremiumFeature(customerPhone, featureId) {
    try {
        const result = await gateway.charge({
            customerPhone: customerPhone,
            amount: 50, // 50 MZN
            currency: 'MZN',
            reference: `premium_${featureId}`,
            description: 'Premium Feature Unlock',
            metadata: {
                featureId: featureId,
                userId: 'user_123',
            },
        });

        if (result.success) {
            console.log('Feature unlocked successfully!');
            return {
                success: true,
                transactionId: result.transactionId,
            };
        }
    } catch (error) {
        console.error('Failed to unlock feature:', error.message);
        return {
            success: false,
            error: error.message,
        };
    }
}

// Run the example
unlockPremiumFeature('841234567', 'dark_mode')
    .then(result => {
        console.log('Result:', result);
    })
    .catch(console.error);
