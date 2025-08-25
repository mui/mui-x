"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PiePlot = PiePlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var PieArcPlot_1 = require("./PieArcPlot");
var PieArcLabelPlot_1 = require("./PieArcLabelPlot");
var getPercentageValue_1 = require("../internals/getPercentageValue");
var getPieCoordinates_1 = require("./getPieCoordinates");
var usePieSeries_1 = require("../hooks/usePieSeries");
var useSkipAnimation_1 = require("../hooks/useSkipAnimation");
var hooks_1 = require("../hooks");
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
    var _a = (0, hooks_1.useDrawingArea)(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
    var skipAnimation = (0, useSkipAnimation_1.useSkipAnimation)(inSkipAnimation);
    var classes = (0, pieClasses_1.useUtilityClasses)();
    if (seriesData === undefined) {
        return null;
    }
    var series = seriesData.series, seriesOrder = seriesData.seriesOrder;
    return (<g>
      {seriesOrder.map(function (seriesId) {
            var _a = series[seriesId], innerRadiusParam = _a.innerRadius, outerRadiusParam = _a.outerRadius, cornerRadius = _a.cornerRadius, paddingAngle = _a.paddingAngle, data = _a.data, cxParam = _a.cx, cyParam = _a.cy, highlighted = _a.highlighted, faded = _a.faded;
            var _b = (0, getPieCoordinates_1.getPieCoordinates)({ cx: cxParam, cy: cyParam }, { width: width, height: height }), cx = _b.cx, cy = _b.cy, availableRadius = _b.availableRadius;
            var outerRadius = (0, getPercentageValue_1.getPercentageValue)(outerRadiusParam !== null && outerRadiusParam !== void 0 ? outerRadiusParam : availableRadius, availableRadius);
            var innerRadius = (0, getPercentageValue_1.getPercentageValue)(innerRadiusParam !== null && innerRadiusParam !== void 0 ? innerRadiusParam : 0, availableRadius);
            return (<g key={seriesId} className={classes.series} transform={"translate(".concat(left + cx, ", ").concat(top + cy, ")")} data-series={seriesId}>
            <PieArcPlot_1.PieArcPlot innerRadius={innerRadius} outerRadius={outerRadius} cornerRadius={cornerRadius} paddingAngle={paddingAngle} id={seriesId} data={data} skipAnimation={skipAnimation} highlighted={highlighted} faded={faded} onItemClick={onItemClick} slots={slots} slotProps={slotProps}/>
          </g>);
        })}
      {seriesOrder.map(function (seriesId) {
            var _a = series[seriesId], innerRadiusParam = _a.innerRadius, outerRadiusParam = _a.outerRadius, arcLabelRadiusParam = _a.arcLabelRadius, cornerRadius = _a.cornerRadius, paddingAngle = _a.paddingAngle, arcLabel = _a.arcLabel, arcLabelMinAngle = _a.arcLabelMinAngle, data = _a.data, cxParam = _a.cx, cyParam = _a.cy;
            var _b = (0, getPieCoordinates_1.getPieCoordinates)({ cx: cxParam, cy: cyParam }, { width: width, height: height }), cx = _b.cx, cy = _b.cy, availableRadius = _b.availableRadius;
            var outerRadius = (0, getPercentageValue_1.getPercentageValue)(outerRadiusParam !== null && outerRadiusParam !== void 0 ? outerRadiusParam : availableRadius, availableRadius);
            var innerRadius = (0, getPercentageValue_1.getPercentageValue)(innerRadiusParam !== null && innerRadiusParam !== void 0 ? innerRadiusParam : 0, availableRadius);
            var arcLabelRadius = arcLabelRadiusParam === undefined
                ? (outerRadius + innerRadius) / 2
                : (0, getPercentageValue_1.getPercentageValue)(arcLabelRadiusParam, availableRadius);
            return (<g key={seriesId} className={classes.seriesLabels} transform={"translate(".concat(left + cx, ", ").concat(top + cy, ")")} data-series={seriesId}>
            <PieArcLabelPlot_1.PieArcLabelPlot innerRadius={innerRadius} outerRadius={outerRadius !== null && outerRadius !== void 0 ? outerRadius : availableRadius} arcLabelRadius={arcLabelRadius} cornerRadius={cornerRadius} paddingAngle={paddingAngle} id={seriesId} data={data} skipAnimation={skipAnimation} arcLabel={arcLabel} arcLabelMinAngle={arcLabelMinAngle} slots={slots} slotProps={slotProps}/>
          </g>);
        })}
    </g>);
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
