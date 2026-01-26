/**
 * useMicropay - Core hook for Micropay functionality
 */

import { useMicropayContext } from '../MicropayProvider.jsx';

/**
 * Core hook for accessing Micropay SDK
 * 
 * @example
 * const { micropay, createSession, processPayment } = useMicropay();
 */
export function useMicropay() {
    const { micropay, currentSession, processPayment, provider, environment, currency } = useMicropayContext();

    return {
        // SDK instance
        micropay,

        // Current state
        currentSession,
        provider,
        environment,
        currency,

        // Actions
        createSession: (options) => micropay.createSession(options),
        processPayment,
        getSession: (id) => micropay.getSession(id),
        cancelSession: (id) => micropay.cancelSession(id),

        // Utilities
        validatePhone: (phone) => micropay.validatePhone(phone),
        getInfo: () => micropay.getInfo(),
    };
}
