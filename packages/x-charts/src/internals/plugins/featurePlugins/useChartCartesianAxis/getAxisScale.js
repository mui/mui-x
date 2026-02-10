"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRange = getRange;
exports.getNormalizedAxisScale = getNormalizedAxisScale;
var axis_1 = require("../../../../models/axis");
var getScale_1 = require("../../../getScale");
var scales_1 = require("../../../scales");
var DEFAULT_CATEGORY_GAP_RATIO = 0.2;
function getRange(drawingArea, axisDirection, axis) {
    var range = axisDirection === 'x'
        ? [drawingArea.left, drawingArea.left + drawingArea.width]
        : [drawingArea.top + drawingArea.height, drawingArea.top];
    return axis.reverse ? [range[1], range[0]] : range;
}
function getNormalizedAxisScale(axis, domain) {
    var _a, _b;
    var range = [0, 1];
    if ((0, axis_1.isBandScaleConfig)(axis)) {
        var categoryGapRatio = (_a = axis.categoryGapRatio) !== null && _a !== void 0 ? _a : DEFAULT_CATEGORY_GAP_RATIO;
        return (0, scales_1.scaleBand)(domain, range)
            .paddingInner(categoryGapRatio)
            .paddingOuter(categoryGapRatio / 2);
    }
    if ((0, axis_1.isPointScaleConfig)(axis)) {
        return (0, scales_1.scalePoint)(domain, range);
    }
    var scaleType = (_b = axis.scaleType) !== null && _b !== void 0 ? _b : 'linear';
    var scale = (0, getScale_1.getScale)(scaleType, domain, range);
    if ((0, axis_1.isSymlogScaleConfig)(axis) && axis.constant != null) {
        scale.constant(axis.constant);
    }
    return scale;
}
