/**
 * PaymentPopup - Mobile-optimized payment UI
 * 
 * Features:
 * - Full-screen on mobile devices
 * - Large touch targets (48px minimum)
 * - Swipe-to-close gesture
 * - Safe area padding for notched phones
 * - Haptic feedback support
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useMicropayContext } from '../MicropayProvider.jsx';
import { PhoneInput } from './PhoneInput.jsx';

const STEPS = {
    PHONE: 'phone',
    PROCESSING: 'processing',
    AWAITING: 'awaiting',
    SUCCESS: 'success',
    ERROR: 'error',
};

// Haptic feedback helper
const triggerHaptic = (type = 'light') => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
        const patterns = {
            light: [10],
            medium: [20],
            success: [10, 50, 30],
            error: [50, 30, 50],
        };
        navigator.vibrate(patterns[type] || patterns.light);
    }
};

export function PaymentPopup({
    onClose: externalOnClose,
    className = '',
    fullScreenOnMobile = true,
    enableSwipeClose = true,
    enableHaptics = true,
    premium = true,
    glass = false,
}) {
    const {
        isPopupOpen,
        closePopup,
        popupConfig,
        processPayment,
        micropay,
        currency,
        theme,
        branding,
    } = useMicropayContext();

    const [step, setStep] = useState(STEPS.PHONE);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(null);
    const [paymentError, setPaymentError] = useState(null);
    const [transaction, setTransaction] = useState(null);
    const [swipeY, setSwipeY] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);

    const popupRef = useRef(null);
    const startYRef = useRef(0);

    // Detect mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    // Reset state when popup opens
    useEffect(() => {
        if (isPopupOpen) {
            setStep(STEPS.PHONE);
            setPhone('');
            setPhoneError(null);
            setPaymentError(null);
            setTransaction(null);
            setSwipeY(0);

            // Prevent body scroll on mobile
            if (typeof document !== 'undefined') {
                document.body.style.overflow = 'hidden';
            }
        } else {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        }

        return () => {
            if (typeof document !== 'undefined') {
                document.body.style.overflow = '';
            }
        };
    }, [isPopupOpen]);

    // Swipe handlers
    const handleTouchStart = useCallback((e) => {
        if (!enableSwipeClose) return;
        startYRef.current = e.touches[0].clientY;
        setIsSwiping(true);
    }, [enableSwipeClose]);

    const handleTouchMove = useCallback((e) => {
        if (!isSwiping || !enableSwipeClose) return;
        const currentY = e.touches[0].clientY;
        const deltaY = currentY - startYRef.current;

        // Only allow downward swipe
        if (deltaY > 0) {
            setSwipeY(deltaY);
        }
    }, [isSwiping, enableSwipeClose]);

    const handleTouchEnd = useCallback(() => {
        if (!enableSwipeClose) return;
        setIsSwiping(false);

        // If swiped more than 100px, close
        if (swipeY > 100) {
            handleClose();
        }
        setSwipeY(0);
    }, [swipeY, enableSwipeClose]);

    const handleClose = useCallback(() => {
        if (enableHaptics) triggerHaptic('light');
        closePopup();
        externalOnClose?.();
        popupConfig?.onCancel?.();
    }, [closePopup, externalOnClose, popupConfig, enableHaptics]);

    const handleSubmitPhone = useCallback(async (e) => {
        e.preventDefault();
        setPhoneError(null);

        if (!phone || phone.length < 9) {
            setPhoneError('Please enter a valid phone number');
            if (enableHaptics) triggerHaptic('error');
            return;
        }

        if (micropay && !micropay.validatePhone(phone)) {
            setPhoneError('Invalid phone number format');
            if (enableHaptics) triggerHaptic('error');
            return;
        }

        if (enableHaptics) triggerHaptic('medium');
        setStep(STEPS.PROCESSING);

        try {
            const result = await processPayment({
                amount: popupConfig.amount,
                productId: popupConfig.productId,
                description: popupConfig.description,
                metadata: popupConfig.metadata,
                customerPhone: phone,
                onSuccess: (data) => {
                    setTransaction(data.transaction);
                    setStep(STEPS.SUCCESS);
                    if (enableHaptics) triggerHaptic('success');
                    popupConfig?.onSuccess?.(data);
                },
                onError: (error) => {
                    setPaymentError(error);
                    setStep(STEPS.ERROR);
                    if (enableHaptics) triggerHaptic('error');
                    popupConfig?.onError?.(error);
                },
            });

            if (result?.pendingConfirmation) {
                setStep(STEPS.AWAITING);
            }
        } catch (error) {
            setPaymentError(error);
            setStep(STEPS.ERROR);
            if (enableHaptics) triggerHaptic('error');
        }
    }, [phone, micropay, processPayment, popupConfig, enableHaptics]);

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    if (!isPopupOpen || !popupConfig) return null;

    const popupClasses = [
        'micropay-popup',
        isMobile && fullScreenOnMobile ? 'micropay-popup--fullscreen' : '',
        theme === 'dark' ? 'micropay-dark' : '',
        glass ? 'micropay-popup--glass' : '',
        className,
    ].filter(Boolean).join(' ');

    const getStepIndex = () => {
        switch (step) {
            case STEPS.PHONE: return 0;
            case STEPS.PROCESSING: return 1;
            case STEPS.AWAITING: return 2;
            case STEPS.SUCCESS: return 3;
            case STEPS.ERROR: return 3;
            default: return 0;
        }
    };

    const StepProgress = () => (
        <div className="micropay-step-progress">
            <div className={`micropay-step-progress__dot ${getStepIndex() >= 0 ? 'micropay-step-progress__dot--active' : ''} ${getStepIndex() > 0 ? 'micropay-step-progress__dot--completed' : ''}`} />
            <div className={`micropay-step-progress__line ${getStepIndex() > 0 ? 'micropay-step-progress__line--completed' : ''}`} />
            <div className={`micropay-step-progress__dot ${getStepIndex() >= 1 ? 'micropay-step-progress__dot--active' : ''} ${getStepIndex() > 1 ? 'micropay-step-progress__dot--completed' : ''}`} />
            <div className={`micropay-step-progress__line ${getStepIndex() > 1 ? 'micropay-step-progress__line--completed' : ''}`} />
            <div className={`micropay-step-progress__dot ${getStepIndex() >= 2 ? 'micropay-step-progress__dot--active' : ''} ${getStepIndex() > 2 ? 'micropay-step-progress__dot--completed' : ''}`} />
            <div className={`micropay-step-progress__line ${getStepIndex() > 2 ? 'micropay-step-progress__line--completed' : ''}`} />
            <div className={`micropay-step-progress__dot ${getStepIndex() >= 3 ? 'micropay-step-progress__dot--active' : ''}`} />
        </div>
    );

    return (
        <div
            className={`micropay-popup-overlay ${theme === 'dark' ? 'micropay-dark' : ''}`}
            onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
            <div
                ref={popupRef}
                className={popupClasses}
                role="dialog"
                aria-modal="true"
                aria-labelledby="micropay-title"
                style={{
                    transform: swipeY > 0 ? `translateY(${swipeY}px)` : undefined,
                    transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Swipe indicator for mobile */}
                {isMobile && enableSwipeClose && (
                    <div className="micropay-popup__swipe-indicator">
                        <div className="micropay-popup__swipe-bar" />
                    </div>
                )}

                {/* Step Progress */}
                {premium && <StepProgress />}

                {/* Header */}
                <div className={`micropay-popup__header ${premium ? 'micropay-popup__header--premium' : ''}`}>
                    <div className="micropay-popup__secure">
                        <span className={`micropay-popup__lock ${premium ? 'micropay-popup__lock--animated' : ''}`}>🔒</span>
                        <span className="micropay-popup__secure-text">Secure Payment</span>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="micropay-popup__close"
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Amount Display */}
                <div className="micropay-popup__amount-box">
                    <div className="micropay-popup__description" id="micropay-title">
                        {popupConfig.description || 'Payment'}
                    </div>
                    <div className="micropay-popup__amount">
                        <span className="micropay-popup__amount-value">{formatAmount(popupConfig.amount)}</span>
                        <span className="micropay-popup__currency">{currency}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="micropay-popup__content">
                    {step === STEPS.PHONE && (
                        <form onSubmit={handleSubmitPhone} className="micropay-popup__form">
                            <label className="micropay-popup__label" htmlFor="micropay-phone">
                                Enter your mobile money number
                            </label>
                            <PhoneInput
                                id="micropay-phone"
                                value={phone}
                                onChange={setPhone}
                                error={phoneError}
                                country={micropay?.country || 'MZ'}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className="micropay-popup__submit"
                                disabled={!phone}
                            >
                                <span className="micropay-popup__submit-icon">📱</span>
                                Pay with mPesa
                            </button>
                            <p className="micropay-popup__hint">
                                You'll receive a prompt on your phone to confirm
                            </p>
                        </form>
                    )}

                    {step === STEPS.PROCESSING && (
                        <div className="micropay-popup__status">
                            <div className="micropay-popup__spinner" />
                            <div className="micropay-popup__status-text">
                                Processing payment...
                            </div>
                            <div className="micropay-popup__status-subtext">
                                Please wait
                            </div>
                        </div>
                    )}

                    {step === STEPS.AWAITING && (
                        <div className="micropay-popup__status micropay-popup__status--awaiting">
                            <div className="micropay-popup__phone-icon">📱</div>
                            <div className="micropay-popup__status-text">
                                Check your phone
                            </div>
                            <div className="micropay-popup__status-subtext">
                                Open your mPesa app and confirm the payment of {formatAmount(popupConfig.amount)} {currency}
                            </div>
                            <div className="micropay-popup__awaiting-steps">
                                <div className="micropay-popup__step">
                                    <span className="micropay-popup__step-number">1</span>
                                    <span>Open mPesa notification</span>
                                </div>
                                <div className="micropay-popup__step">
                                    <span className="micropay-popup__step-number">2</span>
                                    <span>Enter your PIN</span>
                                </div>
                                <div className="micropay-popup__step">
                                    <span className="micropay-popup__step-number">3</span>
                                    <span>Confirm payment</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === STEPS.SUCCESS && (
                        <div className="micropay-popup__status micropay-popup__status--success">
                            <div className="micropay-popup__success-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M20 6L9 17l-5-5" />
                                </svg>
                            </div>
                            <div className="micropay-popup__status-text">
                                Payment Successful!
                            </div>
                            {transaction && (
                                <div className="micropay-popup__receipt">
                                    <div className="micropay-popup__receipt-row">
                                        <span>Transaction ID</span>
                                        <span>{transaction.id}</span>
                                    </div>
                                    <div className="micropay-popup__receipt-row">
                                        <span>Amount</span>
                                        <span>{formatAmount(popupConfig.amount)} {currency}</span>
                                    </div>
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={handleClose}
                                className="micropay-popup__submit"
                            >
                                Done
                            </button>
                        </div>
                    )}

                    {step === STEPS.ERROR && (
                        <div className="micropay-popup__status micropay-popup__status--error">
                            <div className="micropay-popup__error-icon">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="micropay-popup__status-text">
                                Payment Failed
                            </div>
                            <div className="micropay-popup__status-subtext">
                                {paymentError?.message || 'Something went wrong. Please try again.'}
                            </div>
                            <button
                                type="button"
                                onClick={() => setStep(STEPS.PHONE)}
                                className="micropay-popup__submit"
                            >
                                Try Again
                            </button>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="micropay-popup__cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>

                {/* Branding */}
                {branding && (
                    <div className="micropay-popup__branding">
                        Secured by <strong>Micropay</strong>
                    </div>
                )}
            </div>
        </div>
    );
}
