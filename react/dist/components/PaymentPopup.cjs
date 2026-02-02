"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaymentPopup = PaymentPopup;
var _react = _interopRequireWildcard(require("react"));
var _MicropayProvider = require("../MicropayProvider.jsx");
var _PhoneInput = require("./PhoneInput.jsx");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } /**
 * PaymentPopup - Mobile-optimized payment UI
 * 
 * Features:
 * - Full-screen on mobile devices
 * - Large touch targets (48px minimum)
 * - Swipe-to-close gesture
 * - Safe area padding for notched phones
 * - Haptic feedback support
 */
var STEPS = {
  PHONE: 'phone',
  PROCESSING: 'processing',
  AWAITING: 'awaiting',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Haptic feedback helper
var triggerHaptic = function triggerHaptic() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'light';
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    var patterns = {
      light: [10],
      medium: [20],
      success: [10, 50, 30],
      error: [50, 30, 50]
    };
    navigator.vibrate(patterns[type] || patterns.light);
  }
};
function PaymentPopup(_ref) {
  var externalOnClose = _ref.onClose,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    _ref$fullScreenOnMobi = _ref.fullScreenOnMobile,
    fullScreenOnMobile = _ref$fullScreenOnMobi === void 0 ? true : _ref$fullScreenOnMobi,
    _ref$enableSwipeClose = _ref.enableSwipeClose,
    enableSwipeClose = _ref$enableSwipeClose === void 0 ? true : _ref$enableSwipeClose,
    _ref$enableHaptics = _ref.enableHaptics,
    enableHaptics = _ref$enableHaptics === void 0 ? true : _ref$enableHaptics,
    _ref$premium = _ref.premium,
    premium = _ref$premium === void 0 ? true : _ref$premium,
    _ref$glass = _ref.glass,
    glass = _ref$glass === void 0 ? false : _ref$glass;
  var _useMicropayContext = (0, _MicropayProvider.useMicropayContext)(),
    isPopupOpen = _useMicropayContext.isPopupOpen,
    closePopup = _useMicropayContext.closePopup,
    popupConfig = _useMicropayContext.popupConfig,
    processPayment = _useMicropayContext.processPayment,
    micropay = _useMicropayContext.micropay,
    currency = _useMicropayContext.currency,
    theme = _useMicropayContext.theme,
    branding = _useMicropayContext.branding;
  var _useState = (0, _react.useState)(STEPS.PHONE),
    _useState2 = _slicedToArray(_useState, 2),
    step = _useState2[0],
    setStep = _useState2[1];
  var _useState3 = (0, _react.useState)(''),
    _useState4 = _slicedToArray(_useState3, 2),
    phone = _useState4[0],
    setPhone = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    phoneError = _useState6[0],
    setPhoneError = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    paymentError = _useState8[0],
    setPaymentError = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState0 = _slicedToArray(_useState9, 2),
    transaction = _useState0[0],
    setTransaction = _useState0[1];
  var _useState1 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState1, 2),
    swipeY = _useState10[0],
    setSwipeY = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isSwiping = _useState12[0],
    setIsSwiping = _useState12[1];
  var popupRef = (0, _react.useRef)(null);
  var startYRef = (0, _react.useRef)(0);

  // Detect mobile
  var isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  // Reset state when popup opens
  (0, _react.useEffect)(function () {
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
    return function () {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isPopupOpen]);

  // Swipe handlers
  var handleTouchStart = (0, _react.useCallback)(function (e) {
    if (!enableSwipeClose) return;
    startYRef.current = e.touches[0].clientY;
    setIsSwiping(true);
  }, [enableSwipeClose]);
  var handleTouchMove = (0, _react.useCallback)(function (e) {
    if (!isSwiping || !enableSwipeClose) return;
    var currentY = e.touches[0].clientY;
    var deltaY = currentY - startYRef.current;

    // Only allow downward swipe
    if (deltaY > 0) {
      setSwipeY(deltaY);
    }
  }, [isSwiping, enableSwipeClose]);
  var handleTouchEnd = (0, _react.useCallback)(function () {
    if (!enableSwipeClose) return;
    setIsSwiping(false);

    // If swiped more than 100px, close
    if (swipeY > 100) {
      handleClose();
    }
    setSwipeY(0);
  }, [swipeY, enableSwipeClose]);
  var handleClose = (0, _react.useCallback)(function () {
    var _popupConfig$onCancel;
    if (enableHaptics) triggerHaptic('light');
    closePopup();
    externalOnClose === null || externalOnClose === void 0 || externalOnClose();
    popupConfig === null || popupConfig === void 0 || (_popupConfig$onCancel = popupConfig.onCancel) === null || _popupConfig$onCancel === void 0 || _popupConfig$onCancel.call(popupConfig);
  }, [closePopup, externalOnClose, popupConfig, enableHaptics]);
  var handleSubmitPhone = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(e) {
      var result, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            e.preventDefault();
            setPhoneError(null);
            if (!(!phone || phone.length < 9)) {
              _context.n = 1;
              break;
            }
            setPhoneError('Please enter a valid phone number');
            if (enableHaptics) triggerHaptic('error');
            return _context.a(2);
          case 1:
            if (!(micropay && !micropay.validatePhone(phone))) {
              _context.n = 2;
              break;
            }
            setPhoneError('Invalid phone number format');
            if (enableHaptics) triggerHaptic('error');
            return _context.a(2);
          case 2:
            if (enableHaptics) triggerHaptic('medium');
            setStep(STEPS.PROCESSING);
            _context.p = 3;
            _context.n = 4;
            return processPayment({
              amount: popupConfig.amount,
              productId: popupConfig.productId,
              description: popupConfig.description,
              metadata: popupConfig.metadata,
              customerPhone: phone,
              onSuccess: function onSuccess(data) {
                var _popupConfig$onSucces;
                setTransaction(data.transaction);
                setStep(STEPS.SUCCESS);
                if (enableHaptics) triggerHaptic('success');
                popupConfig === null || popupConfig === void 0 || (_popupConfig$onSucces = popupConfig.onSuccess) === null || _popupConfig$onSucces === void 0 || _popupConfig$onSucces.call(popupConfig, data);
              },
              onError: function onError(error) {
                var _popupConfig$onError;
                setPaymentError(error);
                setStep(STEPS.ERROR);
                if (enableHaptics) triggerHaptic('error');
                popupConfig === null || popupConfig === void 0 || (_popupConfig$onError = popupConfig.onError) === null || _popupConfig$onError === void 0 || _popupConfig$onError.call(popupConfig, error);
              }
            });
          case 4:
            result = _context.v;
            if (result !== null && result !== void 0 && result.pendingConfirmation) {
              setStep(STEPS.AWAITING);
            }
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            setPaymentError(_t);
            setStep(STEPS.ERROR);
            if (enableHaptics) triggerHaptic('error');
          case 6:
            return _context.a(2);
        }
      }, _callee, null, [[3, 5]]);
    }));
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }(), [phone, micropay, processPayment, popupConfig, enableHaptics]);
  var formatAmount = function formatAmount(amount) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };
  if (!isPopupOpen || !popupConfig) return null;
  var popupClasses = ['micropay-popup', isMobile && fullScreenOnMobile ? 'micropay-popup--fullscreen' : '', theme === 'dark' ? 'micropay-dark' : '', glass ? 'micropay-popup--glass' : '', className].filter(Boolean).join(' ');
  var getStepIndex = function getStepIndex() {
    switch (step) {
      case STEPS.PHONE:
        return 0;
      case STEPS.PROCESSING:
        return 1;
      case STEPS.AWAITING:
        return 2;
      case STEPS.SUCCESS:
        return 3;
      case STEPS.ERROR:
        return 3;
      default:
        return 0;
    }
  };
  var StepProgress = function StepProgress() {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__dot ".concat(getStepIndex() >= 0 ? 'micropay-step-progress__dot--active' : '', " ").concat(getStepIndex() > 0 ? 'micropay-step-progress__dot--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__line ".concat(getStepIndex() > 0 ? 'micropay-step-progress__line--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__dot ".concat(getStepIndex() >= 1 ? 'micropay-step-progress__dot--active' : '', " ").concat(getStepIndex() > 1 ? 'micropay-step-progress__dot--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__line ".concat(getStepIndex() > 1 ? 'micropay-step-progress__line--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__dot ".concat(getStepIndex() >= 2 ? 'micropay-step-progress__dot--active' : '', " ").concat(getStepIndex() > 2 ? 'micropay-step-progress__dot--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__line ".concat(getStepIndex() > 2 ? 'micropay-step-progress__line--completed' : '')
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "micropay-step-progress__dot ".concat(getStepIndex() >= 3 ? 'micropay-step-progress__dot--active' : '')
    }));
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup-overlay ".concat(theme === 'dark' ? 'micropay-dark' : ''),
    onClick: function onClick(e) {
      return e.target === e.currentTarget && handleClose();
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: popupRef,
    className: popupClasses,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "micropay-title",
    style: {
      transform: swipeY > 0 ? "translateY(".concat(swipeY, "px)") : undefined,
      transition: isSwiping ? 'none' : 'transform 0.2s ease-out'
    },
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }, isMobile && enableSwipeClose && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__swipe-indicator"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__swipe-bar"
  })), premium && /*#__PURE__*/_react["default"].createElement(StepProgress, null), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__header ".concat(premium ? 'micropay-popup__header--premium' : '')
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__secure"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__lock ".concat(premium ? 'micropay-popup__lock--animated' : '')
  }, "\uD83D\uDD12"), /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__secure-text"
  }, "Secure Payment")), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    onClick: handleClose,
    className: "micropay-popup__close",
    "aria-label": "Close"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__amount-section"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__description",
    id: "micropay-title"
  }, popupConfig.description || 'Payment'), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__amount-display"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__amount-value"
  }, formatAmount(popupConfig.amount)), /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__currency-symbol"
  }, currency))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__content"
  }, step === STEPS.PHONE && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: handleSubmitPhone,
    className: "micropay-popup__form"
  }, /*#__PURE__*/_react["default"].createElement("label", {
    className: "micropay-popup__label",
    htmlFor: "micropay-phone"
  }, "Enter your mobile money number"), /*#__PURE__*/_react["default"].createElement(_PhoneInput.PhoneInput, {
    id: "micropay-phone",
    value: phone,
    onChange: setPhone,
    error: phoneError,
    country: (micropay === null || micropay === void 0 ? void 0 : micropay.country) || 'MZ',
    autoFocus: true
  }), /*#__PURE__*/_react["default"].createElement("button", {
    type: "submit",
    className: "micropay-popup__submit",
    disabled: !phone
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__submit-icon"
  }, "\uD83D\uDCF1"), "Pay with mPesa"), /*#__PURE__*/_react["default"].createElement("p", {
    className: "micropay-popup__hint"
  }, "You'll receive a prompt on your phone to confirm")), step === STEPS.PROCESSING && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__spinner"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-text"
  }, "Processing payment..."), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-subtext"
  }, "Please wait")), step === STEPS.AWAITING && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status micropay-popup__status--awaiting"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__phone-icon"
  }, "\uD83D\uDCF1"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-text"
  }, "Check your phone"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-subtext"
  }, "Open your mPesa app and confirm the payment of ", formatAmount(popupConfig.amount), " ", currency), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__awaiting-steps"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__step"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__step-number"
  }, "1"), /*#__PURE__*/_react["default"].createElement("span", null, "Open mPesa notification")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__step"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__step-number"
  }, "2"), /*#__PURE__*/_react["default"].createElement("span", null, "Enter your PIN")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__step"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-popup__step-number"
  }, "3"), /*#__PURE__*/_react["default"].createElement("span", null, "Confirm payment")))), step === STEPS.SUCCESS && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status micropay-popup__status--success"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__success-icon"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-text"
  }, "Payment Successful!"), transaction && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__receipt"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__receipt-row"
  }, /*#__PURE__*/_react["default"].createElement("span", null, "Transaction ID"), /*#__PURE__*/_react["default"].createElement("span", null, transaction.id)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__receipt-row"
  }, /*#__PURE__*/_react["default"].createElement("span", null, "Amount"), /*#__PURE__*/_react["default"].createElement("span", null, formatAmount(popupConfig.amount), " ", currency))), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    onClick: handleClose,
    className: "micropay-popup__submit"
  }, "Done")), step === STEPS.ERROR && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status micropay-popup__status--error"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__error-icon"
  }, /*#__PURE__*/_react["default"].createElement("svg", {
    width: "40",
    height: "40",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-text"
  }, "Payment Failed"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__status-subtext"
  }, (paymentError === null || paymentError === void 0 ? void 0 : paymentError.message) || 'Something went wrong. Please try again.'), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    onClick: function onClick() {
      return setStep(STEPS.PHONE);
    },
    className: "micropay-popup__submit"
  }, "Try Again"), /*#__PURE__*/_react["default"].createElement("button", {
    type: "button",
    onClick: handleClose,
    className: "micropay-popup__cancel"
  }, "Cancel"))), branding && /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-popup__branding"
  }, "Secured by ", /*#__PURE__*/_react["default"].createElement("strong", null, "Micropay"))));
}