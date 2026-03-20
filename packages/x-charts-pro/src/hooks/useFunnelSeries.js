"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFunnelSeries = useFunnelSeries;
exports.useFunnelSeriesContext = useFunnelSeriesContext;
var internals_1 = require("@mui/x-charts/internals");
function useFunnelSeries(seriesIds) {
    return (0, internals_1.useSeriesOfType)('funnel', seriesIds);
}
/**
 * Get access to the internal state of funnel series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the funnel series
 */
function useFunnelSeriesContext() {
    return (0, internals_1.useAllSeriesOfType)('funnel');
}
