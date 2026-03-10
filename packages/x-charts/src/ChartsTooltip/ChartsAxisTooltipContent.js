"use strict";
'use client';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsAxisTooltipContent = ChartsAxisTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var Typography_1 = require("@mui/material/Typography");
var clsx_1 = require("clsx");
var chartsTooltipClasses_1 = require("./chartsTooltipClasses");
var ChartsTooltipTable_1 = require("./ChartsTooltipTable");
var useAxesTooltip_1 = require("./useAxesTooltip");
var ChartsLabelMark_1 = require("../ChartsLabel/ChartsLabelMark");
function ChartsAxisTooltipContent(props) {
    var sort = props.sort;
    var classes = (0, chartsTooltipClasses_1.useUtilityClasses)(props.classes);
    var tooltipData = (0, useAxesTooltip_1.useAxesTooltip)();
    if (tooltipData === null) {
        return null;
    }
    return ((0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipPaper, { sx: props.sx, className: classes.paper, children: tooltipData.map(function (_a) {
            var axisId = _a.axisId, mainAxis = _a.mainAxis, axisValue = _a.axisValue, axisFormattedValue = _a.axisFormattedValue, seriesItems = _a.seriesItems;
            var sortedItems = sort && sort !== 'none'
                ? __spreadArray([], seriesItems, true).sort(function (a, b) {
                    var _a, _b;
                    var aValue = (_a = a.value) === null || _a === void 0 ? void 0 : _a.valueOf();
                    var bValue = (_b = b.value) === null || _b === void 0 ? void 0 : _b.valueOf();
                    if (typeof aValue !== 'number') {
                        return 1;
                    }
                    if (typeof bValue !== 'number') {
                        return -1;
                    }
                    return sort === 'asc' ? aValue - bValue : bValue - aValue;
                })
                : seriesItems;
            return ((0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipTable, { className: classes.table, children: [axisValue != null && !mainAxis.hideTooltip && ((0, jsx_runtime_1.jsx)(Typography_1.default, { component: "caption", children: axisFormattedValue })), (0, jsx_runtime_1.jsx)("tbody", { children: sortedItems.map(function (_a) {
                            var seriesId = _a.seriesId, color = _a.color, formattedValue = _a.formattedValue, formattedLabel = _a.formattedLabel, markType = _a.markType, markShape = _a.markShape;
                            if (formattedValue == null) {
                                return null;
                            }
                            return ((0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsxs)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(ChartsLabelMark_1.ChartsLabelMark, { type: markType, markShape: markShape, color: color, className: classes.mark }) }), formattedLabel || null] }), (0, jsx_runtime_1.jsx)(ChartsTooltipTable_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }, seriesId));
                        }) })] }, axisId));
        }) }));
}
ChartsAxisTooltipContent.propTypes = {
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
    /**
     * The sort in which series items are displayed in the tooltip.
     * When set to `none`, series are sorted as they are provided in the series property. Otherwise they are sorted by their value.
     * @default 'none'
     */
    sort: prop_types_1.default.oneOf(['none', 'asc', 'desc']),
};
