"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLegend = useLegend;
var useChartSeriesConfig_1 = require("../internals/plugins/corePlugins/useChartSeriesConfig");
var useSeries_1 = require("./useSeries");
var useStore_1 = require("../internals/store/useStore");
function getSeriesToDisplay(series, seriesConfig) {
    return Object.keys(series).flatMap(function (seriesType) {
        var getter = seriesConfig[seriesType].legendGetter;
        return getter === undefined ? [] : getter(series[seriesType]);
    });
}
/**
 * Get the legend items to display.
 *
 * This hook is used by the `ChartsLegend` component. And will return the legend items formatted for display.
 *
 * An alternative is to use the `useSeries` hook and format the legend items yourself.
 *
 * @returns legend data
 */
function useLegend() {
    var series = (0, useSeries_1.useSeries)();
    var store = (0, useStore_1.useStore)();
    var seriesConfig = store.use(useChartSeriesConfig_1.selectorChartSeriesConfig);
    return {
        items: getSeriesToDisplay(series, seriesConfig),
    };
}
