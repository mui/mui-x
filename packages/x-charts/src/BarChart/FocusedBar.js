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
exports.FocusedBar = FocusedBar;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var useFocusedItem_1 = require("../hooks/useFocusedItem");
var hooks_1 = require("../hooks");
var getBarDimensions_1 = require("../internals/getBarDimensions");
function FocusedBar(props) {
    var _a, _b, _c;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, useFocusedItem_1.useFocusedItem)();
    var barSeries = (0, hooks_1.useBarSeriesContext)();
    var _d = (0, hooks_1.useXAxes)(), xAxis = _d.xAxis, xAxisIds = _d.xAxisIds;
    var _e = (0, hooks_1.useYAxes)(), yAxis = _e.yAxis, yAxisIds = _e.yAxisIds;
    if (focusedItem === null || focusedItem.type !== 'bar' || !barSeries) {
        return null;
    }
    var series = barSeries.series[focusedItem.seriesId];
    if (series.data[focusedItem.dataIndex] == null) {
        // Handle missing data
        return null;
    }
    var xAxisId = (_a = series.xAxisId) !== null && _a !== void 0 ? _a : xAxisIds[0];
    var yAxisId = (_b = series.yAxisId) !== null && _b !== void 0 ? _b : yAxisIds[0];
    var xAxisConfig = xAxis[xAxisId];
    var yAxisConfig = yAxis[yAxisId];
    var verticalLayout = barSeries.series[focusedItem.seriesId].layout === 'vertical';
    var groupIndex = barSeries.stackingGroups.findIndex(function (group) {
        return group.ids.includes(focusedItem.seriesId);
    });
    var barDimensions = (0, getBarDimensions_1.getBarDimensions)({
        verticalLayout: verticalLayout,
        xAxisConfig: xAxisConfig,
        yAxisConfig: yAxisConfig,
        series: series,
        dataIndex: focusedItem.dataIndex,
        numberOfGroups: barSeries.stackingGroups.length,
        groupIndex: groupIndex,
    });
    if (barDimensions === null) {
        return null;
    }
    var x = barDimensions.x, y = barDimensions.y, height = barDimensions.height, width = barDimensions.width;
    return ((0, jsx_runtime_1.jsx)("rect", __assign({ fill: "none", stroke: ((_c = theme.vars) !== null && _c !== void 0 ? _c : theme).palette.text.primary, strokeWidth: 2, x: x - 3, y: y - 3, width: width + 6, height: height + 6, rx: 3, ry: 3 }, props)));
}
