"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsLayerContainerRef = useChartsLayerContainerRef;
var ChartProvider_1 = require("../context/ChartProvider");
/**
 * Get the ref for the chart surface element.
 * @returns The chart surface ref.
 */
function useChartsLayerContainerRef() {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    return instance.chartsLayerContainerRef;
}
