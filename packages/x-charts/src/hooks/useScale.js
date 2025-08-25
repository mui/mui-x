"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueToPositionMapper = getValueToPositionMapper;
exports.useXScale = useXScale;
exports.useYScale = useYScale;
exports.useRotationScale = useRotationScale;
exports.useRadiusScale = useRadiusScale;
var isBandScale_1 = require("../internals/isBandScale");
var useAxis_1 = require("./useAxis");
/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
function getValueToPositionMapper(scale) {
    if ((0, isBandScale_1.isBandScale)(scale)) {
        return function (value) { var _a; return ((_a = scale(value)) !== null && _a !== void 0 ? _a : 0) + scale.bandwidth() / 2; };
    }
    return function (value) { return scale(value); };
}
/**
 * Get the X scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the x axis with axisId, else returns the values for the default x axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified X axis.
 */
function useXScale(axisId) {
    var axis = (0, useAxis_1.useXAxis)(axisId);
    return axis.scale;
}
/**
 * Get the Y scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the y axis with axisId, else returns the values for the default y axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified Y axis.
 */
function useYScale(axisId) {
    var axis = (0, useAxis_1.useYAxis)(axisId);
    return axis.scale;
}
function useRotationScale(identifier) {
    var axis = (0, useAxis_1.useRotationAxis)(identifier);
    return axis === null || axis === void 0 ? void 0 : axis.scale;
}
function useRadiusScale(identifier) {
    var axis = (0, useAxis_1.useRadiusAxis)(identifier);
    return axis === null || axis === void 0 ? void 0 : axis.scale;
}
