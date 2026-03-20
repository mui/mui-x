"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyPlot = SankeyPlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var prop_types_1 = require("prop-types");
var styles_1 = require("@mui/material/styles");
var useSankeySeries_1 = require("../hooks/useSankeySeries");
var sankeyClasses_1 = require("./sankeyClasses");
var SankeyNodePlot_1 = require("./SankeyNodePlot");
var SankeyLinkPlot_1 = require("./SankeyLinkPlot");
var SankeyNodeLabelPlot_1 = require("./SankeyNodeLabelPlot");
var SankeyLinkLabelPlot_1 = require("./SankeyLinkLabelPlot");
var SankeyPlotRoot = (0, styles_1.styled)('g', {
    name: 'MuiSankeyPlot',
    slot: 'Root',
})({});
/**
 * Renders a Sankey diagram plot.
 */
function SankeyPlot(props) {
    var _a;
    var inputClasses = props.classes, onLinkClick = props.onLinkClick, onNodeClick = props.onNodeClick;
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
    var linkOptions = sankeySeries.linkOptions, nodeOptions = sankeySeries.nodeOptions;
    var showNodeLabels = (_a = nodeOptions === null || nodeOptions === void 0 ? void 0 : nodeOptions.showLabels) !== null && _a !== void 0 ? _a : true;
    return ((0, jsx_runtime_1.jsxs)(SankeyPlotRoot, { className: classes.root, children: [(0, jsx_runtime_1.jsx)(SankeyLinkPlot_1.SankeyLinkPlot, { classes: classes, onClick: onLinkClick }), (0, jsx_runtime_1.jsx)(SankeyNodePlot_1.SankeyNodePlot, { classes: classes, onClick: onNodeClick }), (linkOptions === null || linkOptions === void 0 ? void 0 : linkOptions.showValues) && (0, jsx_runtime_1.jsx)(SankeyLinkLabelPlot_1.SankeyLinkLabelPlot, { classes: classes }), showNodeLabels && (0, jsx_runtime_1.jsx)(SankeyNodeLabelPlot_1.SankeyNodeLabelPlot, { classes: classes })] }));
}
SankeyPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Classes applied to the various elements.
     */
    classes: prop_types_1.default.object,
    /**
     * Callback fired when a sankey item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {SankeyLinkIdentifierWithData} link The sankey link identifier.
     */
    onLinkClick: prop_types_1.default.func,
    /**
     * Callback fired when a sankey item is clicked.
     * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
     * @param {SankeyNodeIdentifierWithData} node The sankey node identifier.
     */
    onNodeClick: prop_types_1.default.func,
};
