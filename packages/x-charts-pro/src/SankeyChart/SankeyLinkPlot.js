"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyLinkPlot = SankeyLinkPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var styles_1 = require("@mui/material/styles");
var SankeyLinkElement_1 = require("./SankeyLinkElement");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
var SankeyLinkPlotRoot = (0, styles_1.styled)('g', {
    slot: 'internal',
    shouldForwardProp: undefined,
})({
    transition: 'opacity 0.1s ease-out, filter 0.1s ease-out',
    '& [data-faded=true]': { filter: 'saturate(80%)' },
    '& [data-highlighted=true]': { filter: 'saturate(120%)' },
});
function SankeyLinkPlot(props) {
    var inputClasses = props.classes, onClick = props.onClick;
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
    return ((0, jsx_runtime_1.jsx)(SankeyLinkPlotRoot, { className: classes.links, children: layout.links.map(function (link) {
            var _a;
            return ((0, jsx_runtime_1.jsx)(SankeyLinkElement_1.SankeyLinkElement, { seriesId: sankeySeries.id, link: link, opacity: (_a = sankeySeries === null || sankeySeries === void 0 ? void 0 : sankeySeries.linkOptions) === null || _a === void 0 ? void 0 : _a.opacity, onClick: onClick }, "".concat(link.source.id, "-").concat(link.target.id)));
        }) }));
}
