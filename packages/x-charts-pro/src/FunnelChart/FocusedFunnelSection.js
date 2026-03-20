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
exports.FocusedFunnelSection = FocusedFunnelSection;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var internals_1 = require("@mui/x-charts/internals");
var d3_shape_1 = require("@mui/x-charts-vendor/d3-shape");
var hooks_1 = require("@mui/x-charts/hooks");
var hooks_2 = require("../hooks");
var coordinateMapper_1 = require("./coordinateMapper");
var curves_1 = require("./curves");
var useChartFunnelAxisRendering_selectors_1 = require("./funnelAxisPlugin/useChartFunnelAxisRendering.selectors");
var get2DExtrema_1 = require("./get2DExtrema");
function FocusedFunnelSection(props) {
    var _a, _b, _c, _d;
    var theme = (0, styles_1.useTheme)();
    var focusedItem = (0, hooks_1.useFocusedItem)();
    var store = (0, internals_1.useStore)();
    var _e = store.use(useChartFunnelAxisRendering_selectors_1.selectorChartXAxis), xAxis = _e.axis, xAxisIds = _e.axisIds;
    var _f = store.use(useChartFunnelAxisRendering_selectors_1.selectorChartYAxis), yAxis = _f.axis, yAxisIds = _f.axisIds;
    var gap = store.use(useChartFunnelAxisRendering_selectors_1.selectorFunnelGap);
    var allFunnelSeries = (_a = (0, hooks_2.useFunnelSeriesContext)()) === null || _a === void 0 ? void 0 : _a.series;
    if (!focusedItem || focusedItem.type !== 'funnel' || !allFunnelSeries) {
        return null;
    }
    var funnelSeries = allFunnelSeries[focusedItem.seriesId];
    var xAxisId = (_b = funnelSeries.xAxisId) !== null && _b !== void 0 ? _b : xAxisIds[0];
    var yAxisId = (_c = funnelSeries.yAxisId) !== null && _c !== void 0 ? _c : yAxisIds[0];
    var xScale = xAxis[xAxisId].scale;
    var yScale = yAxis[yAxisId].scale;
    var isHorizontal = funnelSeries.layout === 'horizontal';
    var baseScaleData = isHorizontal ? xAxis[xAxisId].data : yAxis[yAxisId].data;
    var xPosition = (0, coordinateMapper_1.createPositionGetter)(xScale, isHorizontal, gap, baseScaleData);
    var yPosition = (0, coordinateMapper_1.createPositionGetter)(yScale, !isHorizontal, gap, baseScaleData);
    var isIncreasing = funnelSeries.funnelDirection === 'increasing';
    var _g = (0, get2DExtrema_1.get2DExtrema)(funnelSeries.dataPoints, xPosition, yPosition), minPoint = _g[0], maxPoint = _g[1];
    var curve = (0, curves_1.getFunnelCurve)(funnelSeries.curve, {
        isHorizontal: isHorizontal,
        gap: gap,
        position: focusedItem.dataIndex,
        sections: funnelSeries.dataPoints.length,
        borderRadius: funnelSeries.borderRadius,
        isIncreasing: isIncreasing,
        min: minPoint,
        max: maxPoint,
    });
    var bandPoints = curve({}).processPoints(funnelSeries.dataPoints[focusedItem.dataIndex].map(function (v) { return ({
        x: xPosition(v.x, focusedItem.dataIndex, v.stackOffset, v.useBandWidth),
        y: yPosition(v.y, focusedItem.dataIndex, v.stackOffset, v.useBandWidth),
    }); }));
    var line = (0, d3_shape_1.line)()
        .x(function (v) { return v.x; })
        .y(function (v) { return v.y; })
        .curve(curve);
    return ((0, jsx_runtime_1.jsx)("path", __assign({ d: line(bandPoints), fill: "none", stroke: ((_d = theme.vars) !== null && _d !== void 0 ? _d : theme).palette.text.primary, strokeWidth: 2 }, props)));
}
