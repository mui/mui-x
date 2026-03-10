"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextNonEmptySeries = getNextNonEmptySeries;
var getNonEmptySeriesArray_1 = require("./getNonEmptySeriesArray");
/**
 * Returns the next series type and id that contains some data.
 * Returns `null` if no other series have data.
 * @param series - The processed series from the store.
 * @param availableSeriesTypes - The set of series types that can be focused.
 * @param type - The current series type.
 * @param seriesId - The current series id.
 */
function getNextNonEmptySeries(series, availableSeriesTypes, type, seriesId) {
    var nonEmptySeries = (0, getNonEmptySeriesArray_1.getNonEmptySeriesArray)(series, availableSeriesTypes);
    if (nonEmptySeries.length === 0) {
        return null;
    }
    var currentSeriesIndex = type !== undefined && seriesId !== undefined
        ? nonEmptySeries.findIndex(function (seriesItem) { return seriesItem.type === type && seriesItem.seriesId === seriesId; })
        : -1;
    return nonEmptySeries[(currentSeriesIndex + 1) % nonEmptySeries.length];
}
