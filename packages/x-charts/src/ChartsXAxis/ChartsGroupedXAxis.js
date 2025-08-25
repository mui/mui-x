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
exports.ChartsGroupedXAxis = ChartsGroupedXAxis;
var React = require("react");
var useDrawingArea_1 = require("../hooks/useDrawingArea");
var isBandScale_1 = require("../internals/isBandScale");
var useChartContext_1 = require("../context/ChartProvider/useChartContext");
var utilities_1 = require("./utilities");
var useTicksGrouped_1 = require("../hooks/useTicksGrouped");
var useAxisProps_1 = require("./useAxisProps");
var DEFAULT_GROUPING_CONFIG = {
    tickSize: 6,
};
var getGroupingConfig = function (groups, groupIndex, tickSize) {
    var _a, _b;
    var config = (_a = groups[groupIndex]) !== null && _a !== void 0 ? _a : {};
    var defaultTickSize = tickSize !== null && tickSize !== void 0 ? tickSize : DEFAULT_GROUPING_CONFIG.tickSize;
    var calculatedTickSize = defaultTickSize * groupIndex * 2 + defaultTickSize;
    return __assign(__assign(__assign({}, DEFAULT_GROUPING_CONFIG), config), { tickSize: (_b = config.tickSize) !== null && _b !== void 0 ? _b : calculatedTickSize });
};
/**
 * @ignore - internal component.
 */
function ChartsGroupedXAxis(inProps) {
    var _a = (0, useAxisProps_1.useAxisProps)(inProps), xScale = _a.xScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, skipAxisRendering = _a.skipAxisRendering, classes = _a.classes, Line = _a.Line, Tick = _a.Tick, TickLabel = _a.TickLabel, Label = _a.Label, axisTickLabelProps = _a.axisTickLabelProps, axisLabelProps = _a.axisLabelProps;
    if (!(0, isBandScale_1.isBandScale)(xScale)) {
        throw new Error('MUI X Charts: ChartsGroupedXAxis only supports the `band` and `point` scale types.');
    }
    var position = defaultizedProps.position, disableLine = defaultizedProps.disableLine, disableTicks = defaultizedProps.disableTicks, label = defaultizedProps.label, tickSize = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickInterval = defaultizedProps.tickInterval, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, sx = defaultizedProps.sx, offset = defaultizedProps.offset, axisHeight = defaultizedProps.height;
    var groups = defaultizedProps.groups;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var left = drawingArea.left, top = drawingArea.top, width = drawingArea.width, height = drawingArea.height;
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var labelRefPoint = {
        x: left + width / 2,
        y: positionSign * axisHeight,
    };
    var xTicks = (0, useTicksGrouped_1.useTicksGrouped)({
        scale: xScale,
        tickNumber: tickNumber,
        valueFormatter: valueFormatter,
        tickInterval: tickInterval,
        tickPlacement: tickPlacement,
        tickLabelPlacement: tickLabelPlacement,
        direction: 'x',
        groups: groups,
    });
    // Skip axis rendering if no data is available
    // - The domain is an empty array for band/point scales.
    // - The domains contains Infinity for continuous scales.
    // - The position is set to 'none'.
    if (skipAxisRendering) {
        return null;
    }
    return (<utilities_1.XAxisRoot transform={"translate(0, ".concat(position === 'bottom' ? top + height + offset : top - offset, ")")} className={classes.root} sx={sx}>
      {!disableLine && (<Line x1={left} x2={left + width} className={classes.line} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisLine}/>)}

      {xTicks.map(function (item, index) {
            var _a, _b;
            var tickOffset = item.offset, labelOffset = item.labelOffset;
            var xTickLabel = labelOffset !== null && labelOffset !== void 0 ? labelOffset : 0;
            var showTick = instance.isXInside(tickOffset);
            var tickLabel = item.formattedValue;
            var ignoreTick = (_a = item.ignoreTick) !== null && _a !== void 0 ? _a : false;
            var groupIndex = (_b = item.groupIndex) !== null && _b !== void 0 ? _b : 0;
            var groupConfig = getGroupingConfig(groups, groupIndex, tickSize);
            var tickYSize = positionSign * groupConfig.tickSize;
            var labelPositionY = positionSign * (groupConfig.tickSize + utilities_1.TICK_LABEL_GAP);
            return (<g key={index} transform={"translate(".concat(tickOffset, ", 0)")} className={classes.tickContainer} data-group-index={groupIndex}>
            {!disableTicks && !ignoreTick && showTick && (<Tick y2={tickYSize} className={classes.tick} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick}/>)}

            {tickLabel !== undefined && (<TickLabel x={xTickLabel} y={labelPositionY} {...axisTickLabelProps} style={__assign(__assign({}, axisTickLabelProps.style), groupConfig.tickLabelStyle)} text={tickLabel}/>)}
          </g>);
        })}

      {label && (<g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label}/>
        </g>)}
    </utilities_1.XAxisRoot>);
}
