"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSeriesHighlighted = isSeriesHighlighted;
exports.isSeriesFaded = isSeriesFaded;
exports.getSeriesHighlightedDataIndex = getSeriesHighlightedDataIndex;
exports.getSeriesUnfadedDataIndex = getSeriesUnfadedDataIndex;
function isSeriesHighlighted(scope, item, seriesId) {
    return (scope === null || scope === void 0 ? void 0 : scope.highlight) === 'series' && (item === null || item === void 0 ? void 0 : item.seriesId) === seriesId;
}
function isSeriesFaded(scope, item, seriesId) {
    if (isSeriesHighlighted(scope, item, seriesId)) {
        return false;
    }
    return (((scope === null || scope === void 0 ? void 0 : scope.fade) === 'global' && item != null) ||
        ((scope === null || scope === void 0 ? void 0 : scope.fade) === 'series' && (item === null || item === void 0 ? void 0 : item.seriesId) === seriesId));
}
/**
 * Returns the data index of the highlighted item for a specific series.
 * If the item is not highlighted, it returns `null`.
 */
function getSeriesHighlightedDataIndex(scope, item, seriesId) {
    return (scope === null || scope === void 0 ? void 0 : scope.highlight) === 'item' && (item === null || item === void 0 ? void 0 : item.seriesId) === seriesId ? item.dataIndex : null;
}
/**
 * Returns the data index of the "unfaded item" for a specific series.
 * An "unfaded item" is the only item of a faded series that shouldn't be faded.
 * If the series is not faded or if there is no highlighted item, it returns `null`.
 */
function getSeriesUnfadedDataIndex(scope, item, seriesId) {
    if (isSeriesHighlighted(scope, item, seriesId)) {
        return null;
    }
    if (getSeriesHighlightedDataIndex(scope, item, seriesId) === (item === null || item === void 0 ? void 0 : item.dataIndex)) {
        return null;
    }
    return ((scope === null || scope === void 0 ? void 0 : scope.fade) === 'series' || (scope === null || scope === void 0 ? void 0 : scope.fade) === 'global') && (item === null || item === void 0 ? void 0 : item.seriesId) === seriesId
        ? item.dataIndex
        : null;
}
