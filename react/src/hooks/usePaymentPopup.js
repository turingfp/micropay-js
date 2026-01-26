/**
 * usePaymentPopup - Hook for controlling the payment popup
 */

import { useCallback } from 'react';
import { useMicropayContext } from '../MicropayProvider.jsx';

/**
 * Control the payment popup programmatically
 * 
 * @example
 * const { open, close, isOpen } = usePaymentPopup();
 * 
 * <button onClick={() => open({ amount: 100, productId: 'coins' })}>
 *   Buy Coins
 * </button>
 */
export function usePaymentPopup() {
    const { isPopupOpen, openPopup, closePopup, popupConfig } = useMicropayContext();

    const open = useCallback((config) => {
        openPopup(config);
    }, [openPopup]);

    const close = useCallback(() => {
        closePopup();
    }, [closePopup]);

    return {
        isOpen: isPopupOpen,
        config: popupConfig,
        open,
        close,
    };
}
