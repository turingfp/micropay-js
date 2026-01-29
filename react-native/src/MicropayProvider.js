/**
 * MicropayProvider - React Context Provider for React Native
 * 
 * Wraps your app to provide Micropay functionality throughout the component tree.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { MicropayClient } from './MicropayClient';

const MicropayContext = createContext(null);

/**
 * Provider component that makes Micropay available to your app
 * 
 * @example
 * ```jsx
 * import { MicropayProvider } from '@micropay/react-native';
 * 
 * export default function App() {
 *   return (
 *     <MicropayProvider publicKey="pk_test_...">
 *       <YourApp />
 *     </MicropayProvider>
 *   );
 * }
 * ```
 */
export function MicropayProvider({ children, publicKey, secretKey, apiUrl, environment = 'sandbox' }) {
    const client = useMemo(() => {
        return new MicropayClient({
            publicKey,
            secretKey,
            apiUrl,
            environment
        });
    }, [publicKey, secretKey, apiUrl, environment]);

    const value = useMemo(() => ({
        client,
        publicKey,
        environment,
        isConfigured: !!publicKey || !!secretKey
    }), [client, publicKey, environment]);

    return (
        <MicropayContext.Provider value={value}>
            {children}
        </MicropayContext.Provider>
    );
}

/**
 * Hook to access the Micropay context
 * 
 * @returns {object} Micropay context with client and configuration
 */
export function useMicropay() {
    const context = useContext(MicropayContext);

    if (!context) {
        throw new Error('useMicropay must be used within a MicropayProvider');
    }

    return context;
}
