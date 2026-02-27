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
exports.ChartsGroupedXAxisTicks = ChartsGroupedXAxisTicks;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var scaleGuards_1 = require("../internals/scaleGuards");
var useChartContext_1 = require("../context/ChartProvider/useChartContext");
var utilities_1 = require("./utilities");
var useTicksGrouped_1 = require("../hooks/useTicksGrouped");
var useAxisTicksProps_1 = require("./useAxisTicksProps");
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
function ChartsGroupedXAxisTicks(inProps) {
    var _a = (0, useAxisTicksProps_1.useAxisTicksProps)(inProps), xScale = _a.xScale, defaultizedProps = _a.defaultizedProps, tickNumber = _a.tickNumber, positionSign = _a.positionSign, classes = _a.classes, Tick = _a.Tick, TickLabel = _a.TickLabel, axisTickLabelProps = _a.axisTickLabelProps;
    if (!(0, scaleGuards_1.isOrdinalScale)(xScale)) {
        throw new Error('MUI X Charts: ChartsGroupedXAxis only supports the `band` and `point` scale types.');
    }
    var disableTicks = defaultizedProps.disableTicks, tickSize = defaultizedProps.tickSize, valueFormatter = defaultizedProps.valueFormatter, slotProps = defaultizedProps.slotProps, tickInterval = defaultizedProps.tickInterval, tickPlacement = defaultizedProps.tickPlacement, tickLabelPlacement = defaultizedProps.tickLabelPlacement;
    var groups = defaultizedProps.groups;
    var instance = (0, useChartContext_1.useChartContext)().instance;
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
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: xTicks.map(function (item, index) {
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
            return ((0, jsx_runtime_1.jsxs)("g", { transform: "translate(".concat(tickOffset, ", 0)"), className: classes.tickContainer, "data-group-index": groupIndex, children: [!disableTicks && !ignoreTick && showTick && ((0, jsx_runtime_1.jsx)(Tick, __assign({ y2: tickYSize, className: classes.tick }, slotProps === null || slotProps === void 0 ? void 0 : slotProps.axisTick))), tickLabel !== undefined && ((0, jsx_runtime_1.jsx)(TickLabel, __assign({ x: xTickLabel, y: labelPositionY }, axisTickLabelProps, { style: __assign(__assign({}, axisTickLabelProps.style), groupConfig.tickLabelStyle), text: tickLabel })))] }, index));
        }) }));
}
