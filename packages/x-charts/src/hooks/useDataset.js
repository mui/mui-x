"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataset = useDataset;
var useStore_1 = require("../internals/store/useStore");
var useChartSeries_selectors_1 = require("../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors");
/**
 * Get access to the dataset used to populate series and axes data.
 * @returns {DatasetType | undefined} The dataset array if provided, otherwise undefined.
 */
function useDataset() {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartSeries_selectors_1.selectorChartDataset);
}
