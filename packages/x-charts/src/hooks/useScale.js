"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValueToPositionMapper = getValueToPositionMapper;
exports.useXScale = useXScale;
exports.useYScale = useYScale;
exports.useRotationScale = useRotationScale;
exports.useRadiusScale = useRadiusScale;
var scaleGuards_1 = require("../internals/scaleGuards");
var useAxis_1 = require("./useAxis");
/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
function getValueToPositionMapper(scale) {
    if ((0, scaleGuards_1.isOrdinalScale)(scale)) {
        return function (value) { var _a; return ((_a = scale(value)) !== null && _a !== void 0 ? _a : 0) + scale.bandwidth() / 2; };
    }
    var domain = scale.domain();
    // Fixes https://github.com/mui/mui-x/issues/18999#issuecomment-3173787401
    if (domain[0] === domain[1]) {
        return function (value) { return (value === domain[0] ? scale(value) : NaN); };
    }
    return function (value) { return scale(value); };
}
/**
 * Get the X scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `xAxis` prop
 *   - Undefined to get the default (first) X axis
 * @returns The X axis scale
 */
function useXScale(axisId) {
    var axis = (0, useAxis_1.useXAxis)(axisId);
    return axis.scale;
}
/**
 * Get the Y scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `yAxis` prop
 *   - Undefined to get the default (first) Y axis
 * @returns The Y axis scale
 */
function useYScale(axisId) {
    var axis = (0, useAxis_1.useYAxis)(axisId);
    return axis.scale;
}
/**
 * Get the rotation scale.
 *
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `rotationAxis` prop
 *   - Undefined to get the default rotation axis
 * @returns The rotation axis scale, or undefined if not found
 */
function useRotationScale(axisId) {
    var axis = (0, useAxis_1.useRotationAxis)(axisId);
    return axis === null || axis === void 0 ? void 0 : axis.scale;
}
/**
 * Get the radius scale.
 * @param axisId - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `radiusAxis` prop
 *   - Undefined to get the default radius axis
 * @returns The radius axis scale, or undefined if not found
 */
function useRadiusScale(axisId) {
    var axis = (0, useAxis_1.useRadiusAxis)(axisId);
    return axis === null || axis === void 0 ? void 0 : axis.scale;
}
