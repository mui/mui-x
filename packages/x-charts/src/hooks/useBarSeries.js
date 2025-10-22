"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBarSeries = useBarSeries;
exports.useBarSeriesContext = useBarSeriesContext;
var createSeriesSelectorOfType_1 = require("../internals/createSeriesSelectorOfType");
var useSelectorSeries = (0, createSeriesSelectorOfType_1.createSeriesSelectorsOfType)('bar');
var useSelectorSeriesContext = (0, createSeriesSelectorOfType_1.createAllSeriesSelectorOfType)('bar');
function useBarSeries(seriesIds) {
    return useSelectorSeries(seriesIds);
}
/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the bar series
 */
function useBarSeriesContext() {
    return useSelectorSeriesContext();
}
