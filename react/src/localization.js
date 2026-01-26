/**
 * Localization System for African Markets
 * Supports: English, Swahili, Nigerian Pidgin, Zulu
 */

export const LOCALES = {
    EN: 'en',
    SW: 'sw', // Swahili (Kenya, Tanzania)
    PCM: 'pcm', // Nigerian Pidgin
    ZU: 'zu', // Zulu (South Africa)
};

export const REGIONS = {
    NG: { // Nigeria
        code: 'NG',
        name: 'Nigeria',
        currency: 'NGN',
        currencySymbol: '₦',
        phoneCode: '+234',
        flag: '🇳🇬',
        locale: LOCALES.EN,
        providers: ['opay', 'paga', 'palmpay'],
        theme: 'nigeria', // Purple/green palette
    },
    KE: { // Kenya
        code: 'KE',
        name: 'Kenya',
        currency: 'KES',
        currencySymbol: 'KSh',
        phoneCode: '+254',
        flag: '🇰🇪',
        locale: LOCALES.EN,
        providers: ['mpesa'],
        theme: 'kenya', // Safaricom green
    },
    ZA: { // South Africa
        code: 'ZA',
        name: 'South Africa',
        currency: 'ZAR',
        currencySymbol: 'R',
        phoneCode: '+27',
        flag: '🇿🇦',
        locale: LOCALES.EN,
        providers: ['vodapay', 'fnb'],
        theme: 'southafrica',
    },
    MZ: { // Mozambique
        code: 'MZ',
        name: 'Mozambique',
        currency: 'MZN',
        currencySymbol: 'MT',
        phoneCode: '+258',
        flag: '🇲🇿',
        locale: LOCALES.EN,
        providers: ['mpesa'],
        theme: 'default',
    },
};

// Translation strings
const translations = {
    [LOCALES.EN]: {
        // Payment flow
        securePayment: 'Secure Payment',
        enterPhoneNumber: 'Enter your mobile money number',
        payWith: 'Pay with {provider}',
        processing: 'Processing...',
        pleaseWait: 'Please wait',
        checkYourPhone: 'Check your phone',
        confirmPayment: 'Confirm the payment on your {provider} app',
        paymentSuccessful: 'Payment Successful!',
        paymentFailed: 'Payment Failed',
        tryAgain: 'Try Again',
        cancel: 'Cancel',
        done: 'Done',

        // Steps
        step1: 'Open {provider} notification',
        step2: 'Enter your PIN',
        step3: 'Confirm payment',

        // Trust messages
        securedBy: 'Secured by {provider}',
        poweredBy: 'Powered by Micropay',
        moneyIsSafe: 'Your money is safe',
        willReceiveConfirmation: "You'll receive a confirmation on your phone",
        transactionId: 'Transaction ID',
        amount: 'Amount',
        fee: 'Fee',
        total: 'Total',

        // Friendly microcopy
        dontWorry: "Don't worry, your payment is protected",
        helpAvailable: 'Need help? We\'re here for you',
        shareReceipt: 'Share Receipt',
        downloadReceipt: 'Download Receipt',

        // Errors
        invalidPhone: 'Please enter a valid phone number',
        networkError: "You're offline. We'll send this when you're back online",
        somethingWentWrong: 'Something went wrong. Please try again',
        retryPayment: 'Retry Payment',

        // Accessibility
        close: 'Close',
        loading: 'Loading',

        // Amounts (for preset buttons)
        quickAmounts: 'Quick amounts',
    },

    [LOCALES.SW]: {
        // Swahili (Kenya/Tanzania)
        securePayment: 'Malipo Salama',
        enterPhoneNumber: 'Ingiza nambari yako ya simu',
        payWith: 'Lipa na {provider}',
        processing: 'Inaendelea...',
        pleaseWait: 'Tafadhali subiri',
        checkYourPhone: 'Angalia simu yako',
        confirmPayment: 'Thibitisha malipo kwenye programu yako ya {provider}',
        paymentSuccessful: 'Malipo Yamefanikiwa!',
        paymentFailed: 'Malipo Yameshindikana',
        tryAgain: 'Jaribu Tena',
        cancel: 'Ghairi',
        done: 'Imekamilika',
        step1: 'Fungua arifa ya {provider}',
        step2: 'Ingiza PIN yako',
        step3: 'Thibitisha malipo',
        securedBy: 'Imelindwa na {provider}',
        poweredBy: 'Inaendeshwa na Micropay',
        moneyIsSafe: 'Pesa yako iko salama',
        willReceiveConfirmation: 'Utapokea uthibitisho kwenye simu yako',
        transactionId: 'Nambari ya Muamala',
        amount: 'Kiasi',
        fee: 'Ada',
        total: 'Jumla',
        dontWorry: 'Usijali, malipo yako yamelindwa',
        helpAvailable: 'Unahitaji msaada? Tuko hapa',
        shareReceipt: 'Shiriki Risiti',
        invalidPhone: 'Tafadhali ingiza nambari sahihi ya simu',
        networkError: 'Huna mtandao. Tutalipa ukiwa mtandaoni',
        somethingWentWrong: 'Kuna tatizo. Tafadhali jaribu tena',
        retryPayment: 'Jaribu Malipo Tena',
        close: 'Funga',
        loading: 'Inapakia',
        quickAmounts: 'Kiasi cha haraka',
    },

    [LOCALES.PCM]: {
        // Nigerian Pidgin
        securePayment: 'Secure Payment',
        enterPhoneNumber: 'Put your phone number',
        payWith: 'Pay with {provider}',
        processing: 'E dey load...',
        pleaseWait: 'Abeg wait small',
        checkYourPhone: 'Check your phone',
        confirmPayment: 'Confirm the payment for {provider}',
        paymentSuccessful: 'Payment Don Enter!',
        paymentFailed: 'Payment No Work',
        tryAgain: 'Try Again',
        cancel: 'Cancel',
        done: 'E Don Do',
        step1: 'Open {provider} message',
        step2: 'Put your PIN',
        step3: 'Confirm am',
        securedBy: 'Secured by {provider}',
        poweredBy: 'Na Micropay dey run am',
        moneyIsSafe: 'Your money safe',
        willReceiveConfirmation: 'You go get confirmation for your phone',
        transactionId: 'Transaction Number',
        amount: 'How much',
        fee: 'Charge',
        total: 'Total',
        dontWorry: 'No worry, your money dey protected',
        helpAvailable: 'You need help? We dey here',
        shareReceipt: 'Share Receipt',
        invalidPhone: 'Abeg put correct phone number',
        networkError: 'No network. We go send am when network come back',
        somethingWentWrong: 'Something no work. Abeg try again',
        retryPayment: 'Try Again',
        close: 'Close',
        loading: 'E dey load',
        quickAmounts: 'Quick money',
    },
};

/**
 * Get translation for a key
 */
export function t(key, locale = LOCALES.EN, params = {}) {
    const strings = translations[locale] || translations[LOCALES.EN];
    let text = strings[key] || translations[LOCALES.EN][key] || key;

    // Replace placeholders like {provider}
    Object.entries(params).forEach(([param, value]) => {
        text = text.replace(new RegExp(`\\{${param}\\}`, 'g'), value);
    });

    return text;
}

/**
 * Format currency for region
 */
export function formatCurrency(amount, region = 'KE') {
    const config = REGIONS[region] || REGIONS.KE;
    return `${config.currencySymbol}${amount.toLocaleString()}`;
}

/**
 * Get region config
 */
export function getRegion(code) {
    return REGIONS[code] || REGIONS.KE;
}

export default { t, formatCurrency, getRegion, LOCALES, REGIONS };
