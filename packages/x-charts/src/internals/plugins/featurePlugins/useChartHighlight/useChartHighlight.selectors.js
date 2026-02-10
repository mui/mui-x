"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsIsFaded = exports.selectorChartSeriesHighlightedItem = exports.selectorChartSeriesUnfadedItem = exports.selectorChartIsSeriesFaded = exports.selectorChartIsSeriesHighlighted = exports.selectorChartsIsHighlighted = exports.selectorChartsIsFadedCallback = exports.selectorChartsIsHighlightedCallback = exports.selectorChartsHighlightScope = exports.selectorChartsHighlightedItem = exports.selectorChartsHighlightScopePerSeriesId = void 0;
var store_1 = require("@mui/x-internals/store");
var createIsHighlighted_1 = require("./createIsHighlighted");
var createIsFaded_1 = require("./createIsFaded");
var highlightStates_1 = require("./highlightStates");
var useChartKeyboardNavigation_1 = require("../useChartKeyboardNavigation");
var useChartSeries_selectors_1 = require("../../corePlugins/useChartSeries/useChartSeries.selectors");
var selectHighlight = function (state) { return state.highlight; };
exports.selectorChartsHighlightScopePerSeriesId = (0, store_1.createSelectorMemoized)(useChartSeries_selectors_1.selectorChartSeriesProcessed, function (processedSeries) {
    var map = new Map();
    Object.keys(processedSeries).forEach(function (seriesType) {
        var _a;
        var seriesData = processedSeries[seriesType];
        (_a = seriesData === null || seriesData === void 0 ? void 0 : seriesData.seriesOrder) === null || _a === void 0 ? void 0 : _a.forEach(function (seriesId) {
            var seriesItem = seriesData === null || seriesData === void 0 ? void 0 : seriesData.series[seriesId];
            map.set(seriesId, seriesItem === null || seriesItem === void 0 ? void 0 : seriesItem.highlightScope);
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
    if (!highlightedItem) {
        return null;
    }
    var highlightScope = seriesIdToHighlightScope.get(highlightedItem.seriesId);
    if (highlightScope === undefined) {
        return null;
    }
    return highlightScope;
});
exports.selectorChartsIsHighlightedCallback = (0, store_1.createSelectorMemoized)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, createIsHighlighted_1.createIsHighlighted);
exports.selectorChartsIsFadedCallback = (0, store_1.createSelectorMemoized)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, createIsFaded_1.createIsFaded);
exports.selectorChartsIsHighlighted = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartsIsHighlighted(highlightScope, highlightedItem, item) {
    return (0, createIsHighlighted_1.createIsHighlighted)(highlightScope, highlightedItem)(item);
});
exports.selectorChartIsSeriesHighlighted = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, highlightStates_1.isSeriesHighlighted);
exports.selectorChartIsSeriesFaded = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, highlightStates_1.isSeriesFaded);
exports.selectorChartSeriesUnfadedItem = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, highlightStates_1.getSeriesUnfadedDataIndex);
exports.selectorChartSeriesHighlightedItem = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, highlightStates_1.getSeriesHighlightedDataIndex);
exports.selectorChartsIsFaded = (0, store_1.createSelector)(exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem, function selectorChartsIsFaded(highlightScope, highlightedItem, item) {
    return (0, createIsFaded_1.createIsFaded)(highlightScope, highlightedItem)(item);
});
