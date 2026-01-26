/**
 * CallbackHandler - Express/Fastify middleware for handling payment webhooks
 */

/**
 * Create Express middleware for handling mPesa callbacks
 * @param {Object} handlers - Callback handlers
 * @param {Function} handlers.onPaymentComplete - Called when payment completes successfully
 * @param {Function} handlers.onPaymentFailed - Called when payment fails
 * @param {Function} handlers.onRefundComplete - Called when refund completes
 * @param {Object} options - Middleware options
 * @param {string} options.secret - Webhook secret for validation (optional)
 * @param {boolean} options.logRequests - Log incoming requests (default: false)
 * @returns {Function} Express middleware
 */
export function createCallbackHandler(handlers = {}, options = {}) {
    const {
        onPaymentComplete = async () => { },
        onPaymentFailed = async () => { },
        onRefundComplete = async () => { },
        onUnknownEvent = async () => { },
    } = handlers;

    const {
        secret = null,
        logRequests = false,
    } = options;

    return async (req, res, next) => {
        try {
            // Log request if enabled
            if (logRequests) {
                console.log('[Micropayments Callback]', {
                    method: req.method,
                    body: req.body,
                    headers: req.headers,
                });
            }

            // Validate webhook secret if configured
            if (secret && req.headers['x-webhook-secret'] !== secret) {
                return res.status(401).json({ error: 'Invalid webhook secret' });
            }

            const payload = req.body;

            // Parse mPesa callback format
            const callbackData = parseCallbackPayload(payload);

            // Route to appropriate handler based on event type
            switch (callbackData.eventType) {
                case 'payment.complete':
                    await onPaymentComplete(callbackData);
                    break;
                case 'payment.failed':
                    await onPaymentFailed(callbackData, callbackData.error);
                    break;
                case 'refund.complete':
                    await onRefundComplete(callbackData);
                    break;
                default:
                    await onUnknownEvent(callbackData);
            }

            // Acknowledge receipt
            res.status(200).json({ received: true });
        } catch (error) {
            console.error('[Micropayments Callback Error]', error);

            // Still return 200 to prevent retries on our side errors
            res.status(200).json({
                received: true,
                processingError: error.message
            });
        }
    };
}

/**
 * Parse callback payload from mPesa format
 * @param {Object} payload - Raw callback payload
 * @returns {Object} Normalized callback data
 */
function parseCallbackPayload(payload) {
    // mPesa callback format normalization
    const data = {
        eventType: 'unknown',
        transactionId: null,
        conversationId: null,
        reference: null,
        amount: null,
        statusCode: null,
        statusMessage: null,
        rawPayload: payload,
        error: null,
    };

    // Handle different mPesa response formats
    if (payload.output_ResponseCode) {
        data.statusCode = payload.output_ResponseCode;
        data.statusMessage = payload.output_ResponseDesc;
        data.transactionId = payload.output_TransactionID;
        data.conversationId = payload.output_ConversationID;
        data.reference = payload.output_ThirdPartyReference;

        // Determine event type based on response code
        // INS-0: Success
        if (data.statusCode === 'INS-0') {
            data.eventType = 'payment.complete';
        } else {
            data.eventType = 'payment.failed';
            data.error = {
                code: data.statusCode,
                message: data.statusMessage,
            };
        }
    }

    // Handle ResultCode format (alternative mPesa format)
    if (payload.ResultCode !== undefined) {
        data.statusCode = String(payload.ResultCode);
        data.statusMessage = payload.ResultDesc;
        data.transactionId = payload.TransactionID;
        data.conversationId = payload.ConversationID;

        if (payload.ResultCode === 0 || payload.ResultCode === '0') {
            data.eventType = 'payment.complete';
        } else {
            data.eventType = 'payment.failed';
            data.error = {
                code: data.statusCode,
                message: data.statusMessage,
            };
        }
    }

    return data;
}

/**
 * Create a simple in-memory callback receiver for testing
 * @returns {Object} Callback receiver with collected events
 */
export function createTestCallbackReceiver() {
    const events = [];

    const handlers = {
        onPaymentComplete: async (data) => {
            events.push({ type: 'payment.complete', data, timestamp: new Date() });
        },
        onPaymentFailed: async (data, error) => {
            events.push({ type: 'payment.failed', data, error, timestamp: new Date() });
        },
        onRefundComplete: async (data) => {
            events.push({ type: 'refund.complete', data, timestamp: new Date() });
        },
    };

    return {
        handlers,
        getEvents: () => [...events],
        getLastEvent: () => events[events.length - 1] || null,
        clear: () => events.length = 0,
    };
}
