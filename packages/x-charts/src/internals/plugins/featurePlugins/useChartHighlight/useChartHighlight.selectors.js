"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSeriesHighlightedItem = exports.selectorChartSeriesUnfadedItem = exports.selectorChartIsSeriesFaded = exports.selectorChartIsSeriesHighlighted = exports.selectorChartsHighlightScope = exports.selectorChartsHighlightedItem = exports.selectorChartsHighlightScopePerSeriesId = void 0;
exports.selectorChartsHighlightStateCallback = selectorChartsHighlightStateCallback;
exports.selectorChartsHighlightState = selectorChartsHighlightState;
var store_1 = require("@mui/x-internals/store");
var highlightStates_1 = require("./highlightStates");
var useChartKeyboardNavigation_1 = require("../useChartKeyboardNavigation");
var useChartSeries_selectors_1 = require("../../corePlugins/useChartSeries/useChartSeries.selectors");
var useChartSeriesConfig_1 = require("../../corePlugins/useChartSeriesConfig");
var selectHighlight = function (state) {
    return state.highlight;
};
exports.selectorChartsHighlightScopePerSeriesId = (0, store_1.createSelectorMemoized)(useChartSeries_selectors_1.selectorChartSeriesProcessed, function (processedSeries) {
    var map = {};
    Object.keys(processedSeries).forEach(function (seriesType) {
        var _a;
        map[seriesType] = new Map();
        var seriesData = processedSeries[seriesType];
        (_a = seriesData === null || seriesData === void 0 ? void 0 : seriesData.seriesOrder) === null || _a === void 0 ? void 0 : _a.forEach(function (seriesId) {
            var _a;
            var seriesItem = seriesData === null || seriesData === void 0 ? void 0 : seriesData.series[seriesId];
            if ((seriesItem === null || seriesItem === void 0 ? void 0 : seriesItem.highlightScope) !== undefined) {
                (_a = map[seriesType]) === null || _a === void 0 ? void 0 : _a.set(seriesId, seriesItem.highlightScope);
            }
        });
    });
    return map;
});
exports.selectorChartsHighlightedItem = (0, store_1.createSelectorMemoized)(selectHighlight, useChartKeyboardNavigation_1.selectorChartsKeyboardItem, function selectorChartsHighlightedItem(highlight, keyboardItem) {
    return highlight.isControlled || highlight.lastUpdate === 'pointer'
        ? highlight.item
        : keyboardItem;
});
exports.selectorChartsHighlightScope = (0, store_1.createSelector)(exports.selectorChartsHighlightScopePerSeriesId, exports.selectorChartsHighlightedItem, function selectorChartsHighlightScope(seriesIdToHighlightScope, highlightedItem) {
    var _a;
    if (!highlightedItem) {
        return null;
    }
    var highlightScope = (_a = seriesIdToHighlightScope[highlightedItem.type]) === null || _a === void 0 ? void 0 : _a.get(highlightedItem.seriesId);
    if (highlightScope === undefined) {
        return null;
    }
    return highlightScope;
});
var alwaysNone = function () { return 'none'; };
var selectorChartsHighlightStateCallbackImpl = (0, store_1.createSelectorMemoized)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, useChartSeriesConfig_1.selectorChartSeriesConfig, function selectorChartsHighlightStateCallbackCombiner(highlightScope, highlightedItem, seriesConfig) {
    if (highlightedItem === null || highlightScope === null) {
        return alwaysNone;
    }
    var config = seriesConfig[highlightedItem.type];
    var isHighlighted = config.isHighlightedCreator(highlightScope, highlightedItem);
    var isFaded = config.isFadedCreator(highlightScope, highlightedItem);
    return function (item) {
        if (isHighlighted(item)) {
            return 'highlighted';
        }
        if (isFaded(item)) {
            return 'faded';
        }
        return 'none';
    };
});
/**
 * Returns a callback to get the highlight state of an item.
 * Uses an explicit function declaration so that TypeScript preserves
 * the `HighlightItemIdentifier<ChartSeriesType>` reference in `.d.ts` output,
 * allowing module augmentation from pro/premium packages to extend the accepted types.
 */
function selectorChartsHighlightStateCallback(state) {
    return selectorChartsHighlightStateCallbackImpl(state);
}
var selectorChartsHighlightStateImpl = (0, store_1.createSelectorMemoized)(selectorChartsHighlightStateCallback, function selectorChartsHighlightStateCombiner(getHighlightState, item) {
    return getHighlightState(item);
});
/**
 * Returns the highlight state of an item.
 * Uses an explicit function declaration so that TypeScript preserves
 * the `HighlightItemIdentifier<ChartSeriesType>` reference in `.d.ts` output,
 * allowing module augmentation from pro/premium packages to extend the accepted types.
 */
function selectorChartsHighlightState(state, item) {
    return selectorChartsHighlightStateImpl(state, item);
}
// ==========================================================================================
//
// Selectors for a specific series
//
// Those selectors are for series with batch rendering (e.g., Scatter, Bar, Line)
//
// ==========================================================================================
exports.selectorChartIsSeriesHighlighted = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartIsSeriesHighlighted(scope, item, seriesId) {
    return (0, highlightStates_1.isSeriesHighlighted)(scope, item, seriesId);
});
exports.selectorChartIsSeriesFaded = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartIsSeriesFaded(scope, item, seriesId) {
    return (0, highlightStates_1.isSeriesFaded)(scope, item, seriesId);
});
exports.selectorChartSeriesUnfadedItem = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartSeriesUnfadedItem(scope, item, seriesId) {
    return (0, highlightStates_1.getSeriesUnfadedDataIndex)(scope, item, seriesId);
});
exports.selectorChartSeriesHighlightedItem = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartSeriesHighlightedItem(scope, item, seriesId) {
    return (0, highlightStates_1.getSeriesHighlightedDataIndex)(scope, item, seriesId);
});
