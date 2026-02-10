"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsGridVertical = ChartsGridVertical;
var jsx_runtime_1 = require("react/jsx-runtime");
var React = require("react");
var useTicks_1 = require("../hooks/useTicks");
var styledComponents_1 = require("./styledComponents");
var ChartProvider_1 = require("../context/ChartProvider");
/**
 * @ignore - internal component.
 */
function ChartsGridVertical(props) {
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var axis = props.axis, start = props.start, end = props.end, classes = props.classes;
    var scale = axis.scale, tickNumber = axis.tickNumber, tickInterval = axis.tickInterval, tickSpacing = axis.tickSpacing;
    var xTicks = (0, useTicks_1.useTicks)({
        scale: scale,
        tickNumber: tickNumber,
        tickInterval: tickInterval,
        tickSpacing: tickSpacing,
        direction: 'x',
        ordinalTimeTicks: 'ordinalTimeTicks' in axis ? axis.ordinalTimeTicks : undefined,
    });
    return ((0, jsx_runtime_1.jsx)(React.Fragment, { children: xTicks.map(function (_a) {
            var _b, _c;
            var value = _a.value, offset = _a.offset;
            return !instance.isXInside(offset) ? null : ((0, jsx_runtime_1.jsx)(styledComponents_1.GridLine, { y1: start, y2: end, x1: offset, x2: offset, className: classes.verticalLine }, "vertical-".concat((_c = (_b = value === null || value === void 0 ? void 0 : value.getTime) === null || _b === void 0 ? void 0 : _b.call(value)) !== null && _c !== void 0 ? _c : value)));
        }) }));
}
