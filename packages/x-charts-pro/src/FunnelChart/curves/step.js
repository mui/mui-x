"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = void 0;
var borderRadiusPolygon_1 = require("./borderRadiusPolygon");
var utils_1 = require("./utils");
/**
 * This is a custom "step" curve generator.
 * It is used to draw "rectangles" from 4 points without having to rework the rendering logic,
 * with the option to add a gap between sections while also properly handling the border radius.
 *
 * It takes the min and max of the x and y coordinates of the points to create a rectangle.
 *
 * The implementation is based on the d3-shape step curve generator.
 * https://github.com/d3/d3-shape/blob/a82254af78f08799c71d7ab25df557c4872a3c51/src/curve/step.js
 */
var Step = /** @class */ (function () {
    function Step(context, _a) {
        var isHorizontal = _a.isHorizontal, gap = _a.gap, position = _a.position, borderRadius = _a.borderRadius, isIncreasing = _a.isIncreasing, sections = _a.sections;
        this.isHorizontal = false;
        this.isIncreasing = false;
        this.gap = 0;
        this.borderRadius = 0;
        this.position = 0;
        this.sections = 0;
        this.points = [];
        this.context = context;
        this.isHorizontal = isHorizontal !== null && isHorizontal !== void 0 ? isHorizontal : false;
        this.gap = gap !== null && gap !== void 0 ? gap : 0;
        this.position = position !== null && position !== void 0 ? position : 0;
        this.sections = sections !== null && sections !== void 0 ? sections : 1;
        this.borderRadius = borderRadius !== null && borderRadius !== void 0 ? borderRadius : 0;
        this.isIncreasing = isIncreasing !== null && isIncreasing !== void 0 ? isIncreasing : false;
    }
    Step.prototype.areaStart = function () { };
    Step.prototype.areaEnd = function () { };
    Step.prototype.lineStart = function () { };
    Step.prototype.lineEnd = function () { };
    Step.prototype.getBorderRadius = function () {
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
    Step.prototype.processPoints = function (points) {
        var _this = this;
        // Ensure we have rectangles instead of trapezoids.
        var processedPoints = points.map(function (_, index) {
            var allX = points.map(function (p) { return p.x; });
            var allY = points.map(function (p) { return p.y; });
            if (_this.isHorizontal) {
                return {
                    x: index === 1 || index === 2 ? (0, utils_1.max)(allX) : (0, utils_1.min)(allX),
                    y: index <= 1 ? (0, utils_1.max)(allY) : (0, utils_1.min)(allY),
                };
            }
            return {
                x: index <= 1 ? (0, utils_1.min)(allX) : (0, utils_1.max)(allX),
                y: index === 1 || index === 2 ? (0, utils_1.max)(allY) : (0, utils_1.min)(allY),
            };
        });
        return processedPoints;
    };
    Step.prototype.point = function (xIn, yIn) {
        this.points.push({ x: xIn, y: yIn });
        if (this.points.length < 4) {
            return;
        }
        (0, borderRadiusPolygon_1.borderRadiusPolygon)(this.context, this.points, this.getBorderRadius());
    };
    return Step;
}());
exports.Step = Step;
