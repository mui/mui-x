"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOHLCSeries = useOHLCSeries;
exports.useOHLCSeriesContext = useOHLCSeriesContext;
var internals_1 = require("@mui/x-charts/internals");
function useOHLCSeries(seriesIds) {
    return (0, internals_1.useSeriesOfType)('ohlc', seriesIds);
}
/**
 * Get access to the internal state of OHLC series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the OHLC series
 */
function useOHLCSeriesContext() {
    return (0, internals_1.useAllSeriesOfType)('ohlc');
}
