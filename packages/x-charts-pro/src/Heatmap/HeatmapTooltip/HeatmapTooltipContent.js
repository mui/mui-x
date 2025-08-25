"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeatmapTooltipContent = HeatmapTooltipContent;
var React = require("react");
var prop_types_1 = require("prop-types");
var clsx_1 = require("clsx");
var ChartsTooltip_1 = require("@mui/x-charts/ChartsTooltip");
var hooks_1 = require("@mui/x-charts/hooks");
var internals_1 = require("@mui/x-charts/internals");
var useHeatmapSeries_1 = require("../../hooks/useHeatmapSeries");
var HeatmapTooltipAxesValue_1 = require("./HeatmapTooltipAxesValue");
var HeatmapTooltip_classes_1 = require("./HeatmapTooltip.classes");
function HeatmapTooltipContent(props) {
    var _a, _b, _c, _d;
    var classes = (0, HeatmapTooltip_classes_1.useUtilityClasses)(props);
    var xAxis = (0, hooks_1.useXAxis)();
    var yAxis = (0, hooks_1.useYAxis)();
    var heatmapSeries = (0, useHeatmapSeries_1.useHeatmapSeriesContext)();
    var tooltipData = (0, ChartsTooltip_1.useItemTooltip)();
    if (!tooltipData || !heatmapSeries || heatmapSeries.seriesOrder.length === 0) {
        return null;
    }
    var series = heatmapSeries.series, seriesOrder = heatmapSeries.seriesOrder;
    var seriesId = seriesOrder[0];
    var color = tooltipData.color, value = tooltipData.value, identifier = tooltipData.identifier, markType = tooltipData.markType;
    var xIndex = value[0], yIndex = value[1];
    var formattedX = (_b = (_a = xAxis.valueFormatter) === null || _a === void 0 ? void 0 : _a.call(xAxis, xAxis.data[xIndex], {
        location: 'tooltip',
        scale: xAxis.scale,
    })) !== null && _b !== void 0 ? _b : xAxis.data[xIndex].toLocaleString();
    var formattedY = (_d = (_c = yAxis.valueFormatter) === null || _c === void 0 ? void 0 : _c.call(yAxis, yAxis.data[yIndex], { location: 'tooltip', scale: yAxis.scale })) !== null && _d !== void 0 ? _d : yAxis.data[yIndex].toLocaleString();
    var formattedValue = series[seriesId].valueFormatter(value, {
        dataIndex: identifier.dataIndex,
    });
    var seriesLabel = (0, internals_1.getLabel)(series[seriesId].label, 'tooltip');
    return (<ChartsTooltip_1.ChartsTooltipPaper className={classes.paper}>
      <ChartsTooltip_1.ChartsTooltipTable className={classes.table}>
        <HeatmapTooltipAxesValue_1.HeatmapTooltipAxesValue>
          <span>{formattedX}</span>
          <span>{formattedY}</span>
        </HeatmapTooltipAxesValue_1.HeatmapTooltipAxesValue>
        <tbody>
          <ChartsTooltip_1.ChartsTooltipRow className={classes.row}>
            <ChartsTooltip_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.labelCell, classes.cell)} component="th">
              <div className={classes.markContainer}>
                <internals_1.ChartsLabelMark type={markType} color={color} className={classes.mark}/>
              </div>
              {seriesLabel}
            </ChartsTooltip_1.ChartsTooltipCell>
            <ChartsTooltip_1.ChartsTooltipCell className={(0, clsx_1.default)(classes.valueCell, classes.cell)} component="td">
              {formattedValue}
            </ChartsTooltip_1.ChartsTooltipCell>
          </ChartsTooltip_1.ChartsTooltipRow>
        </tbody>
      </ChartsTooltip_1.ChartsTooltipTable>
    </ChartsTooltip_1.ChartsTooltipPaper>);
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
