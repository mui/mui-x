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
            var _a, _b, _c, _d, _e, _f;
            var xAxisId = (_a = series[seriesId].xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
            var yAxisId = (_b = series[seriesId].yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
            var xAxisConfig = xAxes[xAxisId];
            var yAxisConfig = yAxes[yAxisId];
            var verticalLayout = series[seriesId].layout === 'vertical';
            var reverse = (_c = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse)) !== null && _c !== void 0 ? _c : false;
            (0, checkScaleErrors_1.checkScaleErrors)(verticalLayout, seriesId, series[seriesId], xAxisId, xAxes, yAxisId, yAxes);
            var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
            var xScale = xAxisConfig.scale;
            var yScale = yAxisConfig.scale;
            var colorGetter = (0, getColor_1.default)(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
            var bandWidth = baseScaleConfig.scale.bandwidth();
            var _g = getBandSize({
                bandWidth: bandWidth,
                numberOfGroups: stackingGroups.length,
                gapRatio: baseScaleConfig.barGapRatio,
            }), barWidth = _g.barWidth, offset = _g.offset;
            var barOffset = groupIndex * (barWidth + offset);
            var _h = series[seriesId], stackedData = _h.stackedData, currentSeriesData = _h.data, layout = _h.layout, minBarSize = _h.minBarSize;
            var seriesDataPoints = [];
            for (var dataIndex = 0; dataIndex < baseScaleConfig.data.length; dataIndex += 1) {
                var baseValue = baseScaleConfig.data[dataIndex];
                var seriesValue = currentSeriesData[dataIndex];
                if (seriesValue == null) {
                    continue;
                }
                var values = stackedData[dataIndex];
                var valueCoordinates = values.map(function (v) { return (verticalLayout ? yScale(v) : xScale(v)); });
                var minValueCoord = Math.round(Math.min.apply(Math, valueCoordinates));
                var maxValueCoord = Math.round(Math.max.apply(Math, valueCoordinates));
                var stackId = series[seriesId].stack;
                var barSize = seriesValue === 0 ? 0 : Math.max(minBarSize, maxValueCoord - minValueCoord);
                var startCoordinate = shouldInvertStartCoordinate(verticalLayout, seriesValue, reverse)
                    ? maxValueCoord - barSize
                    : minValueCoord;
                var result = {
                    seriesId: seriesId,
                    dataIndex: dataIndex,
                    layout: layout,
                    x: verticalLayout ? xScale(baseValue) + barOffset : startCoordinate,
                    y: verticalLayout ? startCoordinate : yScale(baseValue) + barOffset,
                    xOrigin: (_d = xScale(0)) !== null && _d !== void 0 ? _d : 0,
                    yOrigin: (_e = yScale(0)) !== null && _e !== void 0 ? _e : 0,
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
                    continue;
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
                var value = (_f = result.value) !== null && _f !== void 0 ? _f : 0;
                mask.hasNegative = mask.hasNegative || (reverse ? value > 0 : value < 0);
                mask.hasPositive = mask.hasPositive || (reverse ? value < 0 : value > 0);
                seriesDataPoints.push(result);
            }
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
function shouldInvertStartCoordinate(verticalLayout, baseValue, reverse) {
    var isVerticalAndPositive = verticalLayout && baseValue > 0;
    var isHorizontalAndNegative = !verticalLayout && baseValue < 0;
    var invertStartCoordinate = isVerticalAndPositive || isHorizontalAndNegative;
    return reverse ? !invertStartCoordinate : invertStartCoordinate;
}
