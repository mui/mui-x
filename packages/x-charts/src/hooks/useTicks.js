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
exports.applyTickSpacing = applyTickSpacing;
exports.getTicks = getTicks;
exports.useTicks = useTicks;
var React = require("react");
var scaleGuards_1 = require("../internals/scaleGuards");
var isInfinity_1 = require("../internals/isInfinity");
var timeTicks_1 = require("../utils/timeTicks");
var dateHelpers_1 = require("../internals/dateHelpers");
var useChartContext_1 = require("../context/ChartProvider/useChartContext");
var offsetRatio = {
    start: 0,
    extremities: 0,
    end: 1,
    middle: 0.5,
};
function getTickPosition(scale, value, placement) {
    return (scale(value) - (scale.step() - scale.bandwidth()) / 2 + offsetRatio[placement] * scale.step());
}
/**
 * Returns a new domain where each tick is at least {@link tickSpacing}px from the next one.
 * Assumes tick spacing is greater than 0.
 * @param domain Domain of the scale.
 * @param range Range of the scale.
 * @param tickSpacing Spacing in pixels.
 */
function applyTickSpacing(domain, range, tickSpacing) {
    var rangeSpan = Math.abs(range[1] - range[0]);
    var every = Math.ceil(domain.length / (rangeSpan / tickSpacing));
    if (Number.isNaN(every) || every <= 1) {
        return domain;
    }
    return domain.filter(function (_, index) { return index % every === 0; });
}
function getTimeTicks(domain, tickNumber, ticksFrequencies, scale, isInside) {
    if (ticksFrequencies.length === 0) {
        return [];
    }
    var isReversed = scale.range()[0] > scale.range()[1];
    // Indexes are inclusive regarding the entire band.
    var startIndex = domain.findIndex(function (value) {
        return isInside(getTickPosition(scale, value, isReversed ? 'start' : 'end'));
    });
    var endIndex = domain.findLastIndex(function (value) {
        return isInside(getTickPosition(scale, value, isReversed ? 'end' : 'start'));
    });
    var start = domain[0];
    var end = domain[domain.length - 1];
    if (!(start instanceof Date) || !(end instanceof Date)) {
        return [];
    }
    var startFrequencyIndex = 0;
    for (var i = 0; i < ticksFrequencies.length; i += 1) {
        if (ticksFrequencies[i].getTickNumber(start, end) !== 0) {
            startFrequencyIndex = i;
            break;
        }
    }
    var endFrequencyIndex = startFrequencyIndex;
    for (var i = startFrequencyIndex; i < ticksFrequencies.length; i += 1) {
        if (i === ticksFrequencies.length - 1) {
            // If we reached the end, use the last tick frequency
            endFrequencyIndex = i;
            break;
        }
        var prevTickCount = ticksFrequencies[i].getTickNumber(start, end);
        var nextTickCount = ticksFrequencies[i + 1].getTickNumber(start, end);
        // Smooth ratio between ticks steps: ticksNumber[i]*ticksNumber[i+1] <= targetTickNumber^2
        if (nextTickCount > tickNumber || tickNumber / prevTickCount < nextTickCount / tickNumber) {
            endFrequencyIndex = i;
            break;
        }
    }
    var ticks = [];
    for (var tickIndex = Math.max(1, startIndex); tickIndex <= endIndex; tickIndex += 1) {
        for (var i = startFrequencyIndex; i <= endFrequencyIndex; i += 1) {
            var prevDate = domain[tickIndex - 1];
            var currentDate = domain[tickIndex];
            if (prevDate instanceof Date &&
                currentDate instanceof Date &&
                ticksFrequencies[i].isTick(prevDate, currentDate)) {
                ticks.push({ index: tickIndex, formatter: ticksFrequencies[i].format });
                // once we found a matching tick space, we can break the inner loop
                break;
            }
        }
    }
    return ticks;
}
function getTicks(options) {
    var _a, _b, _c;
    var scale = options.scale, tickNumber = options.tickNumber, valueFormatter = options.valueFormatter, tickInterval = options.tickInterval, tickPlacementProp = options.tickPlacement, tickLabelPlacementProp = options.tickLabelPlacement, tickSpacing = options.tickSpacing, isInside = options.isInside, ordinalTimeTicks = options.ordinalTimeTicks;
    if (ordinalTimeTicks !== undefined && (0, dateHelpers_1.isDateData)(scale.domain()) && (0, scaleGuards_1.isOrdinalScale)(scale)) {
        // ordinal scale with spaced ticks.
        var domain_1 = scale.domain();
        if (domain_1.length === 0 || domain_1.length === 1) {
            return [];
        }
        var tickPlacement_1 = 'middle';
        var ticksIndexes = getTimeTicks(domain_1, tickNumber, ordinalTimeTicks.map(function (tickDef) {
            return typeof tickDef === 'string' ? timeTicks_1.tickFrequencies[tickDef] : tickDef;
        }), scale, isInside);
        return ticksIndexes.map(function (_a) {
            var index = _a.index, formatter = _a.formatter;
            var value = domain_1[index];
            var formattedValue = formatter(value);
            return {
                value: value,
                formattedValue: formattedValue,
                offset: getTickPosition(scale, value, tickPlacement_1),
                labelOffset: 0,
            };
        });
    }
    var tickPlacement = tickPlacementProp !== null && tickPlacementProp !== void 0 ? tickPlacementProp : 'extremities';
    // Standard ordinal scale: 1 item =1 tick
    if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
        var domain_2 = scale.domain();
        var tickLabelPlacement_1 = tickLabelPlacementProp !== null && tickLabelPlacementProp !== void 0 ? tickLabelPlacementProp : 'middle';
        var filteredDomain = domain_2;
        if (typeof tickInterval === 'object' && tickInterval != null) {
            filteredDomain = tickInterval;
        }
        else {
            if (typeof tickInterval === 'function') {
                filteredDomain = filteredDomain.filter(tickInterval);
            }
            if (tickSpacing !== undefined && tickSpacing > 0) {
                filteredDomain = applyTickSpacing(filteredDomain, scale.range(), tickSpacing);
            }
        }
        if (filteredDomain.length === 0) {
            return [];
        }
        if (scale.bandwidth() > 0) {
            // scale type = 'band'
            var isReversed_1 = scale.range()[0] > scale.range()[1];
            // Indexes are inclusive regarding the entire band.
            var startIndex = filteredDomain.findIndex(function (value) {
                return isInside(getTickPosition(scale, value, isReversed_1 ? 'start' : 'end'));
            });
            var endIndex = filteredDomain.findLastIndex(function (value) {
                return isInside(getTickPosition(scale, value, isReversed_1 ? 'end' : 'start'));
            });
            return __spreadArray(__spreadArray([], filteredDomain.slice(startIndex, endIndex + 1).map(function (value) {
                var _a;
                var defaultTickLabel = "".concat(value);
                return {
                    value: value,
                    formattedValue: (_a = valueFormatter === null || valueFormatter === void 0 ? void 0 : valueFormatter(value, { location: 'tick', scale: scale, tickNumber: tickNumber, defaultTickLabel: defaultTickLabel })) !== null && _a !== void 0 ? _a : defaultTickLabel,
                    offset: getTickPosition(scale, value, tickPlacement),
                    labelOffset: tickLabelPlacement_1 === 'tick'
                        ? 0
                        : scale.step() * (offsetRatio[tickLabelPlacement_1] - offsetRatio[tickPlacement]),
                };
            }), true), (tickPlacement === 'extremities' &&
                endIndex === domain_2.length - 1 &&
                isInside(scale.range()[1])
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
    var ticks = typeof tickInterval === 'object' ? tickInterval : getDefaultTicks(scale, tickNumber);
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
function getDefaultTicks(scale, tickNumber) {
    var domain = scale.domain();
    if (domain[0] === domain[1]) {
        return [domain[0]];
    }
    return scale.ticks(tickNumber);
}
function useTicks(options) {
    var scale = options.scale, tickNumber = options.tickNumber, valueFormatter = options.valueFormatter, tickInterval = options.tickInterval, _a = options.tickPlacement, tickPlacement = _a === void 0 ? 'extremities' : _a, tickLabelPlacement = options.tickLabelPlacement, tickSpacing = options.tickSpacing, direction = options.direction, ordinalTimeTicks = options.ordinalTimeTicks;
    var instance = (0, useChartContext_1.useChartContext)().instance;
    var isInside = direction === 'x' ? instance.isXInside : instance.isYInside;
    return React.useMemo(function () {
        return getTicks({
            scale: scale,
            tickNumber: tickNumber,
            tickPlacement: tickPlacement,
            tickInterval: tickInterval,
            tickLabelPlacement: tickLabelPlacement,
            tickSpacing: tickSpacing,
            valueFormatter: valueFormatter,
            isInside: isInside,
            ordinalTimeTicks: ordinalTimeTicks,
        });
    }, [
        scale,
        tickNumber,
        tickPlacement,
        tickInterval,
        tickLabelPlacement,
        tickSpacing,
        valueFormatter,
        isInside,
        ordinalTimeTicks,
    ]);
}
