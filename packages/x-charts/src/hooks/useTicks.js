"use strict";
'use client';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTicks = getTicks;
exports.useTicks = useTicks;
var React = require("react");
var ChartProvider_1 = require("../context/ChartProvider");
var isBandScale_1 = require("../internals/isBandScale");
var isInfinity_1 = require("../internals/isInfinity");
var offsetRatio = {
    start: 0,
    extremities: 0,
    end: 1,
    middle: 0.5,
};
function getTicks(options) {
    var _a, _b, _c;
    var scale = options.scale, tickNumber = options.tickNumber, valueFormatter = options.valueFormatter, tickInterval = options.tickInterval, _d = options.tickPlacement, tickPlacement = _d === void 0 ? 'extremities' : _d, tickLabelPlacementProp = options.tickLabelPlacement, isInside = options.isInside;
    // band scale
    if ((0, isBandScale_1.isBandScale)(scale)) {
        var domain_1 = scale.domain();
        var tickLabelPlacement_1 = tickLabelPlacementProp !== null && tickLabelPlacementProp !== void 0 ? tickLabelPlacementProp : 'middle';
        if (scale.bandwidth() > 0) {
            // scale type = 'band'
            var filteredDomain_1 = (typeof tickInterval === 'function' && domain_1.filter(tickInterval)) ||
                (typeof tickInterval === 'object' && tickInterval) ||
                domain_1;
            return __spreadArray(__spreadArray([], filteredDomain_1.map(function (value) {
                var _a;
                var defaultTickLabel = "".concat(value);
                return {
                    value: value,
                    formattedValue: (_a = valueFormatter === null || valueFormatter === void 0 ? void 0 : valueFormatter(value, { location: 'tick', scale: scale, tickNumber: tickNumber, defaultTickLabel: defaultTickLabel })) !== null && _a !== void 0 ? _a : defaultTickLabel,
                    offset: scale(value) -
                        (scale.step() - scale.bandwidth()) / 2 +
                        offsetRatio[tickPlacement] * scale.step(),
                    labelOffset: tickLabelPlacement_1 === 'tick'
                        ? 0
                        : scale.step() * (offsetRatio[tickLabelPlacement_1] - offsetRatio[tickPlacement]),
                };
            }), true), (tickPlacement === 'extremities'
                ? [
                    {
                        formattedValue: undefined,
                        offset: scale.range()[1],
                        labelOffset: 0,
                    },
                ]
                : []), true);
        }
        // scale type = 'point'
        var filteredDomain = (typeof tickInterval === 'function' && domain_1.filter(tickInterval)) ||
            (typeof tickInterval === 'object' && tickInterval) ||
            domain_1;
        return filteredDomain.map(function (value) {
            var _a;
            var defaultTickLabel = "".concat(value);
            return {
                value: value,
                formattedValue: (_a = valueFormatter === null || valueFormatter === void 0 ? void 0 : valueFormatter(value, {
                    location: 'tick',
                    scale: scale,
                    tickNumber: tickNumber,
                    defaultTickLabel: defaultTickLabel,
                })) !== null && _a !== void 0 ? _a : defaultTickLabel,
                offset: scale(value),
                labelOffset: 0,
            };
        });
    }
    var domain = scale.domain();
    // Skip axis rendering if no data is available
    // - The domains contains Infinity for continuous scales.
    if (domain.some(isInfinity_1.isInfinity)) {
        return [];
    }
    var tickLabelPlacement = tickLabelPlacementProp;
    var ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);
    // Ticks inside the drawing area
    var visibleTicks = [];
    for (var i = 0; i < ticks.length; i += 1) {
        var value = ticks[i];
        var offset = scale(value);
        if (isInside(offset)) {
            /* If d3 returns an empty string, it means that a tick should be shown, but its label shouldn't.
             * This is especially useful in a log scale where we want to show ticks to demonstrate it's a log
             * scale, but don't want to show labels because they would overlap.
             * https://github.com/mui/mui-x/issues/18239 */
            var defaultTickLabel = scale.tickFormat(tickNumber)(value);
            visibleTicks.push({
                value: value,
                formattedValue: (_a = valueFormatter === null || valueFormatter === void 0 ? void 0 : valueFormatter(value, { location: 'tick', scale: scale, tickNumber: tickNumber, defaultTickLabel: defaultTickLabel })) !== null && _a !== void 0 ? _a : defaultTickLabel,
                offset: offset,
                // Allowing the label to be placed in the middle of a continuous scale is weird.
                // But it is useful in some cases, like funnel categories with a linear scale.
                labelOffset: tickLabelPlacement === 'middle'
                    ? scale((_b = ticks[i - 1]) !== null && _b !== void 0 ? _b : 0) - (offset + scale((_c = ticks[i - 1]) !== null && _c !== void 0 ? _c : 0)) / 2
                    : 0,
            });
        }
    }
    return visibleTicks;
}
function useTicks(options) {
    var scale = options.scale, tickNumber = options.tickNumber, valueFormatter = options.valueFormatter, tickInterval = options.tickInterval, _a = options.tickPlacement, tickPlacement = _a === void 0 ? 'extremities' : _a, tickLabelPlacement = options.tickLabelPlacement, direction = options.direction;
    var instance = (0, ChartProvider_1.useChartContext)().instance;
    var isInside = direction === 'x' ? instance.isXInside : instance.isYInside;
    return React.useMemo(function () {
        return getTicks({
            scale: scale,
            tickNumber: tickNumber,
            tickPlacement: tickPlacement,
            tickInterval: tickInterval,
            tickLabelPlacement: tickLabelPlacement,
            valueFormatter: valueFormatter,
            isInside: isInside,
        });
    }, [scale, tickNumber, tickPlacement, tickInterval, tickLabelPlacement, valueFormatter, isInside]);
}
