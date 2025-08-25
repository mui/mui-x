"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRunOncePerLoop = useRunOncePerLoop;
var React = require("react");
function useRunOncePerLoop(callback, nextFrame) {
    if (nextFrame === void 0) { nextFrame = false; }
    var scheduledRef = React.useRef(false);
    var schedule = React.useCallback(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (scheduledRef.current) {
            return;
        }
        scheduledRef.current = true;
        var runner = function () {
            scheduledRef.current = false;
            callback.apply(void 0, args);
        };
        if (nextFrame) {
            if (typeof requestAnimationFrame === 'function') {
                requestAnimationFrame(runner);
            }
            return;
        }
        if (typeof queueMicrotask === 'function') {
            queueMicrotask(runner);
        }
        else {
            Promise.resolve().then(runner);
        }
    }, [callback, nextFrame]);
    return schedule;
}
