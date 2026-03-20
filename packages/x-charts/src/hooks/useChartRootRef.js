"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartRootRef = useChartRootRef;
var ChartsProvider_1 = require("../context/ChartsProvider");
/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
function useChartRootRef() {
    var instance = (0, ChartsProvider_1.useChartsContext)().instance;
    return instance.chartRootRef;
}
