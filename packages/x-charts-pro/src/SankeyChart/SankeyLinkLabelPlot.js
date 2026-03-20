"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyLinkLabelPlot = SankeyLinkLabelPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var SankeyLinkLabel_1 = require("./SankeyLinkLabel");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
function SankeyLinkLabelPlot(props) {
    var _a;
    var inputClasses = props.classes;
    var classes = (0, sankeyClasses_1.useUtilityClasses)({ classes: inputClasses });
    var sankeySeries = (0, useSankeySeries_1.useSankeySeries)()[0];
    var layout = (0, useSankeySeries_1.useSankeyLayout)();
    if (!sankeySeries) {
        throw new Error("MUI X Charts: Sankey series context is missing. Ensure the SankeyPlot is used inside a properly configured ChartsDataProviderPro.");
    }
    // Early return if no data or dimensions
    if (!layout || !layout.links) {
        return null;
    }
    if (!((_a = sankeySeries.linkOptions) === null || _a === void 0 ? void 0 : _a.showValues)) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)("g", { className: classes.linkLabels, children: layout.links.map(function (link) { return ((0, jsx_runtime_1.jsx)(SankeyLinkLabel_1.SankeyLinkLabel, { link: link }, "label-link-".concat(link.source.id, "-").concat(link.target.id))); }) }));
}
