"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapTooltipContent = HeatmapTooltipContent;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var useHeatmapSeries_1 = require("../../hooks/useHeatmapSeries");
var HeatmapTooltipAxesValue_1 = require("./HeatmapTooltipAxesValue");
var HeatmapTooltip_classes_1 = require("./HeatmapTooltip.classes");
function HeatmapTooltipContent(props) {
    var _a, _b, _c, _d, _e;
    var classes = (0, HeatmapTooltip_classes_1.useUtilityClasses)(props);
    var xAxis = (0, hooks_1.useXAxis)();
    var yAxis = (0, hooks_1.useYAxis)();
    var heatmapSeries = (0, useHeatmapSeries_1.useHeatmapSeriesContext)();
    var tooltipData = (0, ChartsTooltip_1.useItemTooltip)();
    if (!tooltipData || !heatmapSeries || heatmapSeries.seriesOrder.length === 0) {
        return null;
    }
    var color = tooltipData.color, markType = tooltipData.markType, identifier = tooltipData.identifier;
    var thisSeries = heatmapSeries.series[heatmapSeries.seriesOrder[0]];
    var value = (_a = thisSeries.heatmapData.getValue(identifier.xIndex, identifier.yIndex)) !== null && _a !== void 0 ? _a : null;
    if (value === null) {
        return null;
    }
    var xIndex = identifier.xIndex, yIndex = identifier.yIndex;
    var formattedX = (_c = (_b = xAxis.valueFormatter) === null || _b === void 0 ? void 0 : _b.call(xAxis, xAxis.data[xIndex], {
        location: 'tooltip',
        scale: xAxis.scale,
    })) !== null && _c !== void 0 ? _c : xAxis.data[xIndex].toLocaleString();
    var formattedY = (_e = (_d = yAxis.valueFormatter) === null || _d === void 0 ? void 0 : _d.call(yAxis, yAxis.data[yIndex], { location: 'tooltip', scale: yAxis.scale })) !== null && _e !== void 0 ? _e : yAxis.data[yIndex].toLocaleString();
    var formattedValue = thisSeries.valueFormatter(value, { xIndex: xIndex, yIndex: yIndex });
    var seriesLabel = (0, internals_1.getLabel)(thisSeries.label, 'tooltip');
    return ((0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipPaper, { className: classes.paper, children: (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipTable, { className: classes.table, children: [(0, jsx_runtime_1.jsxs)(HeatmapTooltipAxesValue_1.HeatmapTooltipAxesValue, { children: [(0, jsx_runtime_1.jsx)("span", { children: formattedX }), (0, jsx_runtime_1.jsx)("span", { children: formattedY })] }), (0, jsx_runtime_1.jsx)("tbody", { children: (0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipRow, { className: classes.row, children: [(0, jsx_runtime_1.jsxs)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.labelCell, classes.cell), component: "th", children: [(0, jsx_runtime_1.jsx)("div", { className: classes.markContainer, children: (0, jsx_runtime_1.jsx)(internals_1.ChartsLabelMark, { type: markType, color: color, className: classes.mark }) }), seriesLabel] }), (0, jsx_runtime_1.jsx)(ChartsTooltip_1.ChartsTooltipCell, { className: (0, clsx_1.default)(classes.valueCell, classes.cell), component: "td", children: formattedValue })] }) })] }) }));
}
HeatmapTooltipContent.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Override or extend the styles applied to the component.
     */
    classes: prop_types_1.default.object,
};
