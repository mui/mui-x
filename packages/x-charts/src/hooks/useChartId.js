"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartId = useChartId;
var useStore_1 = require("../internals/store/useStore");
var useSelector_1 = require("../internals/store/useSelector");
var useChartId_selectors_1 = require("../internals/plugins/corePlugins/useChartId/useChartId.selectors");
/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
function useChartId() {
    var store = (0, useStore_1.useStore)();
    return (0, useSelector_1.useSelector)(store, useChartId_selectors_1.selectorChartId);
}
