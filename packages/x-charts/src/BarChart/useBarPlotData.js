"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarPlotData = useBarPlotData;
var getColor_1 = require("./seriesConfig/getColor");
var hooks_1 = require("../hooks");
var checkScaleErrors_1 = require("./checkScaleErrors");
var useBarSeries_1 = require("../hooks/useBarSeries");
function useBarPlotData(drawingArea, xAxes, yAxes) {
    var _a;
    var seriesData = (_a = (0, useBarSeries_1.useBarSeriesContext)()) !== null && _a !== void 0 ? _a : { series: {}, stackingGroups: [], seriesOrder: [] };
    var defaultXAxisId = (0, hooks_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, hooks_1.useYAxes)().yAxisIds[0];
    var chartId = (0, hooks_1.useChartId)();
    var series = seriesData.series, stackingGroups = seriesData.stackingGroups;
    var masks = {};
    var data = stackingGroups.flatMap(function (_a, groupIndex) {
        var seriesIds = _a.ids;
        var xMin = drawingArea.left;
        var xMax = drawingArea.left + drawingArea.width;
        var yMin = drawingArea.top;
        var yMax = drawingArea.top + drawingArea.height;
        return seriesIds.map(function (seriesId) {
            var _a, _b;
            var xAxisId = (_a = series[seriesId].xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
            var yAxisId = (_b = series[seriesId].yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
            var xAxisConfig = xAxes[xAxisId];
            var yAxisConfig = yAxes[yAxisId];
            var verticalLayout = series[seriesId].layout === 'vertical';
            (0, checkScaleErrors_1.checkScaleErrors)(verticalLayout, seriesId, series[seriesId], xAxisId, xAxes, yAxisId, yAxes);
            var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
            var xScale = xAxisConfig.scale;
            var yScale = yAxisConfig.scale;
            var colorGetter = (0, getColor_1.default)(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
            var bandWidth = baseScaleConfig.scale.bandwidth();
            var _c = getBandSize({
                bandWidth: bandWidth,
                numberOfGroups: stackingGroups.length,
                gapRatio: baseScaleConfig.barGapRatio,
            }), barWidth = _c.barWidth, offset = _c.offset;
            var barOffset = groupIndex * (barWidth + offset);
            var _d = series[seriesId], stackedData = _d.stackedData, currentSeriesData = _d.data, layout = _d.layout, minBarSize = _d.minBarSize;
            var seriesDataPoints = baseScaleConfig
                .data.map(function (baseValue, dataIndex) {
                var _a, _b, _c, _d;
                if (currentSeriesData[dataIndex] == null) {
                    return null;
                }
                var values = stackedData[dataIndex];
                var valueCoordinates = values.map(function (v) { return (verticalLayout ? yScale(v) : xScale(v)); });
                var minValueCoord = Math.round(Math.min.apply(Math, valueCoordinates));
                var maxValueCoord = Math.round(Math.max.apply(Math, valueCoordinates));
                var stackId = series[seriesId].stack;
                var _e = getValueCoordinate(verticalLayout, minValueCoord, maxValueCoord, currentSeriesData[dataIndex], minBarSize), barSize = _e.barSize, startCoordinate = _e.startCoordinate;
                var result = {
                    seriesId: seriesId,
                    dataIndex: dataIndex,
                    layout: layout,
                    x: verticalLayout ? xScale(baseValue) + barOffset : startCoordinate,
                    y: verticalLayout ? startCoordinate : yScale(baseValue) + barOffset,
                    xOrigin: (_a = xScale(0)) !== null && _a !== void 0 ? _a : 0,
                    yOrigin: (_b = yScale(0)) !== null && _b !== void 0 ? _b : 0,
                    height: verticalLayout ? barSize : barWidth,
                    width: verticalLayout ? barWidth : barSize,
                    color: colorGetter(dataIndex),
                    value: currentSeriesData[dataIndex],
                    maskId: "".concat(chartId, "_").concat(stackId || seriesId, "_").concat(groupIndex, "_").concat(dataIndex),
                };
                if (result.x > xMax ||
                    result.x + result.width < xMin ||
                    result.y > yMax ||
                    result.y + result.height < yMin) {
                    return null;
                }
                if (!masks[result.maskId]) {
                    masks[result.maskId] = {
                        id: result.maskId,
                        width: 0,
                        height: 0,
                        hasNegative: false,
                        hasPositive: false,
                        layout: result.layout,
                        xOrigin: xScale(0),
                        yOrigin: yScale(0),
                        x: 0,
                        y: 0,
                    };
                }
                var mask = masks[result.maskId];
                mask.width = result.layout === 'vertical' ? result.width : mask.width + result.width;
                mask.height = result.layout === 'vertical' ? mask.height + result.height : result.height;
                mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
                mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);
                mask.hasNegative = mask.hasNegative || ((_c = result.value) !== null && _c !== void 0 ? _c : 0) < 0;
                mask.hasPositive = mask.hasPositive || ((_d = result.value) !== null && _d !== void 0 ? _d : 0) > 0;
                return result;
            })
                .filter(function (rectangle) { return rectangle !== null; });
            return {
                seriesId: seriesId,
                data: seriesDataPoints,
            };
        });
    });
    return {
        completedData: data,
        masksData: Object.values(masks),
    };
}
/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function getBandSize(_a) {
    var W = _a.bandWidth, N = _a.numberOfGroups, r = _a.gapRatio;
    if (r === 0) {
        return {
            barWidth: W / N,
            offset: 0,
        };
    }
    var barWidth = W / (N + (N - 1) * r);
    var offset = r * barWidth;
    return {
        barWidth: barWidth,
        offset: offset,
    };
}
function getValueCoordinate(isVertical, minValueCoord, maxValueCoord, baseValue, minBarSize) {
    if (baseValue === 0 || baseValue == null) {
        return {
            barSize: 0,
            startCoordinate: minValueCoord,
        };
    }
    var isSizeLessThanMin = maxValueCoord - minValueCoord < minBarSize;
    var barSize = isSizeLessThanMin ? minBarSize : maxValueCoord - minValueCoord;
    var isVerticalAndPositive = isVertical && baseValue >= 0;
    var isHorizontalAndNegative = !isVertical && baseValue < 0;
    if (isSizeLessThanMin && (isVerticalAndPositive || isHorizontalAndNegative)) {
        return {
            barSize: barSize,
            startCoordinate: maxValueCoord - barSize,
        };
    }
    return { barSize: barSize, startCoordinate: minValueCoord };
}
