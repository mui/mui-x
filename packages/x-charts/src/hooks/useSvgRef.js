"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSvgRef = useSvgRef;
var ChartProvider_1 = require("../context/ChartProvider");
/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
function useSvgRef() {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    return instance.svgRef;
}
