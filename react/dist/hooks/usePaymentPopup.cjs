"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePaymentPopup = usePaymentPopup;
var _react = require("react");
var _MicropayProvider = require("../MicropayProvider.jsx");
/**
 * usePaymentPopup - Hook for controlling the payment popup
 */

/**
 * Control the payment popup programmatically
 * 
 * @example
 * const { open, close, isOpen } = usePaymentPopup();
 * 
 * <button onClick={() => open({ amount: 100, productId: 'coins' })}>
 *   Buy Coins
 * </button>
 */
function usePaymentPopup() {
  var _useMicropayContext = (0, _MicropayProvider.useMicropayContext)(),
    isPopupOpen = _useMicropayContext.isPopupOpen,
    openPopup = _useMicropayContext.openPopup,
    closePopup = _useMicropayContext.closePopup,
    popupConfig = _useMicropayContext.popupConfig;
  var open = (0, _react.useCallback)(function (config) {
    openPopup(config);
  }, [openPopup]);
  var close = (0, _react.useCallback)(function () {
    closePopup();
  }, [closePopup]);
  return {
    isOpen: isPopupOpen,
    config: popupConfig,
    open: open,
    close: close
  };
}