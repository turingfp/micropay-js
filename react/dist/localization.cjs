"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.REGIONS = exports.LOCALES = void 0;
exports.formatCurrency = formatCurrency;
exports.getRegion = getRegion;
exports.t = t;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * Localization System for African Markets
 * Supports: English, Swahili, Nigerian Pidgin, Zulu
 */

var LOCALES = exports.LOCALES = {
  EN: 'en',
  SW: 'sw',
  // Swahili (Kenya, Tanzania)
  PCM: 'pcm',
  // Nigerian Pidgin
  ZU: 'zu' // Zulu (South Africa)
};
var REGIONS = exports.REGIONS = {
  NG: {
    // Nigeria
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    phoneCode: '+234',
    flag: '🇳🇬',
    locale: LOCALES.EN,
    providers: ['opay', 'paga', 'palmpay'],
    theme: 'nigeria' // Purple/green palette
  },
  KE: {
    // Kenya
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    phoneCode: '+254',
    flag: '🇰🇪',
    locale: LOCALES.EN,
    providers: ['mpesa'],
    theme: 'kenya' // Safaricom green
  },
  ZA: {
    // South Africa
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    phoneCode: '+27',
    flag: '🇿🇦',
    locale: LOCALES.EN,
    providers: ['vodapay', 'fnb'],
    theme: 'southafrica'
  },
  MZ: {
    // Mozambique
    code: 'MZ',
    name: 'Mozambique',
    currency: 'MZN',
    currencySymbol: 'MT',
    phoneCode: '+258',
    flag: '🇲🇿',
    locale: LOCALES.EN,
    providers: ['mpesa'],
    theme: 'default'
  }
};

// Translation strings
var translations = _defineProperty(_defineProperty(_defineProperty({}, LOCALES.EN, {
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
  quickAmounts: 'Quick amounts'
}), LOCALES.SW, {
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
  quickAmounts: 'Kiasi cha haraka'
}), LOCALES.PCM, {
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
  quickAmounts: 'Quick money'
});

/**
 * Get translation for a key
 */
function t(key) {
  var locale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : LOCALES.EN;
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var strings = translations[locale] || translations[LOCALES.EN];
  var text = strings[key] || translations[LOCALES.EN][key] || key;

  // Replace placeholders like {provider}
  Object.entries(params).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      param = _ref2[0],
      value = _ref2[1];
    text = text.replace(new RegExp("\\{".concat(param, "\\}"), 'g'), value);
  });
  return text;
}

/**
 * Format currency for region
 */
function formatCurrency(amount) {
  var region = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'KE';
  var config = REGIONS[region] || REGIONS.KE;
  return "".concat(config.currencySymbol).concat(amount.toLocaleString());
}

/**
 * Get region config
 */
function getRegion(code) {
  return REGIONS[code] || REGIONS.KE;
}
var _default = exports["default"] = {
  t: t,
  formatCurrency: formatCurrency,
  getRegion: getRegion,
  LOCALES: LOCALES,
  REGIONS: REGIONS
};