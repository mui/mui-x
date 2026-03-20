"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePieSeries = usePieSeries;
exports.usePieSeriesContext = usePieSeriesContext;
exports.usePieSeriesLayout = usePieSeriesLayout;
var seriesSelectorOfType_1 = require("../internals/seriesSelectorOfType");
var useStore_1 = require("../internals/store/useStore");
var useChartSeries_1 = require("../internals/plugins/corePlugins/useChartSeries");
function usePieSeries(seriesIds) {
    return (0, seriesSelectorOfType_1.useSeriesOfType)('pie', seriesIds);
}
/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
function usePieSeriesContext() {
    return (0, seriesSelectorOfType_1.useAllSeriesOfType)('pie');
}
/**
 * Get access to the pie layout.
 * @returns {Record<SeriesId, PieSeriesLayout>} the pie layout
 */
function usePieSeriesLayout() {
    var _a;
    var store = (0, useStore_1.useStore)();
    var seriesLayout = store.use(useChartSeries_1.selectorChartSeriesLayout);
    return (_a = seriesLayout.pie) !== null && _a !== void 0 ? _a : {};
}
