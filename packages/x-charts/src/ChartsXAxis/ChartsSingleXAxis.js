"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsSingleXAxis = ChartsSingleXAxis;
var React = require("react");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
var domUtils_1 = require("../internals/domUtils");
var useTicks_1 = require("../hooks/useTicks");
var useMounted_1 = require("../hooks/useMounted");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var useChartContext_1 = require("../context/ChartProvider/useChartContext");
var shortenLabels_1 = require("./shortenLabels");
var getVisibleLabels_1 = require("./getVisibleLabels");
var utilities_1 = require("./utilities");
var useAxisProps_1 = require("./useAxisProps");
/**
 * @ignore - internal component.
 */
function ChartsSingleXAxis(inProps) {
    var _a = (0, useAxisProps_1.useAxisProps)(inProps), xScale = _a.xScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, skipAxisRendering = _a.skipAxisRendering, classes = _a.classes, Line = _a.Line, Tick = _a.Tick, TickLabel = _a.TickLabel, Label = _a.Label, axisTickLabelProps = _a.axisTickLabelProps, axisLabelProps = _a.axisLabelProps, reverse = _a.reverse, isRtl = _a.isRtl;
    var isMounted = (0, useMounted_1.useMounted)();
    var position = defaultizedProps.position, disableLine = defaultizedProps.disableLine, disableTicks = defaultizedProps.disableTicks, label = defaultizedProps.label, tickSizeProp = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickInterval = defaultizedProps.tickInterval, tickLabelInterval = defaultizedProps.tickLabelInterval, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, tickLabelMinGap = defaultizedProps.tickLabelMinGap, sx = defaultizedProps.sx, offset = defaultizedProps.offset, axisHeight = defaultizedProps.height;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var left = drawingArea.left, top = drawingArea.top, width = drawingArea.width, height = drawingArea.height;
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
    // Skip axis rendering if no data is available
    // - The domain is an empty array for band/point scales.
    // - The domains contains Infinity for continuous scales.
    // - The position is set to 'none'.
    if (skipAxisRendering) {
        return null;
    }
    var labelHeight = label ? (0, domUtils_1.getStringSize)(label, axisLabelProps.style).height : 0;
    var labelRefPoint = {
        x: left + width / 2,
        y: positionSign * axisHeight,
    };
    /* If there's an axis title, the tick labels have less space to render  */
    var tickLabelsMaxHeight = Math.max(0, axisHeight - (label ? labelHeight + utilities_1.AXIS_LABEL_TICK_LABEL_GAP : 0) - tickSize - utilities_1.TICK_LABEL_GAP);
    var tickLabels = isHydrated
        ? (0, shortenLabels_1.shortenLabels)(visibleLabels, drawingArea, tickLabelsMaxHeight, isRtl, axisTickLabelProps.style)
        : new Map(Array.from(visibleLabels).map(function (item) { return [item, item.formattedValue]; }));
    return (<utilities_1.XAxisRoot transform={"translate(0, ".concat(position === 'bottom' ? top + height + offset : top - offset, ")")} className={classes.root} sx={sx}>
      {!disableLine && (<Line x1={left} x2={left + width} className={classes.line} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLine}/>)}

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

      {label && (<g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label}/>
        </g>)}
    </utilities_1.XAxisRoot>);
}
