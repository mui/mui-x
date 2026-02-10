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
exports.useTicksGrouped = useTicksGrouped;
var React = require("react");
var scaleGuards_1 = require("../internals/scaleGuards");
var offsetRatio = {
    start: 0,
    extremities: 0,
    end: 1,
    middle: 0.5,
    tick: 0,
};
function useTicksGrouped(options) {
    var scale = options.scale, tickInterval = options.tickInterval, _a = options.tickLabelPlacement, tickLabelPlacement = _a === void 0 ? 'middle' : _a, _b = options.tickPlacement, tickPlacement = _b === void 0 ? 'extremities' : _b, groups = options.groups;
    return React.useMemo(function () {
        var domain = scale.domain();
        var filteredDomain = (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
            (typeof tickInterval === 'object' && tickInterval) ||
            domain;
        if (scale.bandwidth() > 0) {
            // scale type = 'band'
            var entries = mapToGrouping(filteredDomain, groups, tickPlacement, tickLabelPlacement, scale);
            if (entries[0]) {
                entries[0].ignoreTick = true;
            }
            return __spreadArray(__spreadArray([
                {
                    formattedValue: undefined,
                    offset: scale.range()[0],
                    labelOffset: 0,
                    groupIndex: groups.length - 1,
                }
            ], entries, true), [
                // Last tick
                {
                    formattedValue: undefined,
                    offset: scale.range()[1],
                    labelOffset: 0,
                    groupIndex: groups.length - 1,
                },
            ], false);
        }
        // scale type = 'point'
        return mapToGrouping(filteredDomain, groups, tickPlacement, tickLabelPlacement, scale);
    }, [scale, tickInterval, groups, tickPlacement, tickLabelPlacement]);
}
function mapToGrouping(tickValues, groups, tickPlacement, tickLabelPlacement, scale) {
    var allTickItems = [];
    // Map to keep track of offsets and their corresponding tick indexes
    // Used to remove redundant ticks when they are in the same position
    var dataIndexToTickIndex = new Map();
    var currentValueCount = 0;
    for (var groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
        for (var dataIndex = 0; dataIndex < tickValues.length; dataIndex += 1) {
            var tickValue = tickValues[dataIndex];
            var groupValue = groups[groupIndex].getValue(tickValue, dataIndex);
            var lastItem = allTickItems[allTickItems.length - 1];
            // Check if this is a new unique value for this group
            var isNew = (lastItem === null || lastItem === void 0 ? void 0 : lastItem.value) !== groupValue || (lastItem === null || lastItem === void 0 ? void 0 : lastItem.groupIndex) !== groupIndex;
            if (isNew) {
                currentValueCount = 1;
                // Calculate tick offset
                var tickOffset = (0, scaleGuards_1.isOrdinalScale)(scale)
                    ? scale(tickValue) -
                        (scale.step() - scale.bandwidth()) / 2 +
                        offsetRatio[tickPlacement] * scale.step()
                    : scale(tickValue);
                // Calculate the label offset
                var labelOffset = scale.step() *
                    currentValueCount *
                    (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);
                // Add a new item
                allTickItems.push({
                    value: groupValue,
                    formattedValue: "".concat(groupValue),
                    offset: tickOffset,
                    groupIndex: groupIndex,
                    dataIndex: dataIndex,
                    ignoreTick: false,
                    labelOffset: labelOffset,
                });
                if (!dataIndexToTickIndex.has(dataIndex)) {
                    dataIndexToTickIndex.set(dataIndex, new Set());
                }
                var tickIndexes = dataIndexToTickIndex.get(dataIndex);
                for (var _i = 0, _a = tickIndexes.values(); _i < _a.length; _i++) {
                    var previousIndex = _a[_i];
                    allTickItems[previousIndex].ignoreTick = true;
                }
                tickIndexes.add(allTickItems.length - 1);
            }
            else {
                currentValueCount += 1;
                // Calculate the label offset
                var labelOffset = scale.step() *
                    currentValueCount *
                    (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);
                lastItem.labelOffset = labelOffset;
            }
        }
    }
    return allTickItems;
}
