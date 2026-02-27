"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsKeyboardItem = exports.selectorChartsKeyboardYAxisIndex = exports.selectorChartsKeyboardXAxisIndex = exports.selectorChartsIsKeyboardNavigationEnabled = exports.selectorChartsFocusedItem = exports.selectorChartsHasFocusedItem = exports.selectorChartsItemIsFocused = void 0;
var store_1 = require("@mui/x-internals/store");
var fastObjectShallowCompare_1 = require("@mui/x-internals/fastObjectShallowCompare");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var useChartCartesianAxisRendering_selectors_1 = require("../useChartCartesianAxis/useChartCartesianAxisRendering.selectors");
var selectKeyboardNavigation = function (state) { return state.keyboardNavigation; };
exports.selectorChartsItemIsFocused = (0, store_1.createSelector)(selectKeyboardNavigation, function (keyboardNavigationState, item) {
    return (keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) != null &&
        (0, fastObjectShallowCompare_1.fastObjectShallowCompare)(keyboardNavigationState.item, item);
});
exports.selectorChartsHasFocusedItem = (0, store_1.createSelector)(selectKeyboardNavigation, function (keyboardNavigationState) { return (keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) != null; });
exports.selectorChartsFocusedItem = (0, store_1.createSelector)(selectKeyboardNavigation, function (keyboardNavigationState) { var _a; return (_a = keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) !== null && _a !== void 0 ? _a : null; });
exports.selectorChartsIsKeyboardNavigationEnabled = (0, store_1.createSelector)(selectKeyboardNavigation, function (keyboardNavigationState) { return !!(keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.enableKeyboardNavigation); });
/**
 * Selectors to override highlight behavior.
 */
var createSelectAxisHighlight = function (direction) {
    return function (item, axis, series) {
        var _a;
        if (item == null || !('dataIndex' in item) || item.dataIndex === undefined) {
            return undefined;
        }
        var seriesConfig = (_a = series[item.type]) === null || _a === void 0 ? void 0 : _a.series[item.seriesId];
        if (!seriesConfig) {
            return undefined;
        }
        var axisId = direction === 'x'
            ? 'xAxisId' in seriesConfig && seriesConfig.xAxisId
            : 'yAxisId' in seriesConfig && seriesConfig.yAxisId;
        if (axisId === undefined || axisId === false) {
            axisId = axis.axisIds[0];
        }
        return { axisId: axisId, dataIndex: item.dataIndex };
    };
};
exports.selectorChartsKeyboardXAxisIndex = (0, store_1.createSelector)(exports.selectorChartsFocusedItem, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis, useChartSeries_1.selectorChartSeriesProcessed, createSelectAxisHighlight('x'));
exports.selectorChartsKeyboardYAxisIndex = (0, store_1.createSelector)(exports.selectorChartsFocusedItem, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis, useChartSeries_1.selectorChartSeriesProcessed, createSelectAxisHighlight('y'));
exports.selectorChartsKeyboardItem = (0, store_1.createSelector)(selectKeyboardNavigation, function selectorChartsKeyboardItem(keyboardState) {
    if ((keyboardState === null || keyboardState === void 0 ? void 0 : keyboardState.item) == null) {
        return null;
    }
    var _a = keyboardState.item, type = _a.type, seriesId = _a.seriesId;
    if (type === undefined || seriesId === undefined) {
        return null;
    }
    return keyboardState.item;
});
