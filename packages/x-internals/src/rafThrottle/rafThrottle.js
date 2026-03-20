"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rafThrottle = rafThrottle;
/**
 *  Creates a throttled function that only invokes `fn` at most once per animation frame.
 *
 * @example
 * ```ts
 * const throttled = rafThrottle((value: number) => console.log(value));
 * window.addEventListener('scroll', (e) => throttled(e.target.scrollTop));
 * ```
 *
 * @param fn Callback function
 * @return The `requestAnimationFrame` throttled function
 */
function rafThrottle(fn) {
    var lastArgs;
    var rafRef;
    var later = function () {
        rafRef = null;
        fn.apply(void 0, lastArgs);
    };
    function throttled() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        lastArgs = args;
        if (!rafRef) {
            rafRef = requestAnimationFrame(later);
        }
    }
    throttled.clear = function () {
        if (rafRef) {
            cancelAnimationFrame(rafRef);
            rafRef = null;
        }
    };
    return throttled;
}
