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
exports.useRangeBarPlotData = useRangeBarPlotData;
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var useRangeBarSeries_1 = require("../../hooks/useRangeBarSeries");
var createGetRangeBarDimensions_1 = require("./createGetRangeBarDimensions");
function useRangeBarPlotData(drawingArea, xAxes, yAxes) {
    var _a;
    var store = (0, internals_1.useStore)();
    var seriesData = (_a = (0, useRangeBarSeries_1.useRangeBarSeriesContext)()) !== null && _a !== void 0 ? _a : { series: {}, seriesOrder: [] };
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var getColor = store.state.seriesConfig.config.rangeBar.colorProcessor;
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    var xMin = drawingArea.left;
    var xMax = drawingArea.left + drawingArea.width;
    var yMin = drawingArea.top;
    var yMax = drawingArea.top + drawingArea.height;
    var data = seriesOrder.map(function (seriesId, seriesIndex) {
        var _a, _b, _c, _d, _e, _f;
        var verticalLayout = series[seriesId].layout === 'vertical';
        var getRangeBarDimensions = (0, createGetRangeBarDimensions_1.createGetRangeBarDimensions)({
            verticalLayout: verticalLayout,
            xAxisConfig: xAxes[(_a = series[seriesId].xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId],
            yAxisConfig: yAxes[(_b = series[seriesId].yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId],
            series: series[seriesId],
            numberOfGroups: seriesOrder.length,
        });
        var xAxisId = (_c = series[seriesId].xAxisId) !== null && _c !== void 0 ? _c : defaultXAxisId;
        var yAxisId = (_d = series[seriesId].yAxisId) !== null && _d !== void 0 ? _d : defaultYAxisId;
        var xAxisConfig = xAxes[xAxisId];
        var yAxisConfig = yAxes[yAxisId];
        (0, internals_1.checkBarChartScaleErrors)(verticalLayout, seriesId, series[seriesId].data.length, xAxisId, xAxes, yAxisId, yAxes);
        var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
        var xScale = xAxisConfig.scale;
        var yScale = yAxisConfig.scale;
        var xOrigin = Math.round((_e = xScale(0)) !== null && _e !== void 0 ? _e : 0);
        var yOrigin = Math.round((_f = yScale(0)) !== null && _f !== void 0 ? _f : 0);
        var colorGetter = getColor(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
        var _g = series[seriesId], currentSeriesData = _g.data, layout = _g.layout;
        var seriesDataPoints = [];
        for (var dataIndex = 0; dataIndex < baseScaleConfig.data.length; dataIndex += 1) {
            var dimensions = getRangeBarDimensions(dataIndex, seriesIndex);
            if (dimensions === null ||
                dimensions.x > xMax ||
                dimensions.x + dimensions.width < xMin ||
                dimensions.y > yMax ||
                dimensions.y + dimensions.height < yMin) {
                continue;
            }
            var result = __assign({ seriesId: seriesId, dataIndex: dataIndex, color: colorGetter(dataIndex), value: currentSeriesData[dataIndex], hidden: series[seriesId].hidden }, dimensions);
            seriesDataPoints.push(result);
        }
        return {
            seriesId: seriesId,
            data: seriesDataPoints,
            layout: layout,
            xOrigin: xOrigin,
            yOrigin: yOrigin,
        };
    });
    return data;
}
