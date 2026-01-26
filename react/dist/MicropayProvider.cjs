"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MicropayProvider = MicropayProvider;
exports.useMicropayContext = useMicropayContext;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@micropaysdk/core");
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
 * MicropayProvider - React context for Micropay SDK
 */
var MicropayContext = /*#__PURE__*/(0, _react.createContext)(null);

/**
 * Hook to access Micropay context
 */
function useMicropayContext() {
  var context = (0, _react.useContext)(MicropayContext);
  if (!context) {
    throw new Error('useMicropayContext must be used within a MicropayProvider');
  }
  return context;
}

/**
 * MicropayProvider - Wrap your app to enable Micropay payments
 * 
 * @example
 * <MicropayProvider
 *   publicKey="pk_live_xxx"
 *   provider="mpesa"
 *   environment="sandbox"
 * >
 *   <App />
 * </MicropayProvider>
 */
function MicropayProvider(_ref) {
  var children = _ref.children,
    publicKey = _ref.publicKey,
    _ref$provider = _ref.provider,
    provider = _ref$provider === void 0 ? 'mpesa' : _ref$provider,
    _ref$environment = _ref.environment,
    environment = _ref$environment === void 0 ? 'sandbox' : _ref$environment,
    credentials = _ref.credentials,
    _ref$country = _ref.country,
    country = _ref$country === void 0 ? 'KE' : _ref$country,
    _ref$currency = _ref.currency,
    currency = _ref$currency === void 0 ? 'KES' : _ref$currency,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? 'light' : _ref$theme,
    _ref$branding = _ref.branding,
    branding = _ref$branding === void 0 ? true : _ref$branding,
    _onError = _ref.onError;
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    currentSession = _useState2[0],
    setCurrentSession = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isPopupOpen = _useState4[0],
    setIsPopupOpen = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    popupConfig = _useState6[0],
    setPopupConfig = _useState6[1];

  // Create Micropay instance
  var micropay = (0, _react.useMemo)(function () {
    return (0, _core.createMicropay)({
      publicKey: publicKey,
      provider: provider,
      environment: environment,
      credentials: credentials,
      country: country,
      currency: currency,
      onSessionUpdate: function onSessionUpdate(_ref2) {
        var session = _ref2.session,
          newStatus = _ref2.newStatus;
        setCurrentSession(session);
      }
    });
  }, [publicKey, provider, environment, country, currency]);

  // Open payment popup
  var openPopup = (0, _react.useCallback)(function (config) {
    setPopupConfig(config);
    setIsPopupOpen(true);
  }, []);

  // Close payment popup
  var closePopup = (0, _react.useCallback)(function () {
    setIsPopupOpen(false);
    setPopupConfig(null);
  }, []);

  // Create and process a payment session
  var processPayment = (0, _react.useCallback)(/*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(options) {
      var session, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            _context.p = 0;
            session = micropay.createSession({
              amount: options.amount,
              productId: options.productId,
              description: options.description,
              metadata: options.metadata,
              onSuccess: options.onSuccess,
              onError: function onError(error) {
                var _options$onError;
                (_options$onError = options.onError) === null || _options$onError === void 0 || _options$onError.call(options, error);
                _onError === null || _onError === void 0 || _onError(error);
              },
              onCancel: options.onCancel
            });
            setCurrentSession(session);
            if (!options.customerPhone) {
              _context.n = 2;
              break;
            }
            _context.n = 1;
            return micropay.processPayment(session.id, options.customerPhone);
          case 1:
            return _context.a(2, _context.v);
          case 2:
            return _context.a(2, {
              session: session,
              needsPhone: true
            });
          case 3:
            _context.p = 3;
            _t = _context.v;
            _onError === null || _onError === void 0 || _onError(_t);
            throw _t;
          case 4:
            return _context.a(2);
        }
      }, _callee, null, [[0, 3]]);
    }));
    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }(), [micropay, _onError]);
  var contextValue = (0, _react.useMemo)(function () {
    return {
      // Core
      micropay: micropay,
      provider: provider,
      environment: environment,
      currency: currency,
      // Session
      currentSession: currentSession,
      setCurrentSession: setCurrentSession,
      // Popup
      isPopupOpen: isPopupOpen,
      openPopup: openPopup,
      closePopup: closePopup,
      popupConfig: popupConfig,
      // Actions
      processPayment: processPayment,
      // Config
      theme: theme,
      branding: branding
    };
  }, [micropay, provider, environment, currency, currentSession, isPopupOpen, popupConfig, openPopup, closePopup, processPayment, theme, branding]);
  return /*#__PURE__*/_react["default"].createElement(MicropayContext.Provider, {
    value: contextValue
  }, children);
}