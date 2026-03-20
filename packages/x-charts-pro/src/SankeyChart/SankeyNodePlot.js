"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyNodePlot = SankeyNodePlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var SankeyNodeElement_1 = require("./SankeyNodeElement");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
var SankeyNodePlotRoot = (0, styles_1.styled)('g', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
    '& [data-faded=true]': { filter: 'saturate(80%)' },
    '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});
function SankeyNodePlot(props) {
    var inputClasses = props.classes, onClick = props.onClick;
    var classes = (0, sankeyClasses_1.useUtilityClasses)({ classes: inputClasses });
    var sankeySeries = (0, useSankeySeries_1.useSankeySeries)()[0];
    var layout = (0, useSankeySeries_1.useSankeyLayout)();
    if (!sankeySeries) {
        throw new Error("MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartsDataProviderPro.");
    }
    // Early return if no data or dimensions
    if (!layout || !layout.nodes) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(SankeyNodePlotRoot, { className: classes.nodes, children: layout.nodes.map(function (node) { return ((0, jsx_runtime_1.jsx)(SankeyNodeElement_1.SankeyNodeElement, { seriesId: sankeySeries.id, node: node, onClick: onClick }, node.id)); }) }));
}
