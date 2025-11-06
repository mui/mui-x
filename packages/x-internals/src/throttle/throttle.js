"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = throttle;
function throttle(func, wait) {
    if (wait === void 0) { wait = 166; }
    var timeout;
    var lastArgs;
    var later = function () {
        timeout = undefined;
        func.apply(void 0, lastArgs);
    };
    function throttled() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        lastArgs = args;
        if (timeout === undefined) {
            timeout = setTimeout(later, wait);
        }
    }
    throttled.clear = function () {
        clearTimeout(timeout);
        timeout = undefined;
    };
    return throttled;
}
