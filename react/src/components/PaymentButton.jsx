/**
 * PaymentButton - Pre-styled payment trigger button
 */

import React from 'react';
import { usePurchase } from '../hooks/usePurchase.js';

export function PaymentButton({
    amount,
    productId,
    description,
    metadata,
    onSuccess,
    onError,
    onCancel,
    children,
    className = '',
    disabled = false,
    variant = 'primary', // 'primary' | 'secondary' | 'outline'
    size = 'medium', // 'small' | 'medium' | 'large'
    showAmount = true,
}) {
    const { purchase, isProcessing, currency } = usePurchase();

    const handleClick = async () => {
        await purchase({
            amount,
            productId,
            description,
            metadata,
            onSuccess,
            onError,
            onCancel,
        });
    };

    const formatAmount = (amt, curr) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amt) + ' ' + curr;
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled || isProcessing}
            className={`micropay-btn micropay-btn--${variant} micropay-btn--${size} ${isProcessing ? 'micropay-btn--loading' : ''} ${className}`}
        >
            {isProcessing ? (
                <span className="micropay-btn__spinner" />
            ) : null}
            <span className="micropay-btn__content">
                {children || (showAmount ? `Pay ${formatAmount(amount, currency)}` : 'Pay Now')}
            </span>
        </button>
    );
}
