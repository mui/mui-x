"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVisibleLabels = getVisibleLabels;
var geometry_1 = require("../internals/geometry");
var getWordsByLines_1 = require("../internals/getWordsByLines");
/* Returns a set of indices of the tick labels that should be visible.  */
function getVisibleLabels(xTicks, _a) {
    var style = _a.tickLabelStyle, tickLabelInterval = _a.tickLabelInterval, tickLabelMinGap = _a.tickLabelMinGap, reverse = _a.reverse, isMounted = _a.isMounted, isXInside = _a.isXInside;
    var getTickLabelSize = function (tick) {
        if (!isMounted || tick.formattedValue === undefined) {
            return { width: 0, height: 0 };
        }
        var tickSizes = (0, getWordsByLines_1.getWordsByLines)({ style: style, needsComputation: true, text: tick.formattedValue });
        return {
            width: Math.max.apply(Math, tickSizes.map(function (size) { return size.width; })),
            height: Math.max(tickSizes.length * tickSizes[0].height),
        };
    };
    if (typeof tickLabelInterval === 'function') {
        return new Set(xTicks.filter(function (item, index) { return tickLabelInterval(item.value, index); }));
    }
    // Filter label to avoid overlap
    var previousTextLimit = 0;
    var direction = reverse ? -1 : 1;
    return new Set(xTicks.filter(function (item, labelIndex) {
        var offset = item.offset, labelOffset = item.labelOffset;
        var textPosition = offset + labelOffset;
        if (labelIndex > 0 &&
            direction * textPosition < direction * (previousTextLimit + tickLabelMinGap)) {
            return false;
        }
        if (!isXInside(textPosition)) {
            return false;
        }
        /* Measuring text width is expensive, so we need to delay it as much as possible to improve performance. */
        var _a = getTickLabelSize(item), width = _a.width, height = _a.height;
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
