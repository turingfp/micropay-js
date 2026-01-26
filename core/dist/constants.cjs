/**
 * Constants for Micropay SDK
 */

export const PROVIDERS = {
  MPESA: 'mpesa',
  JAZZCASH: 'jazzcash',
  // Future
  AIRTEL_MONEY: 'airtel_money' // Future
};
export const ENVIRONMENTS = {
  SANDBOX: 'sandbox',
  PRODUCTION: 'production'
};
export const CURRENCIES = {
  MZN: {
    code: 'MZN',
    name: 'Mozambican Metical',
    symbol: 'MT',
    country: 'MZ'
  },
  KES: {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    country: 'KE'
  },
  TZS: {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    country: 'TZ'
  },
  UGX: {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    country: 'UG'
  },
  PKR: {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    country: 'PK'
  }
};
export const PHONE_PATTERNS = {
  MZ: /^((00|\+)?(258))?8[45][0-9]{7}$/,
  // Mozambique
  KE: /^((00|\+)?(254))?(7|1)[0-9]{8}$/,
  // Kenya
  TZ: /^((00|\+)?(255))?[67][0-9]{8}$/,
  // Tanzania
  UG: /^((00|\+)?(256))?[7][0-9]{8}$/,
  // Uganda
  PK: /^((00|\+)?(92))?3[0-9]{9}$/ // Pakistan
};
export const DEFAULT_TIMEOUT = 30000;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000;