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
exports.StyledText = void 0;
var styles_1 = require("@mui/material/styles");
exports.StyledText = (0, styles_1.styled)('text', {
    slot: 'internal',
    shouldForwardProp: undefined,
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, theme.typography.body2), { stroke: 'none', fill: (theme.vars || theme).palette.text.primary, shapeRendering: 'crispEdges', textAnchor: 'middle', dominantBaseline: 'middle' }));
});
