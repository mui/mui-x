"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsSingleXAxisTicks = ChartsSingleXAxisTicks;
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
var useTicks_1 = require("../hooks/useTicks");
var useMounted_1 = require("../hooks/useMounted");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var useChartContext_1 = require("../context/ChartProvider/useChartContext");
var shortenLabels_1 = require("./shortenLabels");
var getVisibleLabels_1 = require("./getVisibleLabels");
var utilities_1 = require("./utilities");
var useAxisTicksProps_1 = require("./useAxisTicksProps");
/**
 * @ignore - internal component.
 */
function ChartsSingleXAxisTicks(inProps) {
    var axisLabelHeight = inProps.axisLabelHeight;
    var _a = (0, useAxisTicksProps_1.useAxisTicksProps)(inProps), xScale = _a.xScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, classes = _a.classes, Tick = _a.Tick, TickLabel = _a.TickLabel, axisTickLabelProps = _a.axisTickLabelProps, reverse = _a.reverse;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var isMounted = (0, useMounted_1.useMounted)();
    var disableTicks = defaultizedProps.disableTicks, tickSizeProp = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickInterval = defaultizedProps.tickInterval, tickLabelInterval = defaultizedProps.tickLabelInterval, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, tickLabelMinGap = defaultizedProps.tickLabelMinGap, axisHeight = defaultizedProps.height;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var isHydrated = (0, useIsHydrated_1.useIsHydrated)();
    var tickSize = disableTicks ? 4 : tickSizeProp;
    var xTicks = (0, useTicks_1.useTicks)({
        scale: xScale,
        tickNumber: tickNumber,
        valueFormatter: valueFormatter,
        tickInterval: tickInterval,
        tickPlacement: tickPlacement,
        tickLabelPlacement: tickLabelPlacement,
        direction: 'x',
    });
    var visibleLabels = (0, getVisibleLabels_1.getVisibleLabels)(xTicks, {
        tickLabelStyle: axisTickLabelProps.style,
        tickLabelInterval: tickLabelInterval,
        tickLabelMinGap: tickLabelMinGap,
        reverse: reverse,
        isMounted: isMounted,
        isXInside: instance.isXInside,
    });
    /* If there's an axis title, the tick labels have less space to render  */
    var tickLabelsMaxHeight = Math.max(0, axisHeight -
        (axisLabelHeight > 0 ? axisLabelHeight + utilities_1.AXIS_LABEL_TICK_LABEL_GAP : 0) -
        tickSize -
        utilities_1.TICK_LABEL_GAP);
    var tickLabels = isHydrated
        ? (0, shortenLabels_1.shortenLabels)(visibleLabels, drawingArea, tickLabelsMaxHeight, isRtl, axisTickLabelProps.style)
        : new Map(Array.from(visibleLabels).map(function (item) { return [item, item.formattedValue]; }));
    return (<React.Fragment>
      {xTicks.map(function (item, index) {
            var tickOffset = item.offset, labelOffset = item.labelOffset;
            var xTickLabel = labelOffset !== null && labelOffset !== void 0 ? labelOffset : 0;
            var yTickLabel = positionSign * (tickSize + utilities_1.TICK_LABEL_GAP);
            var showTick = instance.isXInside(tickOffset);
            var tickLabel = tickLabels.get(item);
            var showTickLabel = visibleLabels.has(item);
            return (<g key={index} transform={"translate(".concat(tickOffset, ", 0)")} className={classes.tickContainer}>
            {!disableTicks && showTick && (<Tick y2={positionSign * tickSize} className={classes.tick} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick}/>)}

            {tickLabel !== undefined && showTickLabel && (<TickLabel x={xTickLabel} y={yTickLabel} data-testid="ChartsXAxisTickLabel" {...axisTickLabelProps} text={tickLabel}/>)}
          </g>);
        })}
    </React.Fragment>);
}
