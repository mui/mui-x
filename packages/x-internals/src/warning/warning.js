"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnOnce = warnOnce;
exports.clearWarningsCache = clearWarningsCache;
var warnedOnceCache = new Set();
/**
 * Logs a message to the console on development mode. The warning will only be logged once.
 *
 * The message is the log's cache key. Two identical messages will only be logged once.
 *
 * This function is a no-op in production.
 *
 * @param message the message to log
 * @param gravity the gravity of the warning. Defaults to `'warning'`.
 * @returns
 */
function warnOnce(message, gravity) {
    if (gravity === void 0) { gravity = 'warning'; }
    if (process.env.NODE_ENV === 'production') {
        return;
    }
    var cleanMessage = Array.isArray(message) ? message.join('\n') : message;
    if (!warnedOnceCache.has(cleanMessage)) {
        warnedOnceCache.add(cleanMessage);
        if (gravity === 'error') {
            console.error(cleanMessage);
        }
        else {
            console.warn(cleanMessage);
        }
    }
}
function clearWarningsCache() {
    warnedOnceCache.clear();
}
