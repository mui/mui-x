"use strict";
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
exports.zoomAtPoint = void 0;
exports.isSpanValid = isSpanValid;
exports.getWheelScaleRatio = getWheelScaleRatio;
exports.getHorizontalCenterRatio = getHorizontalCenterRatio;
exports.getVerticalCenterRatio = getVerticalCenterRatio;
exports.translateZoom = translateZoom;
/**
 * Helper to get the range (in percents of a reference range) corresponding to a given scale.
 * @param centerRatio {number} The ratio of the point that should not move between the previous and next range.
 * @param scaleRatio {number} The target scale ratio.
 * @returns The range to display.
 */
var zoomAtPoint = function (centerRatio, scaleRatio, currentZoomData, options) {
    var MIN_RANGE = options.minStart;
    var MAX_RANGE = options.maxEnd;
    var MIN_ALLOWED_SPAN = options.minSpan;
    var minRange = currentZoomData.start;
    var maxRange = currentZoomData.end;
    var point = minRange + centerRatio * (maxRange - minRange);
    var newMinRange = (minRange + point * (scaleRatio - 1)) / scaleRatio;
    var newMaxRange = (maxRange + point * (scaleRatio - 1)) / scaleRatio;
    var minSpillover = 0;
    var maxSpillover = 0;
    if (newMinRange < MIN_RANGE) {
        minSpillover = Math.abs(newMinRange);
        newMinRange = MIN_RANGE;
    }
    if (newMaxRange > MAX_RANGE) {
        maxSpillover = Math.abs(newMaxRange - MAX_RANGE);
        newMaxRange = MAX_RANGE;
    }
    if (minSpillover > 0 && maxSpillover > 0) {
        return [MIN_RANGE, MAX_RANGE];
    }
    newMaxRange += minSpillover;
    newMinRange -= maxSpillover;
    newMinRange = Math.min(MAX_RANGE - MIN_ALLOWED_SPAN, Math.max(MIN_RANGE, newMinRange));
    newMaxRange = Math.max(MIN_ALLOWED_SPAN, Math.min(MAX_RANGE, newMaxRange));
    return [newMinRange, newMaxRange];
};
exports.zoomAtPoint = zoomAtPoint;
/**
 * Checks if the new span is valid.
 */
function isSpanValid(minRange, maxRange, isZoomIn, option) {
    var newSpanPercent = maxRange - minRange;
    if ((isZoomIn && newSpanPercent < option.minSpan) ||
        (!isZoomIn && newSpanPercent > option.maxSpan)) {
        return false;
    }
    if (minRange < option.minStart || maxRange > option.maxEnd) {
        return false;
    }
    return true;
}
function getMultiplier(event) {
    var ctrlMultiplier = event.ctrlKey ? 3 : 1;
    // DeltaMode: 0 is pixel, 1 is line, 2 is page
    // This is defined by the browser.
    if (event.deltaMode === 1) {
        return 1 * ctrlMultiplier;
    }
    if (event.deltaMode) {
        return 10 * ctrlMultiplier;
    }
    return 0.2 * ctrlMultiplier;
}
/**
 * Get the scale ratio and if it's a zoom in or out from a wheel event.
 */
function getWheelScaleRatio(event, step) {
    var deltaY = -event.deltaY;
    var multiplier = getMultiplier(event);
    var scaledStep = (step * multiplier * deltaY) / 1000;
    // Clamp the scale ratio between 0.1 and 1.9 so that the zoom is not too big or too small.
    var scaleRatio = Math.min(Math.max(1 + scaledStep, 0.1), 1.9);
    var isZoomIn = deltaY > 0;
    return { scaleRatio: scaleRatio, isZoomIn: isZoomIn };
}
/**
 * Get the ratio of the point in the horizontal center of the area.
 */
function getHorizontalCenterRatio(point, area) {
    var left = area.left, width = area.width;
    return (point.x - left) / width;
}
/**
 * Get the ratio of the point in the vertical center of the area.
 */
function getVerticalCenterRatio(point, area) {
    var top = area.top, height = area.height;
    return ((point.y - top) / height) * -1 + 1;
}
/**
 * Translate the zoom data by a given movement.
 */
function translateZoom(initialZoomData, movement, drawingArea, optionsLookup) {
    return initialZoomData.map(function (zoom) {
        var options = optionsLookup[zoom.axisId];
        if (!options || !options.panning) {
            return zoom;
        }
        var min = zoom.start;
        var max = zoom.end;
        var span = max - min;
        var MIN_PERCENT = options.minStart;
        var MAX_PERCENT = options.maxEnd;
        var displacement = options.axisDirection === 'x' ? movement.x : movement.y;
        var dimension = options.axisDirection === 'x' ? drawingArea.width : drawingArea.height;
        var newMinPercent = min - (displacement / dimension) * span;
        var newMaxPercent = max - (displacement / dimension) * span;
        if (newMinPercent < MIN_PERCENT) {
            newMinPercent = MIN_PERCENT;
            newMaxPercent = newMinPercent + span;
        }
        if (newMaxPercent > MAX_PERCENT) {
            newMaxPercent = MAX_PERCENT;
            newMinPercent = newMaxPercent - span;
        }
        if (newMinPercent < MIN_PERCENT ||
            newMaxPercent > MAX_PERCENT ||
            span < options.minSpan ||
            span > options.maxSpan) {
            return zoom;
        }
        return __assign(__assign({}, zoom), { start: newMinPercent, end: newMaxPercent });
    });
}
