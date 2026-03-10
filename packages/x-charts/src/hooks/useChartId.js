"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartId = useChartId;
var useStore_1 = require("../internals/store/useStore");
var useChartId_selectors_1 = require("../internals/plugins/corePlugins/useChartId/useChartId.selectors");
/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
function useChartId() {
    var store = (0, useStore_1.useStore)();
    return store.use(useChartId_selectors_1.selectorChartId);
}
