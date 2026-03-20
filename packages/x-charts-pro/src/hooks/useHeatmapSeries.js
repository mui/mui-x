"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHeatmapSeries = useHeatmapSeries;
exports.useHeatmapSeriesContext = useHeatmapSeriesContext;
var internals_1 = require("@mui/x-charts/internals");
function useHeatmapSeries(seriesIds) {
    return (0, internals_1.useSeriesOfType)('heatmap', seriesIds);
}
/**
 * Get access to the internal state of heatmap series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the heatmap series
 */
function useHeatmapSeriesContext() {
    return (0, internals_1.useAllSeriesOfType)('heatmap');
}
