"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePieSeries = usePieSeries;
exports.usePieSeriesContext = usePieSeriesContext;
var createSeriesSelectorOfType_1 = require("../internals/createSeriesSelectorOfType");
var useSelectorSeries = (0, createSeriesSelectorOfType_1.createSeriesSelectorsOfType)('pie');
var useSelectorSeriesContext = (0, createSeriesSelectorOfType_1.createAllSeriesSelectorOfType)('pie');
function usePieSeries(seriesIds) {
    return useSelectorSeries(seriesIds);
}
/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
function usePieSeriesContext() {
    return useSelectorSeriesContext();
}
