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
exports.FocusedScatterMark = FocusedScatterMark;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var clsx_1 = require("clsx");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var hooks_1 = require("../hooks");
var scatterClasses_1 = require("./scatterClasses");
function FocusedScatterMark(_a) {
    var _b, _c, _d;
    var className = _a.className, props = __rest(_a, ["className"]);
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var scatterSeries = (0, hooks_1.useScatterSeriesContext)();
    var _e = (0, hooks_1.useXAxes)(), xAxis = _e.xAxis, xAxisIds = _e.xAxisIds;
    var _f = (0, hooks_1.useYAxes)(), yAxis = _f.yAxis, yAxisIds = _f.yAxisIds;
    var classes = (0, scatterClasses_1.useUtilityClasses)();
    if (focusedItem === null || focusedItem.type !== 'scatter' || !scatterSeries) {
        return null;
    }
    var series = scatterSeries === null || scatterSeries === void 0 ? void 0 : scatterSeries.series[focusedItem.seriesId];
    var xAxisId = (_b = series.xAxisId) !== null && _b !== void 0 ? _b : xAxisIds[0];
    var yAxisId = (_c = series.yAxisId) !== null && _c !== void 0 ? _c : yAxisIds[0];
    var getXPosition = (0, hooks_1.getValueToPositionMapper)(xAxis[xAxisId].scale);
    var getYPosition = (0, hooks_1.getValueToPositionMapper)(yAxis[yAxisId].scale);
    var scatterPoint = series.data[focusedItem.dataIndex];
    var x = getXPosition(scatterPoint.x);
    var y = getYPosition(scatterPoint.y);
    var size = series.markerSize + 3;
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ className: (0, clsx_1.default)(classes.focusedMark, className), fill: "none", stroke: ((_d = theme.vars) !== null && _d !== void 0 ? _d : theme).palette.text.primary, strokeWidth: 2, x: x - size, y: y - size, width: 2 * size, height: 2 * size, rx: 3, ry: 3 }, props)));
}
