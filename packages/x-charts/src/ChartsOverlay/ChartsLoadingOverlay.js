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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsLoadingOverlay = ChartsLoadingOverlay;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var useChartsLocalization_1 = require("../hooks/useChartsLocalization");
var StyledText = (0, styles_1.styled)('text', {
    slot: 'internal',
    shouldForwardProp: undefined,
})(function (_a) {
    var theme = _a.theme;
    return (__assign(__assign({}, theme.typography.body2), { stroke: 'none', fill: (theme.vars || theme).palette.text.primary, shapeRendering: 'crispEdges', textAnchor: 'middle', dominantBaseline: 'middle' }));
});
function ChartsLoadingOverlay(props) {
    var message = props.message, other = __rest(props, ["message"]);
    var _a = (0, useDrawingArea_1.useDrawingArea)(), top = _a.top, left = _a.left, height = _a.height, width = _a.width;
    var localeText = (0, useChartsLocalization_1.useChartsLocalization)().localeText;
    return ((0, jsx_runtime_1.jsx)(StyledText, __assign({ x: left + width / 2, y: top + height / 2 }, other, { children: message !== null && message !== void 0 ? message : localeText.loading })));
}
