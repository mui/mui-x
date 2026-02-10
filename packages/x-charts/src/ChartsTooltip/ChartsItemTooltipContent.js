"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsItemTooltipContent = ChartsItemTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var Typography_1 = require("@mui/material/Typography");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var useItemTooltip_1 = require("./useItemTooltip");
var ChartsTooltipTable_1 = require("./ChartsTooltipTable");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
function ChartsItemTooltipContent(props) {
    var propClasses = props.classes, sx = props.sx;
    var tooltipData = (0, useItemTooltip_1.useInternalItemTooltip)();
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(propClasses);
    if (!tooltipData) {
        return null;
    }
    if ('values' in tooltipData) {
        var seriesLabel = tooltipData.label, color_1 = tooltipData.color, markType_1 = tooltipData.markType;
        return ((0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipPaper, { sx: sx, className: classes.paper, children: (0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipTable, { className: classes.table, children: [(0, jsx_runtime_1.jsxs)(Typography_1.default, { component: "caption", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { type: markType_1, color: color_1, className: classes.mark }) }), seriesLabel] }), (0, jsx_runtime_1.jsx)("tbody", { children: tooltipData.values.map(function (_a) {
                            var formattedValue = _a.formattedValue, label = _a.label;
                            return ((0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: label }), (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }, label));
                        }) })] }) }));
    }
    var color = tooltipData.color, label = tooltipData.label, formattedValue = tooltipData.formattedValue, markType = tooltipData.markType;
    return ((0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipPaper, { sx: sx, className: classes.paper, children: (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipTable, { className: classes.table, children: (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { type: markType, color: color, className: classes.mark }) }), label] }), (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }) }) }) }));
}
ChartsItemTooltipContent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
    sx: prop_types_1.default.oneOfType([
        prop_types_1.default.arrayOf(prop_types_1.default.oneOfType([prop_types_1.default.func, prop_types_1.default.object, prop_types_1.default.bool])),
        prop_types_1.default.func,
        prop_types_1.default.object,
    ]),
};
