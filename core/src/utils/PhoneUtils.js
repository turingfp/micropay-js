import { parsePhoneNumberFromString } from 'libphonenumber-js';

/**
 * Normalizes phone numbers for M-Pesa and other providers.
 * Converts to E.164 format but removes the leading '+' for Safaricom compatibility.
 * 
 * @param {string} phone - Raw phone number input
 * @param {string} defaultRegion - Default region code (e.g., 'KE')
 * @returns {string} Normalized digits (e.g., "254712345678")
 */
export function normalizePhone(phone, defaultRegion = 'KE') {
    if (!phone) return '';

    // Remove any character that isn't a digit or plus
    const cleaned = phone.replace(/[^\d+]/g, '');

    const phoneNumber = parsePhoneNumberFromString(cleaned, defaultRegion);

    if (phoneNumber && phoneNumber.isValid()) {
        // E.164 format is +[countryCode][number]
        // M-Pesa expects [countryCode][number] without the plus
        return phoneNumber.format('E.164').replace('+', '');
    }

    // Fallback: Manually cleanup if library fails (brute force)
    let digits = cleaned.replace(/\D/g, '');

    // Most East African numbers are 9 digits (local) or 12 digits (int'l)
    if (digits.startsWith('0') && digits.length === 10) {
        // Kenyan 07xx... or 01xx... -> 2547xx...
        const prefix = defaultRegion === 'KE' ? '254' : '254'; // Expand for other countries as needed
        return prefix + digits.substring(1);
    }

    return digits;
}

/**
 * Validates a phone number for a given region.
 * 
 * @param {string} phone - Phone number to validate
 * @param {string} region - Region code (e.g., 'KE')
 * @returns {boolean}
 */
export function validatePhone(phone, region = 'KE') {
    if (!phone) return false;
    const phoneNumber = parsePhoneNumberFromString(phone, region);
    return !!(phoneNumber && phoneNumber.isValid());
}
