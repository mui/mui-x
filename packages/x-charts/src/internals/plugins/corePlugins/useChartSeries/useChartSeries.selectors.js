"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorChartSeriesLayout = exports.selectorChartSeriesProcessed = exports.selectorChartDataset = exports.selectorChartDefaultizedSeries = exports.selectorChartSeriesState = void 0;
var store_1 = require("@mui/x-internals/store");
var processSeries_1 = require("./processSeries");
var useChartDimensions_1 = require("../useChartDimensions");
var useChartVisibilityManager_1 = require("../../featurePlugins/useChartVisibilityManager");
var useChartSeriesConfig_selectors_1 = require("../useChartSeriesConfig/useChartSeriesConfig.selectors");
var selectorChartSeriesState = function (state) {
    return state.series;
};
exports.selectorChartSeriesState = selectorChartSeriesState;
exports.selectorChartDefaultizedSeries = (0, store_1.createSelector)(exports.selectorChartSeriesState, function (seriesState) { return seriesState.defaultizedSeries; });
/**
 * Get the dataset from the series state.
 * @returns {DatasetType | undefined} The dataset.
 */
exports.selectorChartDataset = (0, store_1.createSelector)(exports.selectorChartSeriesState, function (seriesState) { return seriesState.dataset; });
/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * @returns {ProcessedSeries} The processed series.
 */
exports.selectorChartSeriesProcessed = (0, store_1.createSelectorMemoized)(exports.selectorChartDefaultizedSeries, useChartSeriesConfig_selectors_1.selectorChartSeriesConfig, exports.selectorChartDataset, useChartVisibilityManager_1.selectorIsItemVisibleGetter, function selectorChartSeriesProcessed(defaultizedSeries, seriesConfig, dataset, isItemVisible) {
    return (0, processSeries_1.applySeriesProcessors)(defaultizedSeries, seriesConfig, dataset, isItemVisible);
});
/**
 * Get the processed series after applying series processors.
 * This selector computes the processed series on-demand from the defaultized series.
 * @returns {ProcessedSeries} The processed series.
 */
exports.selectorChartSeriesLayout = (0, store_1.createSelectorMemoized)(exports.selectorChartSeriesProcessed, useChartSeriesConfig_selectors_1.selectorChartSeriesConfig, useChartDimensions_1.selectorChartDrawingArea, function selectorChartSeriesLayout(processedSeries, seriesConfig, drawingArea) {
    return (0, processSeries_1.applySeriesLayout)(processedSeries, seriesConfig, drawingArea);
});
