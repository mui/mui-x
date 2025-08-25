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
exports.ChartsGroupedYAxis = ChartsGroupedYAxis;
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
function ChartsGroupedYAxis(inProps) {
    var _a = (0, useAxisProps_1.useAxisProps)(inProps), yScale = _a.yScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, skipAxisRendering = _a.skipAxisRendering, classes = _a.classes, Line = _a.Line, Tick = _a.Tick, TickLabel = _a.TickLabel, Label = _a.Label, axisTickLabelProps = _a.axisTickLabelProps, axisLabelProps = _a.axisLabelProps, lineProps = _a.lineProps;
    if (!(0, isBandScale_1.isBandScale)(yScale)) {
        throw new Error('MUI X Charts: ChartsGroupedYAxis only supports the `band` and `point` scale types.');
    }
    var position = defaultizedProps.position, disableLine = defaultizedProps.disableLine, disableTicks = defaultizedProps.disableTicks, label = defaultizedProps.label, tickSize = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickInterval = defaultizedProps.tickInterval, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement, sx = defaultizedProps.sx, offset = defaultizedProps.offset, axisWidth = defaultizedProps.width;
    var groups = defaultizedProps.groups;
    var drawingArea = (0, useDrawingArea_1.useDrawingArea)();
    var left = drawingArea.left, top = drawingArea.top, width = drawingArea.width, height = drawingArea.height;
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var labelRefPoint = {
        x: positionSign * axisWidth,
        y: top + height / 2,
    };
    var yTicks = (0, useTicksGrouped_1.useTicksGrouped)({
        scale: yScale,
        tickNumber: tickNumber,
        valueFormatter: valueFormatter,
        tickInterval: tickInterval,
        tickPlacement: tickPlacement,
        tickLabelPlacement: tickLabelPlacement,
        direction: 'y',
        groups: groups,
    });
    // Skip axis rendering if no data is available
    // - The domain is an empty array for band/point scales.
    // - The domains contains Infinity for continuous scales.
    // - The position is set to 'none'.
    if (skipAxisRendering) {
        return null;
    }
    return (<utilities_1.YAxisRoot transform={"translate(".concat(position === 'right' ? left + width + offset : left - offset, ", 0)")} className={classes.root} sx={sx}>
      {!disableLine && <Line y1={top} y2={top + height} className={classes.line} {...lineProps}/>}

      {yTicks.map(function (item, index) {
            var _a, _b;
            var tickOffset = item.offset, labelOffset = item.labelOffset;
            var yTickLabel = labelOffset !== null && labelOffset !== void 0 ? labelOffset : 0;
            var showTick = instance.isYInside(tickOffset);
            var tickLabel = item.formattedValue;
            var ignoreTick = (_a = item.ignoreTick) !== null && _a !== void 0 ? _a : false;
            var groupIndex = (_b = item.groupIndex) !== null && _b !== void 0 ? _b : 0;
            var groupConfig = getGroupingConfig(groups, groupIndex, tickSize);
            var tickXSize = positionSign * groupConfig.tickSize;
            var labelPositionX = positionSign * (groupConfig.tickSize + utilities_1.TICK_LABEL_GAP);
            return (<g key={index} transform={"translate(0, ".concat(tickOffset, ")")} className={classes.tickContainer} data-group-index={groupIndex}>
            {!disableTicks && !ignoreTick && showTick && (<Tick x2={tickXSize} className={classes.tick} {...slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick}/>)}

            {tickLabel !== undefined && (<TickLabel x={labelPositionX} y={yTickLabel} {...axisTickLabelProps} style={__assign(__assign({}, axisTickLabelProps.style), groupConfig.tickLabelStyle)} text={tickLabel}/>)}
          </g>);
        })}

      {label && (<g className={classes.label}>
          <Label {...labelRefPoint} {...axisLabelProps} text={label}/>
        </g>)}
    </utilities_1.YAxisRoot>);
}
