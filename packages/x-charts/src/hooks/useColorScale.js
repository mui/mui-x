"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useXColorScale = useXColorScale;
exports.useYColorScale = useYColorScale;
exports.useZColorScale = useZColorScale;
var useAxis_1 = require("./useAxis");
var useZAxis_1 = require("./useZAxis");
/**
 * Get the X axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
function useXColorScale(axisId) {
    var axis = (0, useAxis_1.useXAxis)(axisId);
    return axis.colorScale;
}
/**
 * Get the Y axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
function useYColorScale(axisId) {
    var axis = (0, useAxis_1.useYAxis)(axisId);
    return axis.colorScale;
}
/**
 * Get the Z axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
function useZColorScale(axisId) {
    var axis = (0, useZAxis_1.useZAxis)(axisId);
    return axis.colorScale;
}
