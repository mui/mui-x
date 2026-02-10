"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pyramid = void 0;
var borderRadiusPolygon_1 = require("./borderRadiusPolygon");
var utils_1 = require("./utils");
/**
 * This is a custom "pyramid" curve generator.
 * It draws straight lines for the 4 provided points. The slopes are calculated
 * based on the min and max values of the x and y axes.
 * with the option to add a gap between sections while also properly handling the border radius.
 */
var Pyramid = /** @class */ (function () {
    function Pyramid(context, _a) {
        var isHorizontal = _a.isHorizontal, gap = _a.gap, position = _a.position, sections = _a.sections, borderRadius = _a.borderRadius, min = _a.min, max = _a.max, isIncreasing = _a.isIncreasing;
        this.position = 0;
        this.sections = 0;
        this.isHorizontal = false;
        this.isIncreasing = false;
        this.gap = 0;
        this.borderRadius = 0;
        this.min = { x: 0, y: 0 };
        this.max = { x: 0, y: 0 };
        this.points = [];
        this.context = context;
        this.isHorizontal = isHorizontal !== null && isHorizontal !== void 0 ? isHorizontal : false;
        this.gap = (gap !== null && gap !== void 0 ? gap : 0) / 2;
        this.position = position !== null && position !== void 0 ? position : 0;
        this.sections = sections !== null && sections !== void 0 ? sections : 1;
        this.borderRadius = borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0;
        this.isIncreasing = isIncreasing !== null && isIncreasing !== void 0 ? isIncreasing : false;
        this.min = min !== null && min !== void 0 ? min : { x: 0, y: 0 };
        this.max = max !== null && max !== void 0 ? max : { x: 0, y: 0 };
        if (isIncreasing) {
            var currentMin = this.min;
            var currentMax = this.max;
            this.min = currentMax;
            this.max = currentMin;
        }
    }
    Pyramid.prototype.areaStart = function () { };
    Pyramid.prototype.areaEnd = function () { };
    Pyramid.prototype.lineStart = function () { };
    Pyramid.prototype.lineEnd = function () { };
    Pyramid.prototype.getBorderRadius = function () {
        if (this.gap > 0) {
            return this.borderRadius;
        }
        if (this.isIncreasing) {
            // Is largest section
            if (this.position === this.sections - 1) {
                return [this.borderRadius, this.borderRadius];
            }
            // Is smallest section and shaped like a triangle
            if (this.position === 0) {
                return [0, 0, this.borderRadius];
            }
        }
        if (!this.isIncreasing) {
            // Is largest section
            if (this.position === 0) {
                return [0, 0, this.borderRadius, this.borderRadius];
            }
            // Is smallest section and shaped like a triangle
            if (this.position === this.sections - 1) {
                return [this.borderRadius];
            }
        }
        return 0;
    };
    Pyramid.prototype.processPoints = function (points) {
        var _this = this;
        // Replace funnel points by pyramids ones.
        var processedPoints = points.map(function (point, index) {
            if (_this.isHorizontal) {
                var slopeEnd_1 = {
                    x: _this.max.x,
                    y: (_this.max.y + _this.min.y) / 2,
                };
                var slopeStart_1 = index <= 1
                    ? _this.min
                    : {
                        x: _this.min.x,
                        y: _this.max.y,
                    };
                var yGetter = (0, utils_1.lerpY)(slopeStart_1.x, slopeStart_1.y, slopeEnd_1.x, slopeEnd_1.y);
                return {
                    x: point.x,
                    y: yGetter(point.x),
                };
            }
            var slopeEnd = {
                x: (_this.max.x + _this.min.x) / 2,
                y: _this.max.y,
            };
            var slopeStart = index <= 1
                ? {
                    x: _this.max.x,
                    y: _this.min.y,
                }
                : _this.min;
            var xGetter = (0, utils_1.lerpX)(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
            return {
                x: xGetter(point.y),
                y: point.y,
            };
        });
        // In the last section, to form a triangle we need 3 points instead of 4
        // Else the algorithm will break.
        var isLastSection = this.position === this.sections - 1;
        var isFirstSection = this.position === 0;
        if (isFirstSection && this.isIncreasing) {
            return [processedPoints[0], processedPoints[1], processedPoints[2]];
        }
        if (isLastSection && !this.isIncreasing) {
            return [processedPoints[0], processedPoints[1], processedPoints[3]];
        }
        return processedPoints;
    };
    Pyramid.prototype.point = function (xIn, yIn) {
        this.points.push({ x: xIn, y: yIn });
        var isLastSection = this.position === this.sections - 1;
        var isFirstSection = this.position === 0;
        var isSharpPoint = (isLastSection && !this.isIncreasing) || (isFirstSection && this.isIncreasing);
        if (this.points.length < (isSharpPoint ? 3 : 4)) {
            return;
        }
        (0, borderRadiusPolygon_1.borderRadiusPolygon)(this.context, this.points, this.getBorderRadius());
    };
    return Pyramid;
}());
exports.Pyramid = Pyramid;
