"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLineSeries = useLineSeries;
exports.useLineSeriesContext = useLineSeriesContext;
var seriesSelectorOfType_1 = require("../internals/seriesSelectorOfType");
function useLineSeries(seriesIds) {
    return (0, seriesSelectorOfType_1.useSeriesOfType)('line', seriesIds);
}
/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the line series
 */
function useLineSeriesContext() {
    return (0, seriesSelectorOfType_1.useAllSeriesOfType)('line');
}
