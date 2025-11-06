"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGridIsRtl = void 0;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useGridIsRtl = function (apiRef) {
    var isRtl = (0, RtlProvider_1.useRtl)();
    if (apiRef.current.state.isRtl === undefined) {
        apiRef.current.state.isRtl = isRtl;
    }
    var isFirstEffect = React.useRef(true);
    React.useEffect(function () {
        if (isFirstEffect.current) {
            isFirstEffect.current = false;
        }
        else {
            apiRef.current.setState(function (state) { return (__assign(__assign({}, state), { isRtl: isRtl })); });
        }
    }, [apiRef, isRtl]);
};
exports.useGridIsRtl = useGridIsRtl;
