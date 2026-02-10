"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRadarSeries = useRadarSeries;
exports.useRadarSeriesContext = useRadarSeriesContext;
var seriesSelectorOfType_1 = require("../internals/seriesSelectorOfType");
function useRadarSeries(seriesIds) {
    return (0, seriesSelectorOfType_1.useSeriesOfType)('radar', seriesIds);
}
/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
function useRadarSeriesContext() {
    return (0, seriesSelectorOfType_1.useAllSeriesOfType)('radar');
}
