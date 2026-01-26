/**
 * Input validation utilities for micropayments
 */

import { ValidationError } from './errors.js';

/**
 * Phone number patterns by country/provider
 */
const PHONE_PATTERNS = {
    // Mozambique mPesa: 84/85 prefix
    MZ: /^((00|\+)?(258))?8[45][0-9]{7}$/,
    // Kenya mPesa: 07/01 prefix
    KE: /^((00|\+)?(254))?(7|1)[0-9]{8}$/,
    // Pakistan Jazzcash: 03 prefix (future)
    PK: /^((00|\+)?(92))?3[0-9]{9}$/,
};

/**
 * Validates a phone number against known patterns
 * @param {string} phone - Phone number to validate
 * @param {string} country - Country code (MZ, KE, PK)
 * @returns {boolean}
 */
export function isValidPhone(phone, country = 'MZ') {
    if (!phone || typeof phone !== 'string') {
        return false;
    }
    const pattern = PHONE_PATTERNS[country] || PHONE_PATTERNS.MZ;
    return pattern.test(phone.replace(/\s/g, ''));
}

/**
 * Validates payment amount
 * @param {number|string} amount - Amount to validate
 * @returns {boolean}
 */
export function isValidAmount(amount) {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return !isNaN(numAmount) && numAmount > 0 && isFinite(numAmount);
}

/**
 * Validates a reference/transaction ID
 * @param {string} reference - Reference to validate
 * @returns {boolean}
 */
export function isValidReference(reference) {
    if (!reference || typeof reference !== 'string') {
        return false;
    }
    // Alphanumeric, underscores, hyphens; max 50 chars
    return /^[\w\-]{1,50}$/.test(reference);
}

/**
 * Validates payment request data
 * @param {Object} data - Payment request data
 * @throws {ValidationError}
 */
export function validatePaymentRequest(data) {
    const errors = [];

    if (!data.customerPhone || !isValidPhone(data.customerPhone, data.country)) {
        errors.push({ field: 'customerPhone', message: 'Invalid phone number format' });
    }

    if (!isValidAmount(data.amount)) {
        errors.push({ field: 'amount', message: 'Amount must be a positive number' });
    }

    if (!data.reference || !isValidReference(data.reference)) {
        errors.push({ field: 'reference', message: 'Invalid reference format (alphanumeric, max 50 chars)' });
    }

    if (errors.length > 0) {
        const error = new ValidationError(
            `Validation failed: ${errors.map(e => e.message).join(', ')}`,
            errors[0].field
        );
        error.errors = errors;
        throw error;
    }
}

/**
 * Normalizes phone number to international format
 * @param {string} phone - Phone number
 * @param {string} countryCode - Country code (e.g., '258' for Mozambique)
 * @returns {string}
 */
export function normalizePhone(phone, countryCode = '258') {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Remove leading + or 00
    cleaned = cleaned.replace(/^(\+|00)/, '');

    // If it doesn't start with country code, add it
    if (!cleaned.startsWith(countryCode)) {
        cleaned = countryCode + cleaned;
    }

    return cleaned;
}
