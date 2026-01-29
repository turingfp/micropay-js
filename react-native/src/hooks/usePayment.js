/**
 * usePayment Hook - React Native Payment Flow Management
 * 
 * Provides state management and methods for the payment flow.
 */

import { useState, useCallback } from 'react';
import { useMicropay } from '../MicropayProvider';

/**
 * Hook for managing payment flows
 * 
 * @example
 * ```jsx
 * const { initiatePayment, status, error } = usePayment();
 * 
 * const handlePay = async () => {
 *   const result = await initiatePayment({
 *     amount: 500,
 *     phoneNumber: '254712345678',
 *     description: 'Game Credits'
 *   });
 * };
 * ```
 */
export function usePayment() {
    const { client } = useMicropay();

    const [status, setStatus] = useState('idle'); // idle | loading | processing | succeeded | failed
    const [error, setError] = useState(null);
    const [paymentIntent, setPaymentIntent] = useState(null);

    /**
     * Start a new payment flow
     * This is a convenience method that creates and confirms an intent
     * 
     * Note: For production, create the intent on your server and only confirm client-side
     */
    const initiatePayment = useCallback(async ({ amount, phoneNumber, description, metadata }) => {
        setStatus('loading');
        setError(null);

        try {
            // Step 1: Create Payment Intent (normally done server-side)
            const intent = await client.createPaymentIntent({
                amount,
                customerPhone: phoneNumber,
                description,
                metadata
            });

            setPaymentIntent(intent);
            setStatus('processing');

            // Step 2: Confirm (triggers STK Push)
            await client.confirmPaymentIntent(intent.id, {
                clientSecret: intent.client_secret,
                phoneNumber
            });

            // Step 3: Poll for result
            const finalIntent = await client.pollPaymentStatus(intent.id, {
                maxAttempts: 12,
                intervalMs: 5000,
                onStatusChange: (newStatus) => {
                    if (newStatus === 'succeeded') setStatus('succeeded');
                    else if (newStatus === 'failed') setStatus('failed');
                }
            });

            setPaymentIntent(finalIntent);
            setStatus(finalIntent.status === 'succeeded' ? 'succeeded' : 'failed');

            return finalIntent;

        } catch (err) {
            setError(err.message);
            setStatus('failed');
            throw err;
        }
    }, [client]);

    /**
     * Confirm an existing payment intent (client-side only)
     * Use this when you create intents on your server
     */
    const confirmPayment = useCallback(async ({ intentId, clientSecret, phoneNumber }) => {
        setStatus('processing');
        setError(null);

        try {
            await client.confirmPaymentIntent(intentId, { clientSecret, phoneNumber });

            const finalIntent = await client.pollPaymentStatus(intentId, {
                onStatusChange: (newStatus) => {
                    if (newStatus === 'succeeded') setStatus('succeeded');
                    else if (newStatus === 'failed') setStatus('failed');
                }
            });

            setPaymentIntent(finalIntent);
            setStatus(finalIntent.status === 'succeeded' ? 'succeeded' : 'failed');

            return finalIntent;

        } catch (err) {
            setError(err.message);
            setStatus('failed');
            throw err;
        }
    }, [client]);

    /**
     * Reset state for a new payment
     */
    const reset = useCallback(() => {
        setStatus('idle');
        setError(null);
        setPaymentIntent(null);
    }, []);

    return {
        // State
        status,
        error,
        paymentIntent,
        isLoading: status === 'loading',
        isProcessing: status === 'processing',
        isSucceeded: status === 'succeeded',
        isFailed: status === 'failed',

        // Methods
        initiatePayment,
        confirmPayment,
        reset
    };
}
