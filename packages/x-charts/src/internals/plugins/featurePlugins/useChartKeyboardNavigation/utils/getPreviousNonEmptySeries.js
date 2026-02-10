"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreviousNonEmptySeries = getPreviousNonEmptySeries;
var getNonEmptySeriesArray_1 = require("./getNonEmptySeriesArray");
/**
 * Returns the previous series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
function getPreviousNonEmptySeries(series, availableSeriesTypes, type, seriesId) {
    var nonEmptySeries = (0, getNonEmptySeriesArray_1.getNonEmptySeriesArray)(series, availableSeriesTypes);
    if (nonEmptySeries.length === 0) {
        return null;
    }
    var currentSeriesIndex = type !== undefined && seriesId !== undefined
        ? nonEmptySeries.findIndex(function (seriesItem) { return seriesItem.type === type && seriesItem.seriesId === seriesId; })
        : -1;
    if (currentSeriesIndex <= 0) {
        // If no current series, or if it's the first series
        return nonEmptySeries[nonEmptySeries.length - 1];
    }
    return nonEmptySeries[(currentSeriesIndex - 1 + nonEmptySeries.length) % nonEmptySeries.length];
}
