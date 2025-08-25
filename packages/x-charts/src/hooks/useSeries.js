"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSeries = useSeries;
var useStore_1 = require("../internals/store/useStore");
var useSelector_1 = require("../internals/store/useSelector");
var useChartSeries_selectors_1 = require("../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors");
/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
function useSeries() {
    var store = (0, useStore_1.useStore)();
    return (0, useSelector_1.useSelector)(store, useChartSeries_selectors_1.selectorChartSeriesProcessed);
}
