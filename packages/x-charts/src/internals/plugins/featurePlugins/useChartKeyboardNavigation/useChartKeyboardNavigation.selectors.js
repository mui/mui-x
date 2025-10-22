"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsKeyboardItem = exports.selectorChartsKeyboardYAxisIndex = exports.selectorChartsKeyboardXAxisIndex = exports.selectorChartsIsKeyboardNavigationEnabled = exports.selectorChartsFocusedDataIndex = exports.selectorChartsFocusedSeriesId = exports.selectorChartsFocusedSeriesType = exports.selectorChartsHasFocusedItem = void 0;
var selectors_1 = require("../../utils/selectors");
var useChartSeries_1 = require("../../corePlugins/useChartSeries");
var useChartCartesianAxisRendering_selectors_1 = require("../useChartCartesianAxis/useChartCartesianAxisRendering.selectors");
var selectKeyboardNavigation = function (state) { return state.keyboardNavigation; };
exports.selectorChartsHasFocusedItem = (0, selectors_1.createSelector)([selectKeyboardNavigation], function (keyboardNavigationState) { return (keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) != null; });
exports.selectorChartsFocusedSeriesType = (0, selectors_1.createSelector)([selectKeyboardNavigation], function (keyboardNavigationState) { var _a; return (_a = keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) === null || _a === void 0 ? void 0 : _a.type; });
exports.selectorChartsFocusedSeriesId = (0, selectors_1.createSelector)([selectKeyboardNavigation], function (keyboardNavigationState) { var _a; return (_a = keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) === null || _a === void 0 ? void 0 : _a.seriesId; });
exports.selectorChartsFocusedDataIndex = (0, selectors_1.createSelector)([selectKeyboardNavigation], function (keyboardNavigationState) { var _a; return (_a = keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.item) === null || _a === void 0 ? void 0 : _a.dataIndex; });
exports.selectorChartsIsKeyboardNavigationEnabled = (0, selectors_1.createSelector)([selectKeyboardNavigation], function (keyboardNavigationState) { return !!(keyboardNavigationState === null || keyboardNavigationState === void 0 ? void 0 : keyboardNavigationState.enableKeyboardNavigation); });
/**
 * Selectors to override highlight behavior.
 */
var createSelectAxisHighlight = function (direction) {
    return function (type, seriesId, dataIndex, axis, series) {
        var _a;
        if (type === undefined || seriesId === undefined || dataIndex === undefined) {
            return undefined;
        }
        var seriesConfig = (_a = series[type]) === null || _a === void 0 ? void 0 : _a.series[seriesId];
        if (!seriesConfig) {
            return undefined;
        }
        var axisId = direction === 'x'
            ? 'xAxisId' in seriesConfig && seriesConfig.xAxisId
            : 'yAxisId' in seriesConfig && seriesConfig.yAxisId;
        if (axisId === undefined || axisId === false) {
            axisId = axis.axisIds[0];
        }
        return { axisId: axisId, dataIndex: dataIndex };
    };
};
exports.selectorChartsKeyboardXAxisIndex = (0, selectors_1.createSelector)([
    exports.selectorChartsFocusedSeriesType,
    exports.selectorChartsFocusedSeriesId,
    exports.selectorChartsFocusedDataIndex,
    useChartCartesianAxisRendering_selectors_1.selectorChartXAxis,
    useChartSeries_1.selectorChartSeriesProcessed,
], createSelectAxisHighlight('x'));
exports.selectorChartsKeyboardYAxisIndex = (0, selectors_1.createSelector)([
    exports.selectorChartsFocusedSeriesType,
    exports.selectorChartsFocusedSeriesId,
    exports.selectorChartsFocusedDataIndex,
    useChartCartesianAxisRendering_selectors_1.selectorChartYAxis,
    useChartSeries_1.selectorChartSeriesProcessed,
], createSelectAxisHighlight('y'));
exports.selectorChartsKeyboardItem = (0, selectors_1.createSelector)([exports.selectorChartsFocusedSeriesType, exports.selectorChartsFocusedSeriesId, exports.selectorChartsFocusedDataIndex], function selectorChartsKeyboardItem(seriesType, seriesId, dataIndex) {
    if (seriesId === undefined) {
        return null;
    }
    return { seriesId: seriesId, dataIndex: seriesType === 'line' ? undefined : dataIndex };
});
