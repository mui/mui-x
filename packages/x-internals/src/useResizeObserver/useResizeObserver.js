"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResizeObserver = useResizeObserver;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var isDevEnvironment = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
var noop = function () { };
function useResizeObserver(ref, fn, enabled) {
    var fnRef = React.useRef(null);
    fnRef.current = fn;
    (0, useEnhancedEffect_1.default)(function () {
        if (enabled === false || typeof ResizeObserver === 'undefined') {
            return noop;
        }
        var frameID = 0;
        var target = ref.current;
        var observer = new ResizeObserver(function (entries) {
            // See https://github.com/mui/mui-x/issues/8733
            // In dev, we avoid the React warning by moving the task to the next frame.
            // In prod, we want the task to run in the same frame as to avoid tear.
            if (isDevEnvironment) {
                frameID = requestAnimationFrame(function () {
                    fnRef.current(entries);
                });
            }
            else {
                fnRef.current(entries);
            }
        });
        if (target) {
            observer.observe(target);
        }
        return function () {
            if (frameID) {
                cancelAnimationFrame(frameID);
            }
            observer.disconnect();
        };
    }, [ref, enabled]);
}
