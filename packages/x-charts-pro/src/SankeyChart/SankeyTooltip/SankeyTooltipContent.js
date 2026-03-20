"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.SankeyTooltipContent = SankeyTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var internals_1 = require("@mui/x-charts/internals");
var SankeyTooltip_classes_1 = require("./SankeyTooltip.classes");
function SankeyTooltipContent(props) {
    var classes = (0, SankeyTooltip_classes_1.useUtilityClasses)(props);
    var tooltipData = (0, ChartsTooltip_1.useItemTooltip)();
    if (!tooltipData) {
        return null;
    }
    var color = tooltipData.color, formattedValue = tooltipData.formattedValue, markType = tooltipData.markType, label = tooltipData.label;
    return ((0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipPaper, { className: classes.paper, children: (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipTable, { className: classes.table, children: (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.cell), component: "th", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(internals_1.ChartsLabelMark, { type: markType, color: color, className: classes.mark }) }), label] }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }) }) }) }));
}
SankeyTooltipContent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
};
