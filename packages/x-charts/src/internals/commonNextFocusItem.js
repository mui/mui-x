"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetNextIndexFocusedItem = createGetNextIndexFocusedItem;
exports.createGetPreviousIndexFocusedItem = createGetPreviousIndexFocusedItem;
exports.createGetNextSeriesFocusedItem = createGetNextSeriesFocusedItem;
exports.createGetPreviousSeriesFocusedItem = createGetPreviousSeriesFocusedItem;
var getPreviousNonEmptySeries_1 = require("./plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries");
var getMaxSeriesLength_1 = require("./plugins/featurePlugins/useChartKeyboardNavigation/utils/getMaxSeriesLength");
var getNextNonEmptySeries_1 = require("./plugins/featurePlugins/useChartKeyboardNavigation/utils/getNextNonEmptySeries");
var seriesHasData_1 = require("./seriesHasData");
var useChartSeries_selectors_1 = require("./plugins/corePlugins/useChartSeries/useChartSeries.selectors");
function createGetNextIndexFocusedItem(
/**
 * The set of series types compatible with this navigation action.
 */
compatibleSeriesTypes, 
/**
 * If true, allows cycling from the last item to the first one.
 */
allowCycles) {
    if (allowCycles === void 0) { allowCycles = false; }
    return function getNextIndexFocusedItem(currentItem, state) {
        var processedSeries = (0, useChartSeries_selectors_1.selectorChartSeriesProcessed)(state);
        var seriesId = currentItem === null || currentItem === void 0 ? void 0 : currentItem.seriesId;
        var type = currentItem === null || currentItem === void 0 ? void 0 : currentItem.type;
        if (!type || seriesId == null || !(0, seriesHasData_1.seriesHasData)(processedSeries, type, seriesId)) {
            var nextSeries = (0, getNextNonEmptySeries_1.getNextNonEmptySeries)(processedSeries, compatibleSeriesTypes, type, seriesId);
            if (nextSeries === null) {
                return null;
            }
            type = nextSeries.type;
            seriesId = nextSeries.seriesId;
        }
        var maxLength = (0, getMaxSeriesLength_1.getMaxSeriesLength)(processedSeries, compatibleSeriesTypes);
        var dataIndex = (currentItem === null || currentItem === void 0 ? void 0 : currentItem.dataIndex) == null ? 0 : currentItem.dataIndex + 1;
        if (allowCycles) {
            dataIndex = dataIndex % maxLength;
        }
        else {
            dataIndex = Math.min(maxLength - 1, dataIndex);
        }
        return {
            type: type,
            seriesId: seriesId,
            dataIndex: dataIndex,
        };
    };
}
function createGetPreviousIndexFocusedItem(
/**
 * The set of series types compatible with this navigation action.
 */
compatibleSeriesTypes, 
/**
 * If true, allows cycling from the last item to the first one.
 */
allowCycles) {
    if (allowCycles === void 0) { allowCycles = false; }
    return function getPreviousIndexFocusedItem(currentItem, state) {
        var processedSeries = (0, useChartSeries_selectors_1.selectorChartSeriesProcessed)(state);
        var seriesId = currentItem === null || currentItem === void 0 ? void 0 : currentItem.seriesId;
        var type = currentItem === null || currentItem === void 0 ? void 0 : currentItem.type;
        if (!type || seriesId == null || !(0, seriesHasData_1.seriesHasData)(processedSeries, type, seriesId)) {
            var previousSeries = (0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(processedSeries, compatibleSeriesTypes, type, seriesId);
            if (previousSeries === null) {
                return null;
            }
            type = previousSeries.type;
            seriesId = previousSeries.seriesId;
        }
        var maxLength = (0, getMaxSeriesLength_1.getMaxSeriesLength)(processedSeries, compatibleSeriesTypes);
        var dataIndex = (currentItem === null || currentItem === void 0 ? void 0 : currentItem.dataIndex) == null ? maxLength - 1 : currentItem.dataIndex - 1;
        if (allowCycles) {
            dataIndex = (maxLength + dataIndex) % maxLength;
        }
        else {
            dataIndex = Math.max(0, dataIndex);
        }
        return {
            type: type,
            seriesId: seriesId,
            dataIndex: dataIndex,
        };
    };
}
function createGetNextSeriesFocusedItem(
/**
 * The set of series types compatible with this navigation action.
 */
compatibleSeriesTypes) {
    return function getNextSeriesFocusedItem(currentItem, state) {
        var processedSeries = (0, useChartSeries_selectors_1.selectorChartSeriesProcessed)(state);
        var seriesId = currentItem === null || currentItem === void 0 ? void 0 : currentItem.seriesId;
        var type = currentItem === null || currentItem === void 0 ? void 0 : currentItem.type;
        var nextSeries = (0, getNextNonEmptySeries_1.getNextNonEmptySeries)(processedSeries, compatibleSeriesTypes, type, seriesId);
        if (nextSeries === null) {
            return null; // No series to move the focus to.
        }
        type = nextSeries.type;
        seriesId = nextSeries.seriesId;
        var dataIndex = (currentItem === null || currentItem === void 0 ? void 0 : currentItem.dataIndex) == null ? 0 : currentItem.dataIndex;
        return {
            type: type,
            seriesId: seriesId,
            dataIndex: dataIndex,
        };
    };
}
function createGetPreviousSeriesFocusedItem(
/**
 * The set of series types compatible with this navigation action.
 */
compatibleSeriesTypes) {
    return function getPreviousSeriesFocusedItem(currentItem, state) {
        var processedSeries = (0, useChartSeries_selectors_1.selectorChartSeriesProcessed)(state);
        var seriesId = currentItem === null || currentItem === void 0 ? void 0 : currentItem.seriesId;
        var type = currentItem === null || currentItem === void 0 ? void 0 : currentItem.type;
        var previousSeries = (0, getPreviousNonEmptySeries_1.getPreviousNonEmptySeries)(processedSeries, compatibleSeriesTypes, type, seriesId);
        if (previousSeries === null) {
            return null; // No series to move the focus to.
        }
        type = previousSeries.type;
        seriesId = previousSeries.seriesId;
        var data = processedSeries[type].series[seriesId].data;
        var dataIndex = (currentItem === null || currentItem === void 0 ? void 0 : currentItem.dataIndex) == null ? data.length - 1 : currentItem.dataIndex;
        return {
            type: type,
            seriesId: seriesId,
            dataIndex: dataIndex,
        };
    };
}
