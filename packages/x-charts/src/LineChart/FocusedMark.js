"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.FocusedMark = FocusedMark;
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var hooks_1 = require("../hooks");
var RADIUS = 6;
function FocusedMark() {
    var _a, _b, _c;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var lineSeries = (0, hooks_1.useLineSeriesContext)();
    var _d = (0, hooks_1.useXAxes)(), xAxis = _d.xAxis, xAxisIds = _d.xAxisIds;
    var _e = (0, hooks_1.useYAxes)(), yAxis = _e.yAxis, yAxisIds = _e.yAxisIds;
    if (focusedItem === null || focusedItem.seriesType !== 'line' || !lineSeries) {
        return null;
    }
    var series = lineSeries === null || lineSeries === void 0 ? void 0 : lineSeries.series[focusedItem.seriesId];
    var xAxisId = (_a = series.xAxisId) !== null && _a !== void 0 ? _a : xAxisIds[0];
    var yAxisId = (_b = series.yAxisId) !== null && _b !== void 0 ? _b : yAxisIds[0];
    return (<rect fill="none" stroke={((_c = theme.vars) !== null && _c !== void 0 ? _c : theme).palette.text.primary} strokeWidth={2} x={xAxis[xAxisId].scale(xAxis[xAxisId].data[focusedItem.dataIndex]) - RADIUS} y={yAxis[yAxisId].scale(series.stackedData[focusedItem.dataIndex][1]) - RADIUS} width={2 * RADIUS} height={2 * RADIUS} rx={3} ry={3}/>);
}
