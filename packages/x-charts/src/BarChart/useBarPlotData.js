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
exports.useBarPlotData = useBarPlotData;
exports.processBarDataForPlot = processBarDataForPlot;
var getColor_1 = require("./seriesConfig/bar/getColor");
var useAxis_1 = require("../hooks/useAxis");
var checkBarChartScaleErrors_1 = require("./checkBarChartScaleErrors");
var useBarSeries_1 = require("../hooks/useBarSeries");
var getBarDimensions_1 = require("../internals/getBarDimensions");
var useChartId_1 = require("../hooks/useChartId");
function useBarPlotData(drawingArea, xAxes, yAxes) {
    var _a;
    var seriesData = (_a = (0, useBarSeries_1.useBarSeriesContext)()) !== null && _a !== void 0 ? _a : { series: {}, stackingGroups: [], seriesOrder: [] };
    var defaultXAxisId = (0, useAxis_1.useXAxes)().xAxisIds[0];
    var defaultYAxisId = (0, useAxis_1.useYAxes)().yAxisIds[0];
    var chartId = (0, useChartId_1.useChartId)();
    return processBarDataForPlot(drawingArea, chartId, seriesData.stackingGroups, seriesData.series, xAxes, yAxes, defaultXAxisId, defaultYAxisId);
}
function processBarDataForPlot(drawingArea, chartId, stackingGroups, series, xAxes, yAxes, defaultXAxisId, defaultYAxisId) {
    var masks = {};
    var data = stackingGroups.flatMap(function (_a, groupIndex) {
        var seriesIds = _a.ids;
        var xMin = drawingArea.left;
        var xMax = drawingArea.left + drawingArea.width;
        var yMin = drawingArea.top;
        var yMax = drawingArea.top + drawingArea.height;
        var lastNegativePerIndex = new Map();
        var lastPositivePerIndex = new Map();
        return seriesIds.map(function (seriesId) {
            var _a, _b, _c, _d, _e, _f, _g;
            var xAxisId = (_a = series[seriesId].xAxisId) !== null && _a !== void 0 ? _a : defaultXAxisId;
            var yAxisId = (_b = series[seriesId].yAxisId) !== null && _b !== void 0 ? _b : defaultYAxisId;
            var layout = series[seriesId].layout;
            var xAxisConfig = xAxes[xAxisId];
            var yAxisConfig = yAxes[yAxisId];
            var verticalLayout = series[seriesId].layout === 'vertical';
            var reverse = (_c = (verticalLayout ? yAxisConfig.reverse : xAxisConfig.reverse)) !== null && _c !== void 0 ? _c : false;
            (0, checkBarChartScaleErrors_1.checkBarChartScaleErrors)(verticalLayout, seriesId, series[seriesId].stackedData.length, xAxisId, xAxes, yAxisId, yAxes);
            var baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig);
            var xScale = xAxisConfig.scale;
            var yScale = yAxisConfig.scale;
            var xOrigin = Math.round((_d = xScale(0)) !== null && _d !== void 0 ? _d : 0);
            var yOrigin = Math.round((_e = yScale(0)) !== null && _e !== void 0 ? _e : 0);
            var colorGetter = (0, getColor_1.default)(series[seriesId], xAxes[xAxisId], yAxes[yAxisId]);
            var seriesDataPoints = [];
            for (var dataIndex = 0; dataIndex < baseScaleConfig.data.length; dataIndex += 1) {
                var barDimensions = (0, getBarDimensions_1.getBarDimensions)({
                    verticalLayout: verticalLayout,
                    xAxisConfig: xAxisConfig,
                    yAxisConfig: yAxisConfig,
                    series: series[seriesId],
                    dataIndex: dataIndex,
                    numberOfGroups: stackingGroups.length,
                    groupIndex: groupIndex,
                });
                if (barDimensions == null) {
                    continue;
                }
                var stackId = series[seriesId].stack;
                var result = __assign(__assign({ seriesId: seriesId, dataIndex: dataIndex, hidden: series[seriesId].hidden }, barDimensions), { color: colorGetter(dataIndex), value: series[seriesId].data[dataIndex], maskId: "".concat(chartId, "_").concat(stackId || seriesId, "_").concat(groupIndex, "_").concat(dataIndex) });
                if (result.x > xMax ||
                    result.x + result.width < xMin ||
                    result.y > yMax ||
                    result.y + result.height < yMin) {
                    continue;
                }
                var lastNegative = lastNegativePerIndex.get(dataIndex);
                var lastPositive = lastPositivePerIndex.get(dataIndex);
                var sign = (reverse ? -1 : 1) * Math.sign((_f = result.value) !== null && _f !== void 0 ? _f : 0);
                if (sign > 0) {
                    if (lastPositive) {
                        delete lastPositive.borderRadiusSide;
                    }
                    result.borderRadiusSide = verticalLayout ? 'top' : 'right';
                    lastPositivePerIndex.set(dataIndex, result);
                }
                else if (sign < 0) {
                    if (lastNegative) {
                        delete lastNegative.borderRadiusSide;
                    }
                    result.borderRadiusSide = verticalLayout ? 'bottom' : 'left';
                    lastNegativePerIndex.set(dataIndex, result);
                }
                if (!masks[result.maskId]) {
                    masks[result.maskId] = {
                        id: result.maskId,
                        width: 0,
                        height: 0,
                        hasNegative: false,
                        hasPositive: false,
                        layout: layout,
                        xOrigin: xOrigin,
                        yOrigin: yOrigin,
                        x: 0,
                        y: 0,
                    };
                }
                var mask = masks[result.maskId];
                mask.width = layout === 'vertical' ? result.width : mask.width + result.width;
                mask.height = layout === 'vertical' ? mask.height + result.height : result.height;
                mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
                mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);
                var value = (_g = result.value) !== null && _g !== void 0 ? _g : 0;
                mask.hasNegative = mask.hasNegative || (reverse ? value > 0 : value < 0);
                mask.hasPositive = mask.hasPositive || (reverse ? value < 0 : value > 0);
                seriesDataPoints.push(result);
            }
            return {
                seriesId: seriesId,
                barLabel: series[seriesId].barLabel,
                barLabelPlacement: series[seriesId].barLabelPlacement,
                data: seriesDataPoints,
                layout: layout,
                xOrigin: xOrigin,
                yOrigin: yOrigin,
            };
        });
    });
    return {
        completedData: data,
        masksData: Object.values(masks),
    };
}
