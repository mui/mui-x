"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScatterSeries = useScatterSeries;
exports.useScatterSeriesContext = useScatterSeriesContext;
var seriesSelectorOfType_1 = require("../internals/seriesSelectorOfType");
function useScatterSeries(seriesIds) {
    return (0, seriesSelectorOfType_1.useSeriesOfType)('scatter', seriesIds);
}
/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
function useScatterSeriesContext() {
    return (0, seriesSelectorOfType_1.useAllSeriesOfType)('scatter');
}
