/**
 * MicropayProvider - React context for Micropay SDK
 */

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { createMicropay } from '@micropaysdk/core';

const MicropayContext = createContext(null);

/**
 * Hook to access Micropay context
 */
export function useMicropayContext() {
    const context = useContext(MicropayContext);
    if (!context) {
        throw new Error('useMicropayContext must be used within a MicropayProvider');
    }
    return context;
}

/**
 * MicropayProvider - Wrap your app to enable Micropay payments
 * 
 * @example
 * <MicropayProvider
 *   publicKey="pk_live_xxx"
 *   provider="mpesa"
 *   environment="sandbox"
 * >
 *   <App />
 * </MicropayProvider>
 */
export function MicropayProvider({
    children,
    publicKey,
    provider = 'mpesa',
    environment = 'sandbox',
    credentials,
    country = 'KE',
    currency = 'KES',
    theme = 'light',
    branding = true,
    onError,
}) {
    const [currentSession, setCurrentSession] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupConfig, setPopupConfig] = useState(null);

    // Create Micropay instance
    const micropay = useMemo(() => {
        return createMicropay({
            publicKey,
            provider,
            environment,
            credentials,
            country,
            currency,
            onSessionUpdate: ({ session, newStatus }) => {
                setCurrentSession(session);
            },
        });
    }, [publicKey, provider, environment, country, currency]);

    // Open payment popup
    const openPopup = useCallback((config) => {
        setPopupConfig(config);
        setIsPopupOpen(true);
    }, []);

    // Close payment popup
    const closePopup = useCallback(() => {
        setIsPopupOpen(false);
        setPopupConfig(null);
    }, []);

    // Create and process a payment session
    const processPayment = useCallback(async (options) => {
        try {
            const session = micropay.createSession({
                amount: options.amount,
                productId: options.productId,
                description: options.description,
                metadata: options.metadata,
                onSuccess: options.onSuccess,
                onError: (error) => {
                    options.onError?.(error);
                    onError?.(error);
                },
                onCancel: options.onCancel,
            });

            setCurrentSession(session);

            if (options.customerPhone) {
                return await micropay.processPayment(session.id, options.customerPhone);
            }

            return { session, needsPhone: true };
        } catch (error) {
            onError?.(error);
            throw error;
        }
    }, [micropay, onError]);

    const contextValue = useMemo(() => ({
        // Core
        micropay,
        provider,
        environment,
        currency,

        // Session
        currentSession,
        setCurrentSession,

        // Popup
        isPopupOpen,
        openPopup,
        closePopup,
        popupConfig,

        // Actions
        processPayment,

        // Config
        theme,
        branding,
    }), [
        micropay, provider, environment, currency,
        currentSession, isPopupOpen, popupConfig,
        openPopup, closePopup, processPayment,
        theme, branding,
    ]);

    return (
        <MicropayContext.Provider value={contextValue}>
            {children}
        </MicropayContext.Provider>
    );
}
