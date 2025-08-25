"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bump = void 0;
/**
 * This is a custom "bump" curve generator.
 * It draws smooth curves for the 4 provided points,
 * with the option to add a gap between sections while also properly handling the border radius.
 *
 * The implementation is based on the d3-shape bump curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/bump.js
 */
var Bump = /** @class */ (function () {
    function Bump(context, _a) {
        var isHorizontal = _a.isHorizontal, min = _a.min, max = _a.max, isIncreasing = _a.isIncreasing;
        this.isHorizontal = false;
        this.min = { x: 0, y: 0 };
        this.max = { x: 0, y: 0 };
        this.points = [];
        this.context = context;
        this.isHorizontal = isHorizontal !== null && isHorizontal !== void 0 ? isHorizontal : false;
        this.min = min !== null && min !== void 0 ? min : { x: 0, y: 0 };
        this.max = max !== null && max !== void 0 ? max : { x: 0, y: 0 };
        if (isIncreasing) {
            var currentMin = this.min;
            var currentMax = this.max;
            this.min = currentMax;
            this.max = currentMin;
        }
    }
    Bump.prototype.areaStart = function () { };
    Bump.prototype.areaEnd = function () { };
    Bump.prototype.lineStart = function () { };
    Bump.prototype.lineEnd = function () { };
    Bump.prototype.processPoints = function (points) {
        return points;
    };
    Bump.prototype.point = function (x, y) {
        this.points.push({ x: x, y: y });
        if (this.points.length < 4) {
            return;
        }
        // Draw the path using bezier curves
        this.drawPath();
    };
    Bump.prototype.drawPath = function () {
        if (this.isHorizontal) {
            this.drawHorizontalPath();
        }
        else {
            this.drawVerticalPath();
        }
    };
    Bump.prototype.drawHorizontalPath = function () {
        var _a = this.points, p0 = _a[0], p1 = _a[1], p2 = _a[2], p3 = _a[3];
        // 0 is the top-left corner
        this.context.moveTo(p0.x, p0.y);
        this.context.lineTo(p0.x, p0.y);
        // Bezier curve to point 1
        this.context.bezierCurveTo((p0.x + p1.x) / 2, p0.y, (p0.x + p1.x) / 2, p1.y, p1.x, p1.y);
        // Line to point 2
        this.context.lineTo(p2.x, p2.y);
        // Bezier curve back to point 3
        this.context.bezierCurveTo((p2.x + p3.x) / 2, p2.y, (p2.x + p3.x) / 2, p3.y, p3.x, p3.y);
        this.context.closePath();
    };
    Bump.prototype.drawVerticalPath = function () {
        var _a = this.points, p0 = _a[0], p1 = _a[1], p2 = _a[2], p3 = _a[3];
        // 0 is the top-right corner
        this.context.moveTo(p0.x, p0.y);
        this.context.lineTo(p0.x, p0.y);
        // Bezier curve to point 1
        this.context.bezierCurveTo(p0.x, (p0.y + p1.y) / 2, p1.x, (p0.y + p1.y) / 2, p1.x, p1.y);
        // Line to point 2
        this.context.lineTo(p2.x, p2.y);
        // Bezier curve back to point 3
        this.context.bezierCurveTo(p2.x, (p2.y + p3.y) / 2, p3.x, (p2.y + p3.y) / 2, p3.x, p3.y);
        this.context.closePath();
    };
    return Bump;
}());
exports.Bump = Bump;
