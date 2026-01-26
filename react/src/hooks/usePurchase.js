/**
 * usePurchase - Simplified hook for in-app purchases
 */

import { useState, useCallback } from 'react';
import { useMicropayContext } from '../MicropayProvider.jsx';

/**
 * Simplified purchase hook for one-click payments
 * 
 * @example
 * const { purchase, isProcessing, error } = usePurchase();
 * 
 * <button onClick={() => purchase({
 *   amount: 50,
 *   productId: 'premium',
 *   description: 'Unlock Premium',
 *   onSuccess: (txn) => unlockFeature()
 * })}>
 *   Buy Premium
 * </button>
 */
export function usePurchase() {
    const { openPopup, processPayment, micropay, currency } = useMicropayContext();

    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [lastTransaction, setLastTransaction] = useState(null);

    /**
     * Initiate a purchase - opens payment popup if no phone provided
     */
    const purchase = useCallback(async (options) => {
        setIsProcessing(true);
        setError(null);

        try {
            // If customer phone is provided, process directly
            if (options.customerPhone) {
                const result = await processPayment({
                    amount: options.amount,
                    productId: options.productId,
                    description: options.description,
                    metadata: options.metadata,
                    customerPhone: options.customerPhone,
                    onSuccess: (data) => {
                        setLastTransaction(data.transaction);
                        setIsProcessing(false);
                        options.onSuccess?.(data.transaction);
                    },
                    onError: (err) => {
                        setError(err);
                        setIsProcessing(false);
                        options.onError?.(err);
                    },
                });

                return result;
            }

            // Otherwise, open the payment popup
            openPopup({
                amount: options.amount,
                productId: options.productId,
                description: options.description,
                metadata: options.metadata,
                onSuccess: (data) => {
                    setLastTransaction(data.transaction);
                    setIsProcessing(false);
                    options.onSuccess?.(data.transaction);
                },
                onError: (err) => {
                    setError(err);
                    setIsProcessing(false);
                    options.onError?.(err);
                },
                onCancel: () => {
                    setIsProcessing(false);
                    options.onCancel?.();
                },
            });

            return { popupOpened: true };
        } catch (err) {
            setError(err);
            setIsProcessing(false);
            options.onError?.(err);
            throw err;
        }
    }, [openPopup, processPayment]);

    /**
     * Quick purchase with popup
     */
    const quickPurchase = useCallback((productConfig) => {
        return purchase({
            ...productConfig,
            // Will open popup for phone input
        });
    }, [purchase]);

    return {
        purchase,
        quickPurchase,
        isProcessing,
        error,
        lastTransaction,
        currency,
        clearError: () => setError(null),
    };
}
