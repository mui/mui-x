"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slowAnimationDevices = void 0;
exports.useReduceAnimations = useReduceAnimations;
var useMediaQuery_1 = require("@mui/material/useMediaQuery");
var PREFERS_REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';
// detect if user agent has Android version < 10 or iOS version < 13
var mobileVersionMatches = typeof navigator !== 'undefined' && navigator.userAgent.match(/android\s(\d+)|OS\s(\d+)/i);
var androidVersion = mobileVersionMatches && mobileVersionMatches[1] ? parseInt(mobileVersionMatches[1], 10) : null;
var iOSVersion = mobileVersionMatches && mobileVersionMatches[2] ? parseInt(mobileVersionMatches[2], 10) : null;
exports.slowAnimationDevices = (androidVersion && androidVersion < 10) || (iOSVersion && iOSVersion < 13) || false;
function useReduceAnimations(customReduceAnimations) {
    var prefersReduced = (0, useMediaQuery_1.default)(PREFERS_REDUCED_MOTION, { defaultMatches: false });
    if (customReduceAnimations != null) {
        return customReduceAnimations;
    }
    return prefersReduced || exports.slowAnimationDevices;
}
