"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMounted = useMounted;
var React = require("react");
var useEnhancedEffect_1 = require("@mui/utils/useEnhancedEffect");
function useMounted(defer) {
    if (defer === void 0) { defer = false; }
    var _a = React.useState(false), mountedState = _a[0], setMountedState = _a[1];
    (0, useEnhancedEffect_1.default)(function () {
        if (!defer) {
            setMountedState(true);
        }
    }, [defer]);
    React.useEffect(function () {
        if (defer) {
            setMountedState(true);
        }
    }, [defer]);
    return mountedState;
}
