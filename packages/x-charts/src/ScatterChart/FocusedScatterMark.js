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
exports.FocusedScatterMark = FocusedScatterMark;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var hooks_1 = require("../hooks");
function FocusedScatterMark(props) {
    var _a, _b, _c;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var scatterSeries = (0, hooks_1.useScatterSeriesContext)();
    var _d = (0, hooks_1.useXAxes)(), xAxis = _d.xAxis, xAxisIds = _d.xAxisIds;
    var _e = (0, hooks_1.useYAxes)(), yAxis = _e.yAxis, yAxisIds = _e.yAxisIds;
    if (focusedItem === null || focusedItem.type !== 'scatter' || !scatterSeries) {
        return null;
    }
    var series = scatterSeries === null || scatterSeries === void 0 ? void 0 : scatterSeries.series[focusedItem.seriesId];
    var xAxisId = (_a = series.xAxisId) !== null && _a !== void 0 ? _a : xAxisIds[0];
    var yAxisId = (_b = series.yAxisId) !== null && _b !== void 0 ? _b : yAxisIds[0];
    var getXPosition = (0, hooks_1.getValueToPositionMapper)(xAxis[xAxisId].scale);
    var getYPosition = (0, hooks_1.getValueToPositionMapper)(yAxis[yAxisId].scale);
    var scatterPoint = series.data[focusedItem.dataIndex];
    var x = getXPosition(scatterPoint.x);
    var y = getYPosition(scatterPoint.y);
    var size = series.markerSize + 3;
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ fill: "none", stroke: ((_c = theme.vars) !== null && _c !== void 0 ? _c : theme).palette.text.primary, strokeWidth: 2, x: x - size, y: y - size, width: 2 * size, height: 2 * size, rx: 3, ry: 3 }, props)));
}
