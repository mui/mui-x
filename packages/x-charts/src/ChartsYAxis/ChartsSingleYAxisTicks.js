"use strict";
'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsSingleYAxisTicks = ChartsSingleYAxisTicks;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var RtlProvider_1 = require("@mui/system/RtlProvider");
var useIsHydrated_1 = require("../hooks/useIsHydrated");
var useTicks_1 = require("../hooks/useTicks");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var ChartProvider_1 = require("../context/ChartProvider");
var shortenLabels_1 = require("./shortenLabels");
var utilities_1 = require("./utilities");
var useAxisTicksProps_1 = require("./useAxisTicksProps");
/**
 * @ignore - internal component.
 */
function ChartsSingleYAxisTicks(inProps) {
    var axisLabelHeight = inProps.axisLabelHeight, ordinalTimeTicks = inProps.ordinalTimeTicks;
    var _a = (0, useAxisTicksProps_1.useAxisTicksProps)(inProps), yScale = _a.yScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, classes = _a.classes, Tick = _a.Tick, TickLabel = _a.TickLabel, axisTickLabelProps = _a.axisTickLabelProps;
    var isRtl = (0, RtlProvider_1.useRtl)();
    var disableTicks = defaultizedProps.disableTicks, tickSizeProp = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, tickInterval = defaultizedProps.tickInterval, tickLabelInterval = defaultizedProps.tickLabelInterval, tickSpacing = defaultizedProps.tickSpacing, axisWidth = defaultizedProps.width;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
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
        tickSpacing: tickSpacing,
        direction: 'y',
        ordinalTimeTicks: ordinalTimeTicks,
    });
    /* If there's an axis title, the tick labels have less space to render  */
    var tickLabelsMaxWidth = Math.max(0, axisWidth -
        (axisLabelHeight > 0 ? axisLabelHeight + utilities_1.AXIS_LABEL_TICK_LABEL_GAP : 0) -
        tickSize -
        utilities_1.TICK_LABEL_GAP);
    var tickLabels = isHydrated
        ? (0, shortenLabels_1.shortenLabels)(yTicks, drawingArea, tickLabelsMaxWidth, isRtl, axisTickLabelProps.style)
        : new Map(Array.from(yTicks).map(function (item) { return [item, item.formattedValue]; }));
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: yTicks.map(function (item, index) {
            var tickOffset = item.offset, labelOffset = item.labelOffset, value = item.value;
            var xTickLabel = positionSign * (tickSize + utilities_1.TICK_LABEL_GAP);
            var yTickLabel = labelOffset;
            var skipLabel = typeof tickLabelInterval === 'function' && !(tickLabelInterval === null || tickLabelInterval === void 0 ? void 0 : tickLabelInterval(value, index));
            var showLabel = instance.isYInside(tickOffset);
            var tickLabel = tickLabels.get(item);
            if (!showLabel) {
                return null;
            }
            return ((0, jsx_runtime_1.jsxs)("g", { transform: "translate(0, ".concat(tickOffset, ")"), className: classes.tickContainer, children: [!disableTicks && ((0, jsx_runtime_1.jsx)(Tick, __assign({ x2: positionSign * tickSize, className: classes.tick }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick))), tickLabel !== undefined && !skipLabel && ((0, jsx_runtime_1.jsx)(TickLabel, __assign({ x: xTickLabel, y: yTickLabel, "data-testid": "ChartsYAxisTickLabel", text: tickLabel }, axisTickLabelProps)))] }, index));
        }) }));
}
