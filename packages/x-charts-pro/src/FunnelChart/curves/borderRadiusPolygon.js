"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.borderRadiusPolygon = borderRadiusPolygon;
var distance = function (p1, p2) { return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2)); };
var lerp = function (a, b, x) { return a + (b - a) * x; };
var lerp2D = function (p1, p2, t) { return ({
    x: lerp(p1.x, p2.x, t),
    y: lerp(p1.y, p2.y, t),
}); };
/**
 * Draws a polygon with rounded corners
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {Array} points A list of `{x, y}` points
 * @param {number} radius how much to round the corners
 */
function borderRadiusPolygon(ctx, points, radius) {
    var _a, _b;
    var numPoints = points.length;
    radius = Array.isArray(radius) ? radius : Array(numPoints).fill(radius);
    var corners = [];
    for (var i = 0; i < numPoints; i += 1) {
        var lastPoint = points[i];
        var thisPoint = points[(i + 1) % numPoints];
        var nextPoint = points[(i + 2) % numPoints];
        var lastEdgeLength = distance(lastPoint, thisPoint);
        var lastOffsetDistance = Math.min(lastEdgeLength / 2, (_a = radius[i]) !== null && _a !== void 0 ? _a : 0);
        var start = lerp2D(thisPoint, lastPoint, lastOffsetDistance / lastEdgeLength);
        var nextEdgeLength = distance(nextPoint, thisPoint);
        var nextOffsetDistance = Math.min(nextEdgeLength / 2, (_b = radius[i]) !== null && _b !== void 0 ? _b : 0);
        var end = lerp2D(thisPoint, nextPoint, nextOffsetDistance / nextEdgeLength);
        corners.push([start, thisPoint, end]);
    }
    ctx.moveTo(corners[0][0].x, corners[0][0].y);
    for (var _i = 0, corners_1 = corners; _i < corners_1.length; _i++) {
        var _c = corners_1[_i], start = _c[0], ctrl = _c[1], end = _c[2];
        ctx.lineTo(start.x, start.y);
        ctx.quadraticCurveTo(ctrl.x, ctrl.y, end.x, end.y);
    }
    ctx.closePath();
}
