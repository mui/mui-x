"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArcRatios = getArcRatios;
exports.getAvailableRadius = getAvailableRadius;
var angleConversion_1 = require("../internals/angleConversion");
function getPoint(angle) {
    var radAngle = (0, angleConversion_1.deg2rad)(angle);
    return [Math.sin(radAngle), -Math.cos(radAngle)];
}
/**
 * Returns the ratio of the arc bounding box and its center.
 * @param startAngle The start angle (in deg)
 * @param endAngle The end angle (in deg)
 */
function getArcRatios(startAngle, endAngle) {
    // Set the start, end and center point.
    var points = [[0, 0], getPoint(startAngle), getPoint(endAngle)];
    // Add cardinal points included in the arc
    var minAngle = Math.min(startAngle, endAngle);
    var maxAngle = Math.max(startAngle, endAngle);
    var initialAngle = Math.floor(minAngle / 90) * 90;
    for (var step = 1; step <= 4; step += 1) {
        var cardinalAngle = initialAngle + step * 90;
        if (cardinalAngle < maxAngle) {
            points.push(getPoint(cardinalAngle));
        }
    }
    var minX = Math.min.apply(Math, points.map(function (_a) {
        var x = _a[0];
        return x;
    }));
    var maxX = Math.max.apply(Math, points.map(function (_a) {
        var x = _a[0];
        return x;
    }));
    var minY = Math.min.apply(Math, points.map(function (_a) {
        var y = _a[1];
        return y;
    }));
    var maxY = Math.max.apply(Math, points.map(function (_a) {
        var y = _a[1];
        return y;
    }));
    return {
        cx: -minX / (maxX - minX),
        cy: -minY / (maxY - minY),
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY,
    };
}
function getAvailableRadius(cx, cy, width, height, _a) {
    var minX = _a.minX, maxX = _a.maxX, minY = _a.minY, maxY = _a.maxY;
    return Math.min.apply(Math, [
        {
            ratio: Math.abs(minX),
            space: cx,
        },
        {
            ratio: Math.abs(maxX),
            space: width - cx,
        },
        {
            ratio: Math.abs(minY),
            space: cy,
        },
        {
            ratio: Math.abs(maxY),
            space: height - cy,
        },
    ].map(function (_a) {
        var ratio = _a.ratio, space = _a.space;
        if (ratio < 0.00001) {
            return Infinity;
        }
        return space / ratio;
    }));
}
