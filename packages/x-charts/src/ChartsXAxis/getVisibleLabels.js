"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisibleLabels = getVisibleLabels;
var geometry_1 = require("../internals/geometry");
var domUtils_1 = require("../internals/domUtils");
/* Returns a set of indices of the tick labels that should be visible.  */
function getVisibleLabels(xTicks, _a) {
    var style = _a.tickLabelStyle, tickLabelInterval = _a.tickLabelInterval, tickLabelMinGap = _a.tickLabelMinGap, reverse = _a.reverse, isMounted = _a.isMounted, isXInside = _a.isXInside;
    if (typeof tickLabelInterval === 'function') {
        return new Set(xTicks.filter(function (item, index) { return tickLabelInterval(item.value, index); }));
    }
    // Filter label to avoid overlap
    var previousTextLimit = 0;
    var direction = reverse ? -1 : 1;
    var candidateTickLabels = xTicks.filter(function (item) {
        var offset = item.offset, labelOffset = item.labelOffset, formattedValue = item.formattedValue;
        if (formattedValue === '') {
            return false;
        }
        var textPosition = offset + labelOffset;
        return isXInside(textPosition);
    });
    var sizeMap = measureTickLabels(candidateTickLabels, style);
    return new Set(candidateTickLabels.filter(function (item, labelIndex) {
        var offset = item.offset, labelOffset = item.labelOffset;
        var textPosition = offset + labelOffset;
        if (labelIndex > 0 &&
            direction * textPosition < direction * (previousTextLimit + tickLabelMinGap)) {
            return false;
        }
        var _a = isMounted
            ? getTickLabelSize(sizeMap, item)
            : { width: 0, height: 0 }, width = _a.width, height = _a.height;
        var distance = (0, geometry_1.getMinXTranslation)(width, height, style === null || style === void 0 ? void 0 : style.angle);
        var currentTextLimit = textPosition - (direction * distance) / 2;
        if (labelIndex > 0 &&
            direction * currentTextLimit < direction * (previousTextLimit + tickLabelMinGap)) {
            // Except for the first label, we skip all label that overlap with the last accepted.
            // Notice that the early return prevents `previousTextLimit` from being updated.
            return false;
        }
        previousTextLimit = textPosition + (direction * distance) / 2;
        return true;
    }));
}
function getTickLabelSize(sizeMap, tick) {
    if (tick.formattedValue === undefined) {
        return { width: 0, height: 0 };
    }
    var width = 0;
    var height = 0;
    for (var _i = 0, _a = tick.formattedValue.split('\n'); _i < _a.length; _i++) {
        var line = _a[_i];
        var lineSize = sizeMap.get(line);
        if (lineSize) {
            width = Math.max(width, lineSize.width);
            height += lineSize.height;
        }
    }
    return { width: width, height: height };
}
function measureTickLabels(ticks, style) {
    var strings = new Set();
    for (var _i = 0, ticks_1 = ticks; _i < ticks_1.length; _i++) {
        var tick = ticks_1[_i];
        if (tick.formattedValue) {
            tick.formattedValue.split('\n').forEach(function (line) { return strings.add(line); });
        }
    }
    return (0, domUtils_1.batchMeasureStrings)(strings, style);
}
