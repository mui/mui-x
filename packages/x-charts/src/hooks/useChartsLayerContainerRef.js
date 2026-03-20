"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartsLayerContainerRef = useChartsLayerContainerRef;
var ChartsProvider_1 = require("../context/ChartsProvider");
/**
 * Get the ref for the chart surface element.
 * @returns The chart surface ref.
 */
function useChartsLayerContainerRef() {
    var instance = (0, ChartsProvider_1.useChartsContext)().instance;
    return instance.chartsLayerContainerRef;
}
