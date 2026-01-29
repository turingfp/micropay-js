/**
 * MpesaPhoneInput - Phone number input with country code selector
 * 
 * Pre-configured for East African countries with M-Pesa
 */

import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    FlatList
} from 'react-native';

const COUNTRIES = [
    { code: 'KE', name: 'Kenya', prefix: '+254', flag: '🇰🇪' },
    { code: 'TZ', name: 'Tanzania', prefix: '+255', flag: '🇹🇿' },
    { code: 'UG', name: 'Uganda', prefix: '+256', flag: '🇺🇬' },
    { code: 'RW', name: 'Rwanda', prefix: '+250', flag: '🇷🇼' },
    { code: 'MW', name: 'Malawi', prefix: '+265', flag: '🇲🇼' },
    { code: 'GH', name: 'Ghana', prefix: '+233', flag: '🇬🇭' }
];

/**
 * Phone input component with country selector
 * 
 * @example
 * ```jsx
 * <MpesaPhoneInput
 *   value={phone}
 *   onChangeText={setPhone}
 *   defaultCountry="KE"
 * />
 * ```
 */
export function MpesaPhoneInput({
    value,
    onChangeText,
    onChangeCountry,
    defaultCountry = 'KE',
    placeholder = 'Phone number',
    style,
    inputStyle,
    error,
    theme = 'dark'
}) {
    const [country, setCountry] = useState(
        COUNTRIES.find(c => c.code === defaultCountry) || COUNTRIES[0]
    );
    const [showPicker, setShowPicker] = useState(false);

    const handleCountrySelect = (selectedCountry) => {
        setCountry(selectedCountry);
        onChangeCountry?.(selectedCountry);
        setShowPicker(false);
    };

    const handleTextChange = (text) => {
        // Remove non-numeric characters except +
        const cleaned = text.replace(/[^0-9]/g, '');
        onChangeText?.(cleaned);
    };

    // Format the full international number
    const getFullNumber = () => {
        let number = value || '';
        // Clean non-digits
        number = number.replace(/[^0-9]/g, '');

        if (!number) return '';

        const prefixClean = country.prefix.replace('+', '');

        // 1. Check if it already starts with the country prefix
        if (number.startsWith(prefixClean)) {
            return `+${number}`;
        }

        // 2. Remove leading 0 if present
        if (number.startsWith('0')) {
            number = number.substring(1);
        }

        return `${country.prefix}${number}`;
    };

    const isDark = theme === 'dark';
    const styles = isDark ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, style]}>
            {/* Country Selector */}
            <TouchableOpacity
                style={styles.countrySelector}
                onPress={() => setShowPicker(true)}
            >
                <Text style={styles.flag}>{country.flag}</Text>
                <Text style={styles.prefix}>{country.prefix}</Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            {/* Phone Input */}
            <TextInput
                style={[styles.input, inputStyle, error && styles.inputError]}
                value={value}
                onChangeText={handleTextChange}
                placeholder={placeholder}
                placeholderTextColor={isDark ? "#666" : "#999"}
                keyboardType="phone-pad"
                maxLength={12}
            />

            {/* Error Message */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            {/* Country Picker Modal */}
            <Modal
                visible={showPicker}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Country</Text>
                            <TouchableOpacity onPress={() => setShowPicker(false)}>
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={COUNTRIES}
                            keyExtractor={item => item.code}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.countryItem,
                                        item.code === country.code && styles.countryItemSelected
                                    ]}
                                    onPress={() => handleCountrySelect(item)}
                                >
                                    <Text style={styles.countryFlag}>{item.flag}</Text>
                                    <Text style={styles.countryName}>{item.name}</Text>
                                    <Text style={styles.countryPrefix}>{item.prefix}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// Export utility function
MpesaPhoneInput.formatNumber = (phone, countryCode = 'KE') => {
    const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
    let number = phone.replace(/[^0-9]/g, '');
    const prefixClean = country.prefix.replace('+', '');

    // Check if double prefix
    if (number.startsWith(prefixClean)) {
        return `+${number}`;
    }

    if (number.startsWith('0')) {
        number = number.substring(1);
    }

    return country.prefix + number;
};

const darkStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    countrySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderWidth: 1,
        borderColor: '#333',
        borderRightWidth: 0,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 16,
        gap: 6
    },
    flag: { fontSize: 20 },
    prefix: { fontSize: 16, color: '#FFF', fontWeight: '500' },
    arrow: { fontSize: 10, color: '#666' },
    input: {
        flex: 1,
        backgroundColor: '#0D0D0D',
        borderWidth: 1,
        borderColor: '#333',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        fontSize: 18,
        color: '#FFF'
    },
    inputError: { borderColor: '#FF4444' },
    errorText: { color: '#FF4444', fontSize: 12, marginTop: 4, position: 'absolute', bottom: -20, left: 0 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#1A1A1A', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#333' },
    modalTitle: { fontSize: 18, fontWeight: '600', color: '#FFF' },
    modalClose: { fontSize: 20, color: '#888' },
    countryItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#222' },
    countryItemSelected: { backgroundColor: '#00FF6A20' },
    countryFlag: { fontSize: 24, marginRight: 12 },
    countryName: { flex: 1, fontSize: 16, color: '#FFF' },
    countryPrefix: { fontSize: 14, color: '#888' }
});

const lightStyles = StyleSheet.create({
    ...darkStyles,
    countrySelector: {
        ...darkStyles.countrySelector,
        backgroundColor: '#F5F5F5',
        borderColor: '#E0E0E0'
    },
    prefix: { ...darkStyles.prefix, color: '#000' },
    input: {
        ...darkStyles.input,
        backgroundColor: '#FFF',
        borderColor: '#E0E0E0',
        color: '#000'
    },
    modalContent: { ...darkStyles.modalContent, backgroundColor: '#FFF' },
    modalHeader: { ...darkStyles.modalHeader, borderBottomColor: '#E0E0E0' },
    modalTitle: { ...darkStyles.modalTitle, color: '#000' },
    countryItem: { ...darkStyles.countryItem, borderBottomColor: '#EEE' },
    countryName: { ...darkStyles.countryName, color: '#000' }
});
