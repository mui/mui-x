"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorCandlestickItemAtPosition = void 0;
var store_1 = require("@mui/x-internals/store");
var internals_1 = require("@mui/x-charts/internals");
exports.selectorCandlestickItemAtPosition = (0, store_1.createSelector)(internals_1.selectorChartXAxis, internals_1.selectorChartYAxis, internals_1.selectorChartSeriesProcessed, function selectorCandlestickItemAtPosition(_a, _b, processedSeries, svgPoint) {
    var _c, _d, _e;
    var xAxes = _a.axis, xAxisIds = _a.axisIds;
    var yAxes = _b.axis, yAxisIds = _b.axisIds;
    var _f = (_c = processedSeries === null || processedSeries === void 0 ? void 0 : processedSeries.ohlc) !== null && _c !== void 0 ? _c : {}, series = _f.series, seriesOrder = _f.seriesOrder;
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    for (var _i = 0, _g = seriesOrder !== null && seriesOrder !== void 0 ? seriesOrder : []; _i < _g.length; _i++) {
        var seriesId = _g[_i];
        var aSeries = (series !== null && series !== void 0 ? series : {})[seriesId];
        if (aSeries.hidden) {
            continue;
        }
        var xAxisId = (_d = aSeries.xAxisId) !== null && _d !== void 0 ? _d : defaultXAxisId;
        var yAxisId = (_e = aSeries.yAxisId) !== null && _e !== void 0 ? _e : defaultYAxisId;
        var xAxis = xAxes[xAxisId];
        var yAxis = yAxes[yAxisId];
        var xScale = xAxis.scale;
        var yScale = yAxis.scale;
        if (!(0, internals_1.isBandScale)(xScale) || (0, internals_1.isOrdinalScale)(yScale)) {
            continue;
        }
        var dataIndex = (0, internals_1.getDataIndexForOrdinalScaleValue)(xScale, svgPoint.x);
        var yValue = yScale.invert(svgPoint.y);
        var datum = aSeries.data[dataIndex];
        if (datum == null) {
            continue;
        }
        var min = Math.min.apply(Math, datum);
        var max = Math.max.apply(Math, datum);
        if (yValue.valueOf() >= min && yValue.valueOf() <= max) {
            return {
                type: 'ohlc',
                seriesId: seriesId,
                dataIndex: dataIndex,
            };
        }
    }
    return undefined;
});
