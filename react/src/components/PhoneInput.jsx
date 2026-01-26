/**
 * PhoneInput - Mobile-optimized phone number input
 * 
 * Features:
 * - Large touch target (48px+ height)
 * - Auto-focus with auto-scroll into view
 * - Numeric keyboard on mobile
 * - Country code prefix with flag
 * - Real-time formatting
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';

const COUNTRY_CODES = {
    MZ: { code: '+258', flag: '🇲🇿', pattern: '84 XXX XXXX', maxLength: 9 },
    KE: { code: '+254', flag: '🇰🇪', pattern: '7XX XXX XXX', maxLength: 9 },
    TZ: { code: '+255', flag: '🇹🇿', pattern: '6XX XXX XXX', maxLength: 9 },
    UG: { code: '+256', flag: '🇺🇬', pattern: '7XX XXX XXX', maxLength: 9 },
    PK: { code: '+92', flag: '🇵🇰', pattern: '3XX XXX XXXX', maxLength: 10 },
};

export function PhoneInput({
    id,
    value = '',
    onChange,
    country = 'MZ',
    disabled = false,
    error = null,
    placeholder,
    className = '',
    autoFocus = false,
}) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);
    const countryInfo = COUNTRY_CODES[country] || COUNTRY_CODES.MZ;

    // Auto-focus and scroll into view
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            // Delay to ensure popup animation is complete
            const timer = setTimeout(() => {
                inputRef.current.focus();
                inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [autoFocus]);

    const handleChange = useCallback((e) => {
        // Only allow digits, limit to max length
        const digits = e.target.value.replace(/\D/g, '').slice(0, countryInfo.maxLength);
        onChange?.(digits);
    }, [onChange, countryInfo.maxLength]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        // Scroll into view on mobile
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, []);

    const formatDisplay = (val) => {
        if (!val) return '';
        const digits = val.replace(/\D/g, '');

        // Format based on country pattern
        if (country === 'MZ') {
            if (digits.length <= 2) return digits;
            if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
            return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
        }

        // Default formatting: XXX XXX XXXX
        if (digits.length <= 3) return digits;
        if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    };

    const containerClasses = [
        'micropay-phone-input',
        error ? 'micropay-phone-input--error' : '',
        isFocused ? 'micropay-phone-input--focused' : '',
        disabled ? 'micropay-phone-input--disabled' : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            <div className="micropay-phone-input__container">
                <div className="micropay-phone-input__prefix">
                    <span className="micropay-phone-input__flag">{countryInfo.flag}</span>
                    <span className="micropay-phone-input__code">{countryInfo.code}</span>
                </div>
                <input
                    ref={inputRef}
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="tel-national"
                    value={formatDisplay(value)}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={() => setIsFocused(false)}
                    disabled={disabled}
                    placeholder={placeholder || countryInfo.pattern}
                    className="micropay-phone-input__field"
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                />
            </div>
            {error && (
                <div id={`${id}-error`} className="micropay-phone-input__error" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
