"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiePlot = PiePlot;
var jsx_runtime_1 = require("react/jsx-runtime");
var prop_types_1 = require("prop-types");
var PieArcPlot_1 = require("./PieArcPlot");
var PieArcLabelPlot_1 = require("./PieArcLabelPlot");
var usePieSeries_1 = require("../hooks/usePieSeries");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var pieClasses_1 = require("./pieClasses");
/**
 * Demos:
 *
 * - [Pie](https://mui.com/x/react-charts/pie/)
 * - [Pie demonstration](https://mui.com/x/react-charts/pie-demo/)
 *
 * API:
 *
 * - [PiePlot API](https://mui.com/x/api/charts/pie-plot/)
 */
function PiePlot(props) {
    var inSkipAnimation = props.skipAnimation, slots = props.slots, slotProps = props.slotProps, onItemClick = props.onItemClick;
    var seriesData = (0, usePieSeries_1.usePieSeriesContext)();
    var seriesLayout = (0, usePieSeries_1.usePieSeriesLayout)();
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(inSkipAnimation);
    var classes = (0, pieClasses_1.useUtilityClasses)();
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    return ((0, jsx_runtime_1.jsxs)("g", { children: [seriesOrder.map(function (seriesId) {
                var _a = series[seriesId], cornerRadius = _a.cornerRadius, paddingAngle = _a.paddingAngle, data = _a.data, highlighted = _a.highlighted, faded = _a.faded;
                return ((0, jsx_runtime_1.jsx)("g", { className: classes.series, transform: "translate(".concat(seriesLayout[seriesId].center.x, ", ").concat(seriesLayout[seriesId].center.y, ")"), "data-series": seriesId, children: (0, jsx_runtime_1.jsx)(PieArcPlot_1.PieArcPlot, { innerRadius: seriesLayout[seriesId].radius.inner, outerRadius: seriesLayout[seriesId].radius.outer, cornerRadius: cornerRadius, paddingAngle: paddingAngle, seriesId: seriesId, data: data, skipAnimation: skipAnimation, highlighted: highlighted, faded: faded, onItemClick: onItemClick, slots: slots, slotProps: slotProps }) }, seriesId));
            }), seriesOrder.map(function (seriesId) {
                var _a = series[seriesId], cornerRadius = _a.cornerRadius, paddingAngle = _a.paddingAngle, arcLabel = _a.arcLabel, arcLabelMinAngle = _a.arcLabelMinAngle, data = _a.data;
                return ((0, jsx_runtime_1.jsx)("g", { className: classes.seriesLabels, transform: "translate(".concat(seriesLayout[seriesId].center.x, ", ").concat(seriesLayout[seriesId].center.y, ")"), "data-series": seriesId, children: (0, jsx_runtime_1.jsx)(PieArcLabelPlot_1.PieArcLabelPlot, { innerRadius: seriesLayout[seriesId].radius.inner, outerRadius: seriesLayout[seriesId].radius.outer, arcLabelRadius: seriesLayout[seriesId].radius.label, cornerRadius: cornerRadius, paddingAngle: paddingAngle, seriesId: seriesId, data: data, skipAnimation: skipAnimation, arcLabel: arcLabel, arcLabelMinAngle: arcLabelMinAngle, slots: slots, slotProps: slotProps }) }, seriesId));
            })] }));
}
PiePlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
    /**
     * Callback fired when a pie item is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     * @param {PieItemIdentifier} pieItemIdentifier The pie item identifier.
     * @param {DefaultizedPieValueType} item The pie item.
     */
    onItemClick: prop_types_1.default.func,
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation: prop_types_1.default.bool,
    /**
     * The props used for each component slot.
     * @default {}
     */
    slotProps: prop_types_1.default.object,
    /**
     * Overridable component slots.
     * @default {}
     */
    slots: prop_types_1.default.object,
};
