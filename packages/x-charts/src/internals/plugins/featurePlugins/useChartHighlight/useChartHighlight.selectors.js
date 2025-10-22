"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartsIsFaded = exports.selectorChartSeriesHighlightedItem = exports.selectorChartSeriesUnfadedItem = exports.selectorChartIsSeriesFaded = exports.selectorChartIsSeriesHighlighted = exports.selectorChartsIsHighlighted = exports.selectorChartsIsFadedCallback = exports.selectorChartsIsHighlightedCallback = exports.selectorChartsHighlightScope = exports.selectorChartsHighlightedItem = exports.selectorChartsHighlightScopePerSeriesId = void 0;
var selectors_1 = require("../../utils/selectors");
var createIsHighlighted_1 = require("./createIsHighlighted");
var createIsFaded_1 = require("./createIsFaded");
var highlightStates_1 = require("./highlightStates");
var useChartKeyboardNavigation_1 = require("../useChartKeyboardNavigation");
var selectHighlight = function (state) { return state.highlight; };
var selectSeries = function (state) { return state.series; };
exports.selectorChartsHighlightScopePerSeriesId = (0, selectors_1.createSelector)([selectSeries], function (series) {
    var map = new Map();
    Object.keys(series.processedSeries).forEach(function (seriesType) {
        var _a;
        var seriesData = series.processedSeries[seriesType];
        (_a = seriesData === null || seriesData === void 0 ? void 0 : seriesData.seriesOrder) === null || _a === void 0 ? void 0 : _a.forEach(function (seriesId) {
            var seriesItem = seriesData === null || seriesData === void 0 ? void 0 : seriesData.series[seriesId];
            map.set(seriesId, seriesItem === null || seriesItem === void 0 ? void 0 : seriesItem.highlightScope);
        });
    });
    return map;
});
exports.selectorChartsHighlightedItem = (0, selectors_1.createSelector)([selectHighlight, useChartKeyboardNavigation_1.selectorChartsKeyboardItem], function selectorChartsHighlightedItem(highlight, keyboardItem) {
    return highlight.lastUpdate === 'pointer' ? highlight.item : keyboardItem;
});
exports.selectorChartsHighlightScope = (0, selectors_1.createSelector)([exports.selectorChartsHighlightScopePerSeriesId, exports.selectorChartsHighlightedItem], function selectorChartsHighlightScope(seriesIdToHighlightScope, highlightedItem) {
    if (!highlightedItem) {
        return null;
    }
    var highlightScope = seriesIdToHighlightScope.get(highlightedItem.seriesId);
    if (highlightScope === undefined) {
        return null;
    }
    return highlightScope;
});
exports.selectorChartsIsHighlightedCallback = (0, selectors_1.createSelector)([exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem], createIsHighlighted_1.createIsHighlighted);
exports.selectorChartsIsFadedCallback = (0, selectors_1.createSelector)([exports.selectorChartsHighlightScope, exports.selectorChartsHighlightedItem], createIsFaded_1.createIsFaded);
exports.selectorChartsIsHighlighted = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, item) { return item; },
], function selectorChartsIsHighlighted(highlightScope, highlightedItem, item) {
    return (0, createIsHighlighted_1.createIsHighlighted)(highlightScope, highlightedItem)(item);
});
exports.selectorChartIsSeriesHighlighted = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, seriesId) { return seriesId; },
], highlightStates_1.isSeriesHighlighted);
exports.selectorChartIsSeriesFaded = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, seriesId) { return seriesId; },
], highlightStates_1.isSeriesFaded);
exports.selectorChartSeriesUnfadedItem = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, seriesId) { return seriesId; },
], highlightStates_1.getSeriesUnfadedItem);
exports.selectorChartSeriesHighlightedItem = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, seriesId) { return seriesId; },
], highlightStates_1.getSeriesHighlightedItem);
exports.selectorChartsIsFaded = (0, selectors_1.createSelector)([
    exports.selectorChartsHighlightScope,
    exports.selectorChartsHighlightedItem,
    function (_, item) { return item; },
], function selectorChartsIsFaded(highlightScope, highlightedItem, item) {
    return (0, createIsFaded_1.createIsFaded)(highlightScope, highlightedItem)(item);
});
