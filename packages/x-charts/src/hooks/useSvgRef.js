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
    var context = (0, ChartProvider_1.useChartContext)();
    if (!context) {
        throw new Error([
            'MUI X Charts: Could not find the svg ref context.',
            'It looks like you rendered your component outside of a ChartContainer parent component.',
        ].join('\n'));
    }
    return context.svgRef;
}
