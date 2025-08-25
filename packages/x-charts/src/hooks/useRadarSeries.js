"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarSeries = useRadarSeries;
exports.useRadarSeriesContext = useRadarSeriesContext;
var createSeriesSelectorOfType_1 = require("../internals/createSeriesSelectorOfType");
var useSelectorSeries = (0, createSeriesSelectorOfType_1.createSeriesSelectorsOfType)('radar');
var useSelectorSeriesContext = (0, createSeriesSelectorOfType_1.createAllSeriesSelectorOfType)('radar');
function useRadarSeries(seriesIds) {
    return useSelectorSeries(seriesIds);
}
/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
function useRadarSeriesContext() {
    return useSelectorSeriesContext();
}
