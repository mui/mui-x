"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScatterSeries = useScatterSeries;
exports.useScatterSeriesContext = useScatterSeriesContext;
var createSeriesSelectorOfType_1 = require("../internals/createSeriesSelectorOfType");
var useSelectorSeries = (0, createSeriesSelectorOfType_1.createSeriesSelectorsOfType)('scatter');
var useSelectorSeriesContext = (0, createSeriesSelectorOfType_1.createAllSeriesSelectorOfType)('scatter');
function useScatterSeries(seriesIds) {
    return useSelectorSeries(seriesIds);
}
/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
function useScatterSeriesContext() {
    return useSelectorSeriesContext();
}
