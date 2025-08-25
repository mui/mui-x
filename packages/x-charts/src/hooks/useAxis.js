"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useXAxes = useXAxes;
exports.useYAxes = useYAxes;
exports.useXAxis = useXAxis;
exports.useYAxis = useYAxis;
exports.useRotationAxes = useRotationAxes;
exports.useRadiusAxes = useRadiusAxes;
exports.useRotationAxis = useRotationAxis;
exports.useRadiusAxis = useRadiusAxis;
var useChartCartesianAxisRendering_selectors_1 = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors");
var useChartPolarAxis_1 = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var useSelector_1 = require("../internals/store/useSelector");
var useStore_1 = require("../internals/store/useStore");
/**
 * Get all the x-axes.
 *
 * - `xAxis` is an object with the shape `{ [axisId]: axis }`.
 * - `xAxisIds` is an array of axis IDs.
 *
 * If access to a specific X axis is needed, use the `useXAxis` hook instead.
 *
 * @returns `{ xAxis, xAxisIds }` - The x-axes and their IDs.
 */
function useXAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis), xAxis = _a.axis, xAxisIds = _a.axisIds;
    return { xAxis: xAxis, xAxisIds: xAxisIds };
}
/**
 * Get all the y-axes.
 *
 * - `yAxis` is an object with the shape `{ [axisId]: axis }`.
 * - `yAxisIds` is an array of axis IDs.
 *
 * If access to a specific Y axis is needed, use the `useYAxis` hook instead.
 *
 * @returns `{ yAxis, yAxisIds }` - The y-axes and their IDs.
 */
function useYAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis), yAxis = _a.axis, yAxisIds = _a.axisIds;
    return { yAxis: yAxis, yAxisIds: yAxisIds };
}
/**
 * Get the X axis.
 * @param {AxisId | undefined} axisId - If provided returns the x axis with axisId, else returns the values for the default x axis.
 * @returns The X axis.
 */
function useXAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartCartesianAxisRendering_selectors_1.selectorChartXAxis), xAxis = _a.axis, xAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : xAxisIds[0];
    return xAxis[id];
}
/**
 * Get the Y axis.
 * @param {AxisId | undefined} axisId - If provided returns the y axis with axisId, else returns the values for the default y axis.
 * @returns The Y axis.
 */
function useYAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartCartesianAxisRendering_selectors_1.selectorChartYAxis), yAxis = _a.axis, yAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : yAxisIds[0];
    return yAxis[id];
}
function useRotationAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartPolarAxis_1.selectorChartRotationAxis), rotationAxis = _a.axis, rotationAxisIds = _a.axisIds;
    return { rotationAxis: rotationAxis, rotationAxisIds: rotationAxisIds };
}
function useRadiusAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartPolarAxis_1.selectorChartRadiusAxis), radiusAxis = _a.axis, radiusAxisIds = _a.axisIds;
    return { radiusAxis: radiusAxis, radiusAxisIds: radiusAxisIds };
}
function useRotationAxis(identifier) {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartPolarAxis_1.selectorChartRotationAxis), rotationAxis = _a.axis, rotationAxisIds = _a.axisIds;
    var id = typeof identifier === 'string' ? identifier : rotationAxisIds[identifier !== null && identifier !== void 0 ? identifier : 0];
    return rotationAxis[id];
}
function useRadiusAxis(identifier) {
    var store = (0, useStore_1.useStore)();
    var _a = (0, useSelector_1.useSelector)(store, useChartPolarAxis_1.selectorChartRadiusAxis), radiusAxis = _a.axis, radiusAxisIds = _a.axisIds;
    var id = typeof identifier === 'string' ? identifier : radiusAxisIds[identifier !== null && identifier !== void 0 ? identifier : 0];
    return radiusAxis[id];
}
