"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrientation = useOrientation;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
var utils_1 = require("../../../utils/utils");
function getOrientation() {
    if (typeof window === 'undefined') {
        return 'portrait';
    }
    if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
        return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
    }
    // Support IOS safari
    if (window.orientation) {
        return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
    }
    return 'portrait';
}
function useOrientation(views, customOrientation) {
    var _a = React.useState(getOrientation), orientation = _a[0], setOrientation = _a[1];
    (0, useEnhancedEffect_1.default)(function () {
        var eventHandler = function () {
            setOrientation(getOrientation());
        };
        window.addEventListener('orientationchange', eventHandler);
        return function () {
            window.removeEventListener('orientationchange', eventHandler);
        };
    }, []);
    if ((0, utils_1.arrayIncludes)(views, ['hours', 'minutes', 'seconds'])) {
        // could not display 13:34:44 in landscape mode
        return 'portrait';
    }
    return customOrientation !== null && customOrientation !== void 0 ? customOrientation : orientation;
}
