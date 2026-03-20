"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyNodeLabelPlot = SankeyNodeLabelPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
var SankeyNodeLabel_1 = require("./SankeyNodeLabel");
function SankeyNodeLabelPlot(props) {
    var _a, _b;
    var inputClasses = props.classes;
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
    var showNodeLabels = (_b = (_a = sankeySeries.nodeOptions) === null || _a === void 0 ? void 0 : _a.showLabels) !== null && _b !== void 0 ? _b : true;
    if (!showNodeLabels) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("g", { className: classes.nodeLabels, children: layout.nodes.map(function (node) { return ((0, jsx_runtime_1.jsx)(SankeyNodeLabel_1.SankeyNodeLabel, { seriesId: sankeySeries.id, node: node }, "label-node-".concat(node.id))); }) }));
}
