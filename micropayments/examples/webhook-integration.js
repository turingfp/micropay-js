/**
 * Webhook Integration Example
 * Demonstrates setting up Express server with callback handler for mPesa webhooks
 */

import express from 'express';
import {
    PaymentGateway,
    createCallbackHandler,
    createTestCallbackReceiver
} from '@paymentsds/micropayments';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize the payment gateway
const gateway = new PaymentGateway({
    provider: 'mpesa',
    credentials: {
        apiKey: process.env.MPESA_API_KEY,
        publicKey: process.env.MPESA_PUBLIC_KEY,
        serviceProviderCode: process.env.MPESA_SERVICE_PROVIDER_CODE,
    },
    environment: 'sandbox',
});

// In-memory store for pending payments (use a database in production)
const pendingPayments = new Map();

// Set up webhook handler for mPesa callbacks
app.use('/webhooks/mpesa', createCallbackHandler({
    /**
     * Called when a payment completes successfully
     */
    onPaymentComplete: async (data) => {
        console.log('🎉 Payment completed!', {
            transactionId: data.transactionId,
            reference: data.reference,
        });

        // Look up the pending payment
        const pendingPayment = pendingPayments.get(data.reference);
        if (pendingPayment) {
            // Grant the feature/item to the user
            await grantFeatureToUser(pendingPayment.userId, pendingPayment.featureId);

            // Clean up
            pendingPayments.delete(data.reference);
        }
    },

    /**
     * Called when a payment fails
     */
    onPaymentFailed: async (data, error) => {
        console.log('💔 Payment failed:', {
            reference: data.reference,
            error: error.message,
        });

        // Notify user of failure
        const pendingPayment = pendingPayments.get(data.reference);
        if (pendingPayment) {
            await notifyUserOfFailure(pendingPayment.userId, error.message);
            pendingPayments.delete(data.reference);
        }
    },

    /**
     * Called when a refund completes
     */
    onRefundComplete: async (data) => {
        console.log('💰 Refund completed:', data.transactionId);
        // Revoke the feature that was refunded
    },
}, {
    logRequests: true, // Enable for debugging
}));

// API endpoint to initiate a payment
app.post('/api/purchase', async (req, res) => {
    const { customerPhone, featureId, userId } = req.body;

    try {
        // Generate a unique reference
        const reference = `purchase_${featureId}_${Date.now()}`;

        // Store pending payment info
        pendingPayments.set(reference, {
            userId,
            featureId,
            customerPhone,
            createdAt: new Date(),
        });

        // Initiate the payment
        const result = await gateway.charge({
            customerPhone,
            amount: 100,
            currency: 'MZN',
            reference,
            description: `Purchase: ${featureId}`,
        });

        res.json({
            success: true,
            message: 'Payment initiated. Complete payment on your phone.',
            reference: reference,
            transactionId: result.transactionId,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
        });
    }
});

// API endpoint to check payment status
app.get('/api/purchase/:reference/status', async (req, res) => {
    const { reference } = req.params;

    const pending = pendingPayments.get(reference);
    if (pending) {
        res.json({
            status: 'pending',
            createdAt: pending.createdAt,
        });
    } else {
        // Check if it was completed (would be in your database in production)
        res.json({
            status: 'unknown',
            message: 'Payment may have completed or expired',
        });
    }
});

// Mock functions - implement these for your app
async function grantFeatureToUser(userId, featureId) {
    console.log(`✅ Granting feature "${featureId}" to user "${userId}"`);
    // Update your database to grant the feature
}

async function notifyUserOfFailure(userId, errorMessage) {
    console.log(`📧 Notifying user "${userId}" of payment failure: ${errorMessage}`);
    // Send push notification or email
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📬 Webhook endpoint: http://localhost:${PORT}/webhooks/mpesa`);
    console.log(`🛒 Purchase endpoint: POST http://localhost:${PORT}/api/purchase`);
});
