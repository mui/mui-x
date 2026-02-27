"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useXScale = useXScale;
exports.useYScale = useYScale;
exports.useRotationScale = useRotationScale;
exports.useRadiusScale = useRadiusScale;
var useAxis_1 = require("./useAxis");
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
