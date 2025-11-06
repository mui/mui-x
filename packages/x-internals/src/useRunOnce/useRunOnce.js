"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRunOnce = void 0;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var noop = function () { };
/**
 * Runs an effect once, when `condition` is true.
 */
var useRunOnce = function (condition, effect) {
    var didRun = React.useRef(false);
    (0, useEnhancedEffect_1.default)(function () {
        if (didRun.current || !condition) {
            return noop;
        }
        didRun.current = true;
        return effect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [didRun.current || condition]);
};
exports.useRunOnce = useRunOnce;
