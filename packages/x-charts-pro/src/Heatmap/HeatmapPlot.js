"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapPlot = HeatmapPlot;
var React = require("react");
var prop_types_1 = require("prop-types");
var hooks_1 = require("@mui/x-charts/hooks");
var useHeatmapSeries_1 = require("../hooks/useHeatmapSeries");
var HeatmapItem_1 = require("./HeatmapItem");
function HeatmapPlot(props) {
    var xScale = (0, hooks_1.useXScale)();
    var yScale = (0, hooks_1.useYScale)();
    var colorScale = (0, hooks_1.useZColorScale)();
    var series = (0, useHeatmapSeries_1.useHeatmapSeriesContext)();
    var xDomain = xScale.domain();
    var yDomain = yScale.domain();
    if (!series || series.seriesOrder.length === 0) {
        return null;
    }
    var seriesToDisplay = series.series[series.seriesOrder[0]];
    return (<g>
      {seriesToDisplay.data.map(function (_a, dataIndex) {
            var xIndex = _a[0], yIndex = _a[1], value = _a[2];
            var x = xScale(xDomain[xIndex]);
            var y = yScale(yDomain[yIndex]);
            var color = colorScale === null || colorScale === void 0 ? void 0 : colorScale(value);
            if (x === undefined || y === undefined || !color) {
                return null;
            }
            return (<HeatmapItem_1.HeatmapItem key={"".concat(xIndex, "_").concat(yIndex)} width={xScale.bandwidth()} height={yScale.bandwidth()} x={x} y={y} color={color} dataIndex={dataIndex} seriesId={series.seriesOrder[0]} value={value} slots={props.slots} slotProps={props.slotProps}/>);
        })}
    </g>);
}
HeatmapPlot.propTypes = {
    // ----------------------------- Warning --------------------------------
    // | These PropTypes are generated from the TypeScript type definitions |
    // | To update them edit the TypeScript types and run "pnpm proptypes"  |
    // ----------------------------------------------------------------------
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
