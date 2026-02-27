"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linear = void 0;
var borderRadiusPolygon_1 = require("./borderRadiusPolygon");
var utils_1 = require("./utils");
/**
 * This is a custom "linear" curve generator.
 * It draws straight lines for the 4 provided points,
 * with the option to properly handling the border radius.
 *
 * The implementation is based on the d3-shape linear curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/linear.js
 */
var Linear = /** @class */ (function () {
    function Linear(context, _a) {
        var isHorizontal = _a.isHorizontal, gap = _a.gap, position = _a.position, sections = _a.sections, borderRadius = _a.borderRadius, min = _a.min, max = _a.max, isIncreasing = _a.isIncreasing, pointShape = _a.pointShape;
        this.position = 0;
        this.sections = 0;
        this.isHorizontal = false;
        this.isIncreasing = false;
        this.gap = 0;
        this.borderRadius = 0;
        this.min = { x: 0, y: 0 };
        this.max = { x: 0, y: 0 };
        this.points = [];
        this.pointShape = 'square';
        this.context = context;
        this.isHorizontal = isHorizontal !== null && isHorizontal !== void 0 ? isHorizontal : false;
        this.gap = gap !== null && gap !== void 0 ? gap : 0;
        this.position = position !== null && position !== void 0 ? position : 0;
        this.sections = sections !== null && sections !== void 0 ? sections : 1;
        this.borderRadius = borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0;
        this.isIncreasing = isIncreasing !== null && isIncreasing !== void 0 ? isIncreasing : false;
        this.min = min !== null && min !== void 0 ? min : { x: 0, y: 0 };
        this.max = max !== null && max !== void 0 ? max : { x: 0, y: 0 };
        this.pointShape = pointShape !== null && pointShape !== void 0 ? pointShape : 'square';
        if (isIncreasing) {
            var currentMin = this.min;
            var currentMax = this.max;
            this.min = currentMax;
            this.max = currentMin;
        }
    }
    Linear.prototype.areaStart = function () { };
    Linear.prototype.areaEnd = function () { };
    Linear.prototype.lineStart = function () { };
    Linear.prototype.lineEnd = function () { };
    Linear.prototype.getBorderRadius = function () {
        if (this.gap > 0) {
            return this.borderRadius;
        }
        if (this.isIncreasing) {
            // Is largest section
            if (this.position === this.sections - 1) {
                return [this.borderRadius, this.borderRadius];
            }
            // Is smallest section and shaped like a triangle
            if (this.position === 0 && this.pointShape === 'sharp') {
                return [0, 0, this.borderRadius];
            }
            // Is smallest section
            if (this.position === 0) {
                return [0, 0, this.borderRadius, this.borderRadius];
            }
        }
        if (!this.isIncreasing) {
            // Is largest section
            if (this.position === 0) {
                return [0, 0, this.borderRadius, this.borderRadius];
            }
            // Is smallest section and shaped like a triangle
            if (this.position === this.sections - 1 && this.pointShape === 'sharp') {
                return [0, 0, this.borderRadius];
            }
            // Is smallest section
            if (this.position === this.sections - 1) {
                return [this.borderRadius, this.borderRadius];
            }
        }
        return 0;
    };
    Linear.prototype.processPoints = function (points) {
        var _this = this;
        // Add gaps where they are needed.
        var processedPoints = points.map(function (point, index) {
            var slopeStart = points.at(index <= 1 ? 0 : 3);
            var slopeEnd = points.at(index <= 1 ? 1 : 2);
            if (_this.isHorizontal) {
                var yGetter = (0, utils_1.lerpY)(slopeStart.x - _this.gap, slopeStart.y, slopeEnd.x, slopeEnd.y);
                return {
                    x: point.x,
                    y: yGetter(point.x),
                };
            }
            var xGetter = (0, utils_1.lerpX)(slopeStart.x, slopeStart.y - _this.gap, slopeEnd.x, slopeEnd.y);
            return {
                x: xGetter(point.y),
                y: point.y,
            };
        });
        if (this.pointShape === 'sharp') {
            // In the last section, to form a triangle we need 3 points instead of 4
            // Else the algorithm will break.
            var isLastSection = this.position === this.sections - 1;
            var isFirstSection = this.position === 0;
            var firstPoint = null;
            var secondPoint = null;
            if (isFirstSection && this.isIncreasing) {
                firstPoint = processedPoints[1];
                secondPoint = processedPoints[2];
            }
            if (isLastSection && !this.isIncreasing) {
                firstPoint = processedPoints[3];
                secondPoint = processedPoints[0];
            }
            if (firstPoint && secondPoint) {
                return [
                    // Sharp point at the start
                    this.isHorizontal
                        ? { x: this.max.x, y: (this.max.y + this.min.y) / 2 }
                        : { x: (this.max.x + this.min.x) / 2, y: this.max.y },
                    // Then other points
                    firstPoint,
                    secondPoint,
                ];
            }
        }
        return processedPoints;
    };
    Linear.prototype.point = function (xIn, yIn) {
        this.points.push({ x: xIn, y: yIn });
        var isLastSection = this.position === this.sections - 1;
        var isFirstSection = this.position === 0;
        var isSharpPoint = this.pointShape === 'sharp' &&
            ((isLastSection && !this.isIncreasing) || (isFirstSection && this.isIncreasing));
        if (this.points.length < (isSharpPoint ? 3 : 4)) {
            return;
        }
        (0, borderRadiusPolygon_1.borderRadiusPolygon)(this.context, this.points, this.getBorderRadius());
    };
    return Linear;
}());
exports.Linear = Linear;
