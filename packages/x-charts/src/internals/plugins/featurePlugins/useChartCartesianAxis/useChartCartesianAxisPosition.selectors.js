"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorBarItemAtPosition = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartCartesianAxisRendering_selectors_1 = require("./useChartCartesianAxisRendering.selectors");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var getBandSize_1 = require("../../../../internals/getBandSize");
var scaleGuards_1 = require("../../../../internals/scaleGuards");
var invertScale_1 = require("../../../../internals/invertScale");
exports.selectorBarItemAtPosition = (0, store_1.createSelector)(useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, useChartSeries_1.selectorChartSeriesProcessed, function selectorBarItemAtPosition(_a, _b, processedSeries, svgPoint) {
    var _c, _d, _e, _f;
    var xAxes = _a.axis, xAxisIds = _a.axisIds;
    var yAxes = _b.axis, yAxisIds = _b.axisIds;
    var _g = (_c = processedSeries === null || processedSeries === void 0 ? void 0 : processedSeries.bar) !== null && _c !== void 0 ? _c : {}, series = _g.series, _h = _g.stackingGroups, stackingGroups = _h === void 0 ? [] : _h;
    var defaultXAxisId = xAxisIds[0];
    var defaultYAxisId = yAxisIds[0];
    var item = undefined;
    for (var stackIndex = 0; stackIndex < stackingGroups.length; stackIndex += 1) {
        var group = stackingGroups[stackIndex];
        var seriesIds = group.ids;
        for (var _i = 0, seriesIds_1 = seriesIds; _i < seriesIds_1.length; _i++) {
            var seriesId = seriesIds_1[_i];
            var aSeries = (series !== null && series !== void 0 ? series : {})[seriesId];
            var xAxisId = (_d = aSeries.xAxisId) !== null && _d !== void 0 ? _d : defaultXAxisId;
            var yAxisId = (_e = aSeries.yAxisId) !== null && _e !== void 0 ? _e : defaultYAxisId;
            var xAxis = xAxes[xAxisId];
            var yAxis = yAxes[yAxisId];
            var bandAxis = aSeries.layout === 'horizontal' ? yAxis : xAxis;
            var continuousAxis = aSeries.layout === 'horizontal' ? xAxis : yAxis;
            var bandScale = bandAxis.scale;
            var svgPointBandCoordinate = aSeries.layout === 'horizontal' ? svgPoint.y : svgPoint.x;
            if (!(0, scaleGuards_1.isBandScale)(bandScale)) {
                continue;
            }
            var dataIndex = (0, invertScale_1.getDataIndexForOrdinalScaleValue)(bandScale, svgPointBandCoordinate);
            var _j = (0, getBandSize_1.getBandSize)(bandScale.bandwidth(), stackingGroups.length, bandAxis.barGapRatio), barWidth = _j.barWidth, offset = _j.offset;
            var barOffset = stackIndex * (barWidth + offset);
            var bandValue = (_f = bandAxis.data) === null || _f === void 0 ? void 0 : _f[dataIndex];
            if (bandValue == null) {
                continue;
            }
            var bandStart = bandScale(bandValue);
            if (bandStart == null) {
                continue;
            }
            var bandBarStart = bandStart + barOffset;
            var bandBarEnd = bandBarStart + barWidth;
            var bandBarMin = Math.min(bandBarStart, bandBarEnd);
            var bandBarMax = Math.max(bandBarStart, bandBarEnd);
            if (svgPointBandCoordinate >= bandBarMin && svgPointBandCoordinate <= bandBarMax) {
                // The point is inside the band for this series
                var svgPointContinuousCoordinate = aSeries.layout === 'horizontal' ? svgPoint.x : svgPoint.y;
                var bar = aSeries.visibleStackedData[dataIndex];
                var start = continuousAxis.scale(bar[0]);
                var end = continuousAxis.scale(bar[1]);
                if (start == null || end == null) {
                    continue;
                }
                var continuousMin = Math.min(start, end);
                var continuousMax = Math.max(start, end);
                if (svgPointContinuousCoordinate >= continuousMin &&
                    svgPointContinuousCoordinate <= continuousMax) {
                    item = {
                        seriesId: seriesId,
                        dataIndex: dataIndex,
                    };
                }
            }
        }
    }
    if (item) {
        return {
            type: 'bar',
            seriesId: item.seriesId,
            dataIndex: item.dataIndex,
        };
    }
    return undefined;
});
