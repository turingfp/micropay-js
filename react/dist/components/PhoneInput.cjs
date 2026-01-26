"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhoneInput = PhoneInput;
var _react = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; } /**
 * PhoneInput - Mobile-optimized phone number input
 * 
 * Features:
 * - Large touch target (48px+ height)
 * - Auto-focus with auto-scroll into view
 * - Numeric keyboard on mobile
 * - Country code prefix with flag
 * - Real-time formatting
 */
var COUNTRY_CODES = {
  MZ: {
    code: '+258',
    flag: '🇲🇿',
    pattern: '84 XXX XXXX',
    maxLength: 9
  },
  KE: {
    code: '+254',
    flag: '🇰🇪',
    pattern: '7XX XXX XXX',
    maxLength: 9
  },
  TZ: {
    code: '+255',
    flag: '🇹🇿',
    pattern: '6XX XXX XXX',
    maxLength: 9
  },
  UG: {
    code: '+256',
    flag: '🇺🇬',
    pattern: '7XX XXX XXX',
    maxLength: 9
  },
  PK: {
    code: '+92',
    flag: '🇵🇰',
    pattern: '3XX XXX XXXX',
    maxLength: 10
  }
};
function PhoneInput(_ref) {
  var id = _ref.id,
    _ref$value = _ref.value,
    value = _ref$value === void 0 ? '' : _ref$value,
    onChange = _ref.onChange,
    _ref$country = _ref.country,
    country = _ref$country === void 0 ? 'MZ' : _ref$country,
    _ref$disabled = _ref.disabled,
    disabled = _ref$disabled === void 0 ? false : _ref$disabled,
    _ref$error = _ref.error,
    error = _ref$error === void 0 ? null : _ref$error,
    placeholder = _ref.placeholder,
    _ref$className = _ref.className,
    className = _ref$className === void 0 ? '' : _ref$className,
    _ref$autoFocus = _ref.autoFocus,
    autoFocus = _ref$autoFocus === void 0 ? false : _ref$autoFocus;
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    isFocused = _useState2[0],
    setIsFocused = _useState2[1];
  var inputRef = (0, _react.useRef)(null);
  var countryInfo = COUNTRY_CODES[country] || COUNTRY_CODES.MZ;

  // Auto-focus and scroll into view
  (0, _react.useEffect)(function () {
    if (autoFocus && inputRef.current) {
      // Delay to ensure popup animation is complete
      var timer = setTimeout(function () {
        inputRef.current.focus();
        inputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
      return function () {
        return clearTimeout(timer);
      };
    }
  }, [autoFocus]);
  var handleChange = (0, _react.useCallback)(function (e) {
    // Only allow digits, limit to max length
    var digits = e.target.value.replace(/\D/g, '').slice(0, countryInfo.maxLength);
    onChange === null || onChange === void 0 || onChange(digits);
  }, [onChange, countryInfo.maxLength]);
  var handleFocus = (0, _react.useCallback)(function () {
    setIsFocused(true);
    // Scroll into view on mobile
    if (inputRef.current) {
      setTimeout(function () {
        inputRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, []);
  var formatDisplay = function formatDisplay(val) {
    if (!val) return '';
    var digits = val.replace(/\D/g, '');

    // Format based on country pattern
    if (country === 'MZ') {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return "".concat(digits.slice(0, 2), " ").concat(digits.slice(2));
      return "".concat(digits.slice(0, 2), " ").concat(digits.slice(2, 5), " ").concat(digits.slice(5));
    }

    // Default formatting: XXX XXX XXXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return "".concat(digits.slice(0, 3), " ").concat(digits.slice(3));
    return "".concat(digits.slice(0, 3), " ").concat(digits.slice(3, 6), " ").concat(digits.slice(6));
  };
  var containerClasses = ['micropay-phone-input', error ? 'micropay-phone-input--error' : '', isFocused ? 'micropay-phone-input--focused' : '', disabled ? 'micropay-phone-input--disabled' : '', className].filter(Boolean).join(' ');
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: containerClasses
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-phone-input__container"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "micropay-phone-input__prefix"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-phone-input__flag"
  }, countryInfo.flag), /*#__PURE__*/_react["default"].createElement("span", {
    className: "micropay-phone-input__code"
  }, countryInfo.code)), /*#__PURE__*/_react["default"].createElement("input", {
    ref: inputRef,
    id: id,
    type: "tel",
    inputMode: "numeric",
    pattern: "[0-9]*",
    autoComplete: "tel-national",
    value: formatDisplay(value),
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: function onBlur() {
      return setIsFocused(false);
    },
    disabled: disabled,
    placeholder: placeholder || countryInfo.pattern,
    className: "micropay-phone-input__field",
    "aria-invalid": !!error,
    "aria-describedby": error ? "".concat(id, "-error") : undefined
  })), error && /*#__PURE__*/_react["default"].createElement("div", {
    id: "".concat(id, "-error"),
    className: "micropay-phone-input__error",
    role: "alert"
  }, error));
}