/**
 * MicropayButton - Pre-styled payment button for React Native
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Ready-to-use payment button component
 * 
 * @example
 * ```jsx
 * <MicropayButton
 *   amount={500}
 *   label="Buy Now"
 *   onPress={() => setShowPaymentSheet(true)}
 * />
 * ```
 */
export function MicropayButton({
    onPress,
    amount,
    currency = 'KES',
    label,
    loading = false,
    disabled = false,
    variant = 'primary', // 'primary' | 'outline' | 'ghost'
    size = 'large', // 'small' | 'medium' | 'large'
    style
}) {
    const buttonLabel = label || `Pay ${currency} ${amount?.toLocaleString()}`;

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];

        if (variant === 'outline') {
            baseStyle.push(styles.outline);
        } else if (variant === 'ghost') {
            baseStyle.push(styles.ghost);
        } else {
            baseStyle.push(styles.primary);
        }

        if (disabled || loading) {
            baseStyle.push(styles.disabled);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`${size}Text`]];

        if (variant === 'outline' || variant === 'ghost') {
            baseStyle.push(styles.outlineText);
        }

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#000' : '#00FF6A'} />
            ) : (
                <Text style={getTextStyle()}>{buttonLabel}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    primary: {
        backgroundColor: '#00FF6A'
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#00FF6A'
    },
    ghost: {
        backgroundColor: 'transparent'
    },
    disabled: {
        opacity: 0.5
    },
    small: {
        paddingVertical: 10,
        paddingHorizontal: 16
    },
    medium: {
        paddingVertical: 14,
        paddingHorizontal: 24
    },
    large: {
        paddingVertical: 18,
        paddingHorizontal: 32
    },
    text: {
        fontWeight: '600',
        color: '#000'
    },
    smallText: {
        fontSize: 14
    },
    mediumText: {
        fontSize: 16
    },
    largeText: {
        fontSize: 18
    },
    outlineText: {
        color: '#00FF6A'
    }
});
