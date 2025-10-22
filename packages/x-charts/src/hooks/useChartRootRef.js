"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartRootRef = useChartRootRef;
var ChartProvider_1 = require("../context/ChartProvider");
/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
function useChartRootRef() {
    var context = (0, ChartProvider_1.useChartContext)();
    return context.chartRootRef;
}
