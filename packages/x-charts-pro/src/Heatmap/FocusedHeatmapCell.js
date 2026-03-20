"use strict";
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
exports.FocusedHeatmapCell = FocusedHeatmapCell;
var jsx_runtime_1 = require("react/jsx-runtime");
var styles_1 = require("@mui/material/styles");
var hooks_1 = require("../hooks");
function FocusedHeatmapCell(props) {
    var _a;
    var focusedItem = (0, hooks_1.useFocusedItem)();
    var theme = (0, styles_1.useTheme)();
    var xScale = (0, hooks_1.useXScale)();
    var yScale = (0, hooks_1.useYScale)();
    if (!focusedItem || focusedItem.type !== 'heatmap') {
        return null;
    }
    var xDomain = xScale.domain();
    var yDomain = yScale.domain();
    var xIndex = focusedItem.xIndex, yIndex = focusedItem.yIndex;
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ x: xScale(xDomain[xIndex]), y: yScale(yDomain[yIndex]), width: xScale.bandwidth(), height: yScale.bandwidth(), fill: "none", stroke: ((_a = theme.vars) !== null && _a !== void 0 ? _a : theme).palette.text.primary, strokeWidth: 2, pointerEvents: "none" }, props)));
}
