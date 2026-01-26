"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMicropay = useMicropay;
var _MicropayProvider = require("../MicropayProvider.jsx");
/**
 * useMicropay - Core hook for Micropay functionality
 */

/**
 * Core hook for accessing Micropay SDK
 * 
 * @example
 * const { micropay, createSession, processPayment } = useMicropay();
 */
function useMicropay() {
  var _useMicropayContext = (0, _MicropayProvider.useMicropayContext)(),
    micropay = _useMicropayContext.micropay,
    currentSession = _useMicropayContext.currentSession,
    processPayment = _useMicropayContext.processPayment,
    provider = _useMicropayContext.provider,
    environment = _useMicropayContext.environment,
    currency = _useMicropayContext.currency;
  return {
    // SDK instance
    micropay: micropay,
    // Current state
    currentSession: currentSession,
    provider: provider,
    environment: environment,
    currency: currency,
    // Actions
    createSession: function createSession(options) {
      return micropay.createSession(options);
    },
    processPayment: processPayment,
    getSession: function getSession(id) {
      return micropay.getSession(id);
    },
    cancelSession: function cancelSession(id) {
      return micropay.cancelSession(id);
    },
    // Utilities
    validatePhone: function validatePhone(phone) {
      return micropay.validatePhone(phone);
    },
    getInfo: function getInfo() {
      return micropay.getInfo();
    }
  };
}