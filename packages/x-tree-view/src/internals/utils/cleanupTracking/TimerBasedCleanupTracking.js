"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerBasedCleanupTracking = void 0;
// If no effect ran after this amount of time, we assume that the render was not committed by React
var CLEANUP_TIMER_LOOP_MILLIS = 1000;
var TimerBasedCleanupTracking = /** @class */ (function () {
    function TimerBasedCleanupTracking(timeout) {
        if (timeout === void 0) { timeout = CLEANUP_TIMER_LOOP_MILLIS; }
        this.timeouts = new Map();
        this.cleanupTimeout = CLEANUP_TIMER_LOOP_MILLIS;
        this.cleanupTimeout = timeout;
    }
    TimerBasedCleanupTracking.prototype.register = function (object, unsubscribe, unregisterToken) {
        var _this = this;
        if (!this.timeouts) {
            this.timeouts = new Map();
        }
        var timeout = setTimeout(function () {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
            _this.timeouts.delete(unregisterToken.cleanupToken);
        }, this.cleanupTimeout);
        this.timeouts.set(unregisterToken.cleanupToken, timeout);
    };
    TimerBasedCleanupTracking.prototype.unregister = function (unregisterToken) {
        var timeout = this.timeouts.get(unregisterToken.cleanupToken);
        if (timeout) {
            this.timeouts.delete(unregisterToken.cleanupToken);
            clearTimeout(timeout);
        }
    };
    TimerBasedCleanupTracking.prototype.reset = function () {
        var _this = this;
        if (this.timeouts) {
            this.timeouts.forEach(function (value, key) {
                _this.unregister({ cleanupToken: key });
            });
            this.timeouts = undefined;
        }
    };
    return TimerBasedCleanupTracking;
}());
exports.TimerBasedCleanupTracking = TimerBasedCleanupTracking;
