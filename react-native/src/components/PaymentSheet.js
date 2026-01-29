/**
 * PaymentSheet - Bottom Sheet Payment UI for React Native
 * 
 * A pre-built, customizable payment modal that handles the entire payment flow.
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { usePayment } from '../hooks/usePayment';
import { MpesaPhoneInput } from './MpesaPhoneInput';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * PaymentSheet Component
 * 
 * @example
 * ```jsx
 * <PaymentSheet
 *   visible={showPayment}
 *   onClose={() => setShowPayment(false)}
 *   amount={500}
 *   description="Premium Upgrade"
 *   onSuccess={(intent) => console.log('Paid!', intent)}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
export function PaymentSheet({
    visible,
    onClose,
    amount,
    currency = 'KES',
    description,
    metadata,
    onSuccess,
    onError,
    theme = 'dark'
}) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [countryCode, setCountryCode] = useState('KE');
    const { initiatePayment, status, error, paymentIntent, reset } = usePayment();
    const slideAnim = useState(new Animated.Value(SCREEN_HEIGHT))[0];

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true
            }).start();
        }
    }, [visible]);

    useEffect(() => {
        if (status === 'succeeded' && paymentIntent) {
            onSuccess?.(paymentIntent);
        } else if (status === 'failed' && error) {
            onError?.(error);
        }
    }, [status, paymentIntent, error]);

    const handlePay = async () => {
        if (!phoneNumber || phoneNumber.length < 9) return;

        try {
            // Format to international standard
            const formattedPhone = MpesaPhoneInput.formatNumber(phoneNumber, countryCode);

            await initiatePayment({
                amount,
                phoneNumber: formattedPhone,
                description,
                metadata
            });
        } catch (err) {
            // Error handled in usePayment
        }
    };

    const handleClose = () => {
        reset();
        setPhoneNumber('');
        onClose?.();
    };

    const styles = theme === 'dark' ? darkStyles : lightStyles;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={handleClose}
                />

                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.handle} />
                        <Text style={styles.title}>Pay with M-Pesa</Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount</Text>
                        <Text style={styles.amount}>{currency} {amount?.toLocaleString()}</Text>
                        {description && <Text style={styles.description}>{description}</Text>}
                    </View>

                    {status === 'idle' || status === 'loading' ? (
                        <View style={styles.form}>
                            <Text style={styles.inputLabel}>M-Pesa Phone Number</Text>

                            <MpesaPhoneInput
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                onChangeCountry={(c) => setCountryCode(c.code)}
                                defaultCountry={countryCode}
                                inputStyle={styles.phoneInput}
                                style={styles.phoneInputContainer}
                                theme={theme}
                            />

                            <Text style={styles.inputHint}>
                                You'll receive an STK push to confirm payment
                            </Text>

                            <TouchableOpacity
                                style={[styles.payButton, !phoneNumber && styles.payButtonDisabled]}
                                onPress={handlePay}
                                disabled={!phoneNumber || status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <ActivityIndicator color="#000" />
                                ) : (
                                    <Text style={styles.payButtonText}>Pay {currency} {amount}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ) : null}

                    {/* Processing State */}
                    {status === 'processing' && (
                        <View style={styles.statusContainer}>
                            <ActivityIndicator size="large" color="#00FF6A" />
                            <Text style={styles.statusTitle}>Check your phone</Text>
                            <Text style={styles.statusSubtitle}>
                                Enter your M-Pesa PIN to complete the payment
                            </Text>
                        </View>
                    )}

                    {/* Success State */}
                    {status === 'succeeded' && (
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusIcon}>✓</Text>
                            <Text style={styles.statusTitle}>Payment Successful!</Text>
                            <Text style={styles.statusSubtitle}>
                                Transaction ID: {paymentIntent?.id?.substring(0, 12)}...
                            </Text>
                            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
                                <Text style={styles.doneButtonText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Error State */}
                    {status === 'failed' && (
                        <View style={styles.statusContainer}>
                            <Text style={[styles.statusIcon, { color: '#FF4444' }]}>✕</Text>
                            <Text style={styles.statusTitle}>Payment Failed</Text>
                            <Text style={styles.statusSubtitle}>{error}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={reset}>
                                <Text style={styles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Secured by Micropay</Text>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const darkStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end'
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    sheet: {
        backgroundColor: '#1A1A1A',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        maxHeight: SCREEN_HEIGHT * 0.85
    },
    header: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333'
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
        marginBottom: 16
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF'
    },
    closeButton: {
        position: 'absolute',
        right: 20,
        top: 20
    },
    closeText: {
        fontSize: 20,
        color: '#888'
    },
    amountContainer: {
        alignItems: 'center',
        paddingVertical: 24
    },
    amountLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4
    },
    amount: {
        fontSize: 36,
        fontWeight: '700',
        color: '#FFF'
    },
    description: {
        fontSize: 14,
        color: '#888',
        marginTop: 8
    },
    form: {
        paddingHorizontal: 24
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFF',
        marginBottom: 8
    },
    input: {
        backgroundColor: '#0D0D0D',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: '#FFF'
    },
    inputHint: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        marginBottom: 24
    },
    payButton: {
        backgroundColor: '#00FF6A',
        borderRadius: 12,
        padding: 18,
        alignItems: 'center'
    },
    payButtonDisabled: {
        opacity: 0.5
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000'
    },
    statusContainer: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 24
    },
    statusIcon: {
        fontSize: 64,
        color: '#00FF6A',
        marginBottom: 16
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF',
        marginBottom: 8
    },
    statusSubtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center'
    },
    doneButton: {
        backgroundColor: '#00FF6A',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 48,
        marginTop: 24
    },
    doneButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000'
    },
    retryButton: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 48,
        marginTop: 24
    },
    retryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFF'
    },
    footer: {
        alignItems: 'center',
        paddingTop: 16
    },
    footerText: {
        fontSize: 12,
        color: '#444'
    }
});

const lightStyles = StyleSheet.create({
    ...darkStyles,
    sheet: {
        ...darkStyles.sheet,
        backgroundColor: '#FFF'
    },
    title: {
        ...darkStyles.title,
        color: '#000'
    },
    amount: {
        ...darkStyles.amount,
        color: '#000'
    },
    input: {
        ...darkStyles.input,
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0',
        color: '#000'
    },
    inputLabel: {
        ...darkStyles.inputLabel,
        color: '#000'
    },
    statusTitle: {
        ...darkStyles.statusTitle,
        color: '#000'
    }
});
