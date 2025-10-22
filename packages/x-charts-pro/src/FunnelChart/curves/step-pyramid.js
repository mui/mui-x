"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepPyramid = void 0;
var borderRadiusPolygon_1 = require("./borderRadiusPolygon");
var utils_1 = require("./utils");
/**
 * This is a custom "step-pyramid" curve generator.
 * It creates a step pyramid, which is a step-like shape with static lengths.
 * It has the option to add a gap between sections while also properly handling the border radius.
 */
var StepPyramid = /** @class */ (function () {
    function StepPyramid(context, _a) {
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
        this.gap = gap !== null && gap !== void 0 ? gap : 0;
        this.position = position !== null && position !== void 0 ? position : 0;
        this.sections = sections !== null && sections !== void 0 ? sections : 1;
        this.borderRadius = borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0;
        this.isIncreasing = isIncreasing !== null && isIncreasing !== void 0 ? isIncreasing : false;
        this.min = min !== null && min !== void 0 ? min : { x: 0, y: 0 };
        this.max = max !== null && max !== void 0 ? max : { x: 0, y: 0 };
    }
    StepPyramid.prototype.areaStart = function () { };
    StepPyramid.prototype.areaEnd = function () { };
    StepPyramid.prototype.lineStart = function () { };
    StepPyramid.prototype.lineEnd = function () { };
    StepPyramid.prototype.getBorderRadius = function () {
        if (this.gap > 0) {
            return this.borderRadius;
        }
        if (this.isIncreasing) {
            if (this.position === this.sections - 1) {
                return this.borderRadius;
            }
            return [0, 0, this.borderRadius, this.borderRadius];
        }
        if (this.position === 0) {
            return this.borderRadius;
        }
        return [this.borderRadius, this.borderRadius];
    };
    StepPyramid.prototype.slopeStart = function (index) {
        if (this.isIncreasing) {
            if (this.isHorizontal) {
                return {
                    x: this.min.x,
                    y: (this.min.y + this.max.y) / 2,
                };
            }
            return {
                x: (this.min.x + this.max.x) / 2,
                y: this.min.y,
            };
        }
        if (this.isHorizontal) {
            if (index <= 1) {
                return this.min;
            }
            return {
                x: this.min.x,
                y: this.max.y,
            };
        }
        if (index <= 1) {
            return {
                x: this.max.x,
                y: this.min.y,
            };
        }
        return this.min;
    };
    StepPyramid.prototype.slopeEnd = function (index) {
        if (this.isIncreasing) {
            if (this.isHorizontal) {
                if (index <= 1) {
                    return {
                        x: this.max.x,
                        y: this.min.y,
                    };
                }
                return this.max;
            }
            if (index <= 1) {
                return this.max;
            }
            return {
                x: this.min.x,
                y: this.max.y,
            };
        }
        if (this.isHorizontal) {
            return {
                x: this.max.x,
                y: (this.max.y + this.min.y) / 2,
            };
        }
        return {
            x: (this.max.x + this.min.x) / 2,
            y: this.max.y,
        };
    };
    StepPyramid.prototype.initialX = function (index, points) {
        if (this.isIncreasing) {
            return index === 0 || index === 1 ? points.at(1).x : points.at(2).x;
        }
        return index === 0 || index === 1 ? points.at(0).x : points.at(3).x;
    };
    StepPyramid.prototype.initialY = function (index, points) {
        if (this.isIncreasing) {
            return index === 0 || index === 1 ? points.at(1).y : points.at(2).y;
        }
        return index === 0 || index === 1 ? points.at(0).y : points.at(3).y;
    };
    StepPyramid.prototype.processPoints = function (points) {
        var _this = this;
        // Replace funnel points by pyramids ones.
        var processedPoints = points.map(function (point, index) {
            var slopeStart = _this.slopeStart(index);
            var slopeEnd = _this.slopeEnd(index);
            if (_this.isHorizontal) {
                var yGetter = (0, utils_1.lerpY)(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
                var xInitial = _this.initialX(index, points);
                return {
                    x: point.x,
                    y: yGetter(xInitial),
                };
            }
            var xGetter = (0, utils_1.lerpX)(slopeStart.x, slopeStart.y, slopeEnd.x, slopeEnd.y);
            var yInitial = _this.initialY(index, points);
            return {
                x: xGetter(yInitial),
                y: point.y,
            };
        });
        return processedPoints;
    };
    StepPyramid.prototype.point = function (xIn, yIn) {
        this.points.push({ x: xIn, y: yIn });
        if (this.points.length < 4) {
            return;
        }
        (0, borderRadiusPolygon_1.borderRadiusPolygon)(this.context, this.points, this.getBorderRadius());
    };
    return StepPyramid;
}());
exports.StepPyramid = StepPyramid;
