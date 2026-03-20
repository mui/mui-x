"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRangeBarSeries = useRangeBarSeries;
exports.useRangeBarSeriesContext = useRangeBarSeriesContext;
var internals_1 = require("@mui/x-charts/internals");
function useRangeBarSeries(seriesIds) {
    return (0, internals_1.useSeriesOfType)('rangeBar', seriesIds);
}
/**
 * Get access to the internal state of range bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the range bar series
 */
function useRangeBarSeriesContext() {
    return (0, internals_1.useAllSeriesOfType)('rangeBar');
}
