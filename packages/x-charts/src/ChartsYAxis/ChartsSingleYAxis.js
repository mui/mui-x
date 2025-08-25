"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsSingleYAxis = ChartsSingleYAxis;
var React = require("react");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
var domUtils_1 = require("../internals/domUtils");
var useTicks_1 = require("../hooks/useTicks");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var ChartProvider_1 = require("../context/ChartProvider");
var shortenLabels_1 = require("./shortenLabels");
var utilities_1 = require("./utilities");
var useAxisProps_1 = require("./useAxisProps");
/**
 * @ignore - internal component.
 */
function ChartsSingleYAxis(inProps) {
    var _a = (0, useAxisProps_1.useAxisProps)(inProps), yScale = _a.yScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, skipAxisRendering = _a.skipAxisRendering, classes = _a.classes, Line = _a.Line, Tick = _a.Tick, TickLabel = _a.TickLabel, Label = _a.Label, axisTickLabelProps = _a.axisTickLabelProps, axisLabelProps = _a.axisLabelProps, lineProps = _a.lineProps, isRtl = _a.isRtl;
    var position = defaultizedProps.position, disableLine = defaultizedProps.disableLine, disableTicks = defaultizedProps.disableTicks, label = defaultizedProps.label, tickSizeProp = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, tickInterval = defaultizedProps.tickInterval, tickLabelInterval = defaultizedProps.tickLabelInterval, sx = defaultizedProps.sx, offset = defaultizedProps.offset, axisWidth = defaultizedProps.width;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var left = drawingArea.left, top = drawingArea.top, width = drawingArea.width, height = drawingArea.height;
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var isHydrated = (0, useIsHydrated_1.useIsHydrated)();
    var tickSize = disableTicks ? 4 : tickSizeProp;
    var yTicks = (0, useTicks_1.useTicks)({
        scale: yScale,
        tickNumber: tickNumber,
        valueFormatter: valueFormatter,
        tickPlacement: tickPlacement,
        tickLabelPlacement: tickLabelPlacement,
        tickInterval: tickInterval,
        direction: 'y',
    });
    // Skip axis rendering if no data is available
    // - The domain is an empty array for band/point scales.
    // - The domains contains Infinity for continuous scales.
    // - The position is set to 'none'.
    if (skipAxisRendering) {
        return null;
    }
    var labelRefPoint = {
        x: positionSign * axisWidth,
        y: top + height / 2,
    };
    /* If there's an axis title, the tick labels have less space to render  */
    var tickLabelsMaxWidth = Math.max(0, axisWidth -
        (label ? (0, domUtils_1.getStringSize)(label, axisLabelProps.style).height + utilities_1.AXIS_LABEL_TICK_LABEL_GAP : 0) -
        tickSize -
        utilities_1.TICK_LABEL_GAP);
    var tickLabels = isHydrated
        ? (0, shortenLabels_1.shortenLabels)(yTicks, drawingArea, tickLabelsMaxWidth, isRtl, axisTickLabelProps.style)
        : new Map(Array.from(yTicks).map(function (item) { return [item, item.formattedValue]; }));
    return (<utilities_1.YAxisRoot transform={"translate(".concat(position === 'right' ? left + width + offset : left - offset, ", 0)")} className={classes.root} sx={sx}>
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps}/>}

      {yTicks.map(function (item, index) {
            var tickOffset = item.offset, labelOffset = item.labelOffset, value = item.value;
            var xTickLabel = positionSign * (tickSize + utilities_1.TICK_LABEL_GAP);
            var yTickLabel = labelOffset;
            var skipLabel = typeof tickLabelInterval === 'function' && !(tickLabelInterval === null || tickLabelInterval === void 0 ? void 0 : tickLabelInterval(value, index));
            var showLabel = instance.isYInside(tickOffset);
            var tickLabel = tickLabels.get(item);
            if (!showLabel) {
                return null;
            }
            return (<g key={index} transform={"translate(0, ".concat(tickOffset, ")")} className={classes.tickContainer}>
            {!disableTicks && (<Tick x2={positionSign * tickSize} className={classes.tick} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick}/>)}

            {tickLabel !== undefined && !skipLabel && (<TickLabel x={xTickLabel} y={yTickLabel} data-testid="ChartsYAxisTickLabel" text={tickLabel} {...axisTickLabelProps}/>)}
          </g>);
        })}
      {label && isHydrated && (<g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label}/>
        </g>)}
    </utilities_1.YAxisRoot>);
}
