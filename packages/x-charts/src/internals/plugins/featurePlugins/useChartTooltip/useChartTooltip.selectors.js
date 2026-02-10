"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsTooltipItemPosition = exports.selectorChartsTooltipItemIsDefined = exports.selectorChartsTooltipItem = exports.selectorChartsTooltipPointerItemIsDefined = exports.selectorChartsTooltipPointerItem = void 0;
var store_1 = require("@mui/x-internals/store");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
var useChartCartesianAxisRendering_selectors_1 = require("../useChartCartesianAxis/useChartCartesianAxisRendering.selectors");
var useChartKeyboardNavigation_1 = require("../useChartKeyboardNavigation");
var useChartInteraction_selectors_1 = require("../useChartInteraction/useChartInteraction.selectors");
var useChartDimensions_selectors_1 = require("../../corePlugins/useChartDimensions/useChartDimensions.selectors");
var isCartesian_1 = require("../../../isCartesian");
var useChartPolarAxis_selectors_1 = require("../useChartPolarAxis/useChartPolarAxis.selectors");
var selectTooltip = function (state) { return state.tooltip; };
exports.selectorChartsTooltipPointerItem = (0, store_1.createSelector)(selectTooltip, function (tooltip) { var _a; return (_a = tooltip === null || tooltip === void 0 ? void 0 : tooltip.item) !== null && _a !== void 0 ? _a : null; });
exports.selectorChartsTooltipPointerItemIsDefined = (0, store_1.createSelector)(exports.selectorChartsTooltipPointerItem, function (item) { return item !== null; });
exports.selectorChartsTooltipItem = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsLastInteraction, exports.selectorChartsTooltipPointerItem, useChartKeyboardNavigation_1.selectorChartsKeyboardItem, function (lastInteraction, pointerItem, keyboardItem) {
    return lastInteraction === 'keyboard' ? keyboardItem : (pointerItem !== null && pointerItem !== void 0 ? pointerItem : null);
});
exports.selectorChartsTooltipItemIsDefined = (0, store_1.createSelector)(useChartInteraction_selectors_1.selectorChartsLastInteraction, exports.selectorChartsTooltipPointerItemIsDefined, useChartKeyboardNavigation_1.selectorChartsHasFocusedItem, function (lastInteraction, pointerItemIsDefined, keyboardItemIsDefined) {
    return lastInteraction === 'keyboard' ? keyboardItemIsDefined : pointerItemIsDefined;
});
var selectorChartsTooltipAxisConfig = (0, store_1.createSelectorMemoized)(exports.selectorChartsTooltipItem, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, useChartPolarAxis_selectors_1.selectorChartRotationAxis, useChartPolarAxis_selectors_1.selectorChartRadiusAxis, useChartSeries_1.selectorChartSeriesProcessed, function selectorChartsTooltipAxisConfig(identifier, _a, _b, rotationAxes, radiusAxes, series) {
    var _c, _d, _e;
    var xAxis = _a.axis, xAxisIds = _a.axisIds;
    var yAxis = _b.axis, yAxisIds = _b.axisIds;
    if (!identifier) {
        return {};
    }
    var itemSeries = (_c = series[identifier.type]) === null || _c === void 0 ? void 0 : _c.series[identifier.seriesId];
    if (!itemSeries) {
        return {};
    }
    var axesConfig = {
        rotationAxes: rotationAxes,
        radiusAxes: radiusAxes,
    };
    var xAxisId = (0, isCartesian_1.isCartesianSeries)(itemSeries)
        ? ((_d = itemSeries.xAxisId) !== null && _d !== void 0 ? _d : xAxisIds[0])
        : undefined;
    var yAxisId = (0, isCartesian_1.isCartesianSeries)(itemSeries)
        ? ((_e = itemSeries.yAxisId) !== null && _e !== void 0 ? _e : yAxisIds[0])
        : undefined;
    if (xAxisId !== undefined) {
        axesConfig.x = xAxis[xAxisId];
    }
    if (yAxisId !== undefined) {
        axesConfig.y = yAxis[yAxisId];
    }
    return axesConfig;
});
exports.selectorChartsTooltipItemPosition = (0, store_1.createSelectorMemoized)(exports.selectorChartsTooltipItem, useChartDimensions_selectors_1.selectorChartDrawingArea, useChartSeriesConfig_1.selectorChartSeriesConfig, useChartSeries_1.selectorChartSeriesProcessed, useChartSeries_1.selectorChartSeriesLayout, selectorChartsTooltipAxisConfig, function selectorChartsTooltipItemPosition(identifier, drawingArea, seriesConfig, series, seriesLayout, axesConfig, placement) {
    var _a, _b, _c, _d;
    if (placement === void 0) { placement = 'top'; }
    if (!identifier) {
        return null;
    }
    var itemSeries = (_a = series[identifier.type]) === null || _a === void 0 ? void 0 : _a.series[identifier.seriesId];
    if (!itemSeries) {
        return null;
    }
    return ((_d = (_c = (_b = seriesConfig[itemSeries.type]).tooltipItemPositionGetter) === null || _c === void 0 ? void 0 : _c.call(_b, {
        series: series,
        seriesLayout: seriesLayout,
        drawingArea: drawingArea,
        axesConfig: axesConfig,
        identifier: identifier,
        placement: placement,
    })) !== null && _d !== void 0 ? _d : null);
});
