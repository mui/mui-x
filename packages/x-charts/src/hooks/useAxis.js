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
var useStore_1 = require("../internals/store/useStore");
/**
 * Get all the x-axes.
 *
 * Returns all X axes configured in the chart along with their IDs.
 * This is useful when you need to iterate over multiple axes or access all axis configurations at once.
 *
 * @returns An object containing:
 *   - `xAxis`: An object mapping axis IDs to their configurations `{ [axisId]: axis }`
 *   - `xAxisIds`: An array of all X axis IDs in the chart
 *
 * @example
 * const { xAxis, xAxisIds } = useXAxes();
 *
 * @see `useXAxis` for accessing a single X axis
 */
function useXAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartCartesianAxisRendering_selectors_1.selectorChartXAxis), xAxis = _a.axis, xAxisIds = _a.axisIds;
    return { xAxis: xAxis, xAxisIds: xAxisIds };
}
/**
 * Get all the y-axes.
 *
 * Returns all Y axes configured in the chart along with their IDs.
 * This is useful when you need to iterate over multiple axes or access all axis configurations at once.
 *
 * @returns An object containing:
 *   - `yAxis`: An object mapping axis IDs to their configurations `{ [axisId]: axis }`
 *   - `yAxisIds`: An array of all Y axis IDs in the chart
 *
 * @example
 * const { yAxis, yAxisIds } = useYAxes();
 *
 * @see `useYAxis` for accessing a single Y axis
 */
function useYAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartCartesianAxisRendering_selectors_1.selectorChartYAxis), yAxis = _a.axis, yAxisIds = _a.axisIds;
    return { yAxis: yAxis, yAxisIds: yAxisIds };
}
/**
 * Get a specific X axis or the default X axis.
 *
 * @param {AxisId} [axisId] - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `xAxis` prop
 *   - Undefined to get the default (first) X axis
 * @returns The configuration for a single X axis.
 *
 * @example
 * // Get the default X axis
 * const xAxis = useXAxis();
 *
 * @example
 * // Get a specific X axis by string ID
 * const xAxis = useXAxis('revenue');
 */
function useXAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartCartesianAxisRendering_selectors_1.selectorChartXAxis), xAxis = _a.axis, xAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : xAxisIds[0];
    return xAxis[id];
}
/**
 * Get a specific Y axis or the default Y axis.
 *
 * @param {AxisId} [axisId] - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's `yAxis` prop
 *   - Undefined to get the default (first) Y axis
 * @returns The configuration for a single Y axis.
 *
 * @example
 * // Get the default Y axis
 * const yAxis = useYAxis();
 *
 * @example
 * // Get a specific Y axis by string ID
 * const yAxis = useYAxis('temperature');
 */
function useYAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartCartesianAxisRendering_selectors_1.selectorChartYAxis), yAxis = _a.axis, yAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : yAxisIds[0];
    return yAxis[id];
}
/**
 * Get all the rotation axes for polar charts.
 *
 * Returns all rotation axes configured in polar charts along with their IDs.
 * Rotation axes are used in charts like `RadarChart` to define angular positioning.
 *
 * @returns An object containing:
 *   - `rotationAxis`: An object mapping axis IDs to their configurations `{ [axisId]: axis }`
 *   - `rotationAxisIds`: An array of all rotation axis IDs in the chart
 *
 * @example
 * const { rotationAxis, rotationAxisIds } = useRotationAxes();
 *
 * @see `useRotationAxis` for accessing a single rotation axis
 */
function useRotationAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartPolarAxis_1.selectorChartRotationAxis), rotationAxis = _a.axis, rotationAxisIds = _a.axisIds;
    return { rotationAxis: rotationAxis, rotationAxisIds: rotationAxisIds };
}
/**
 * Get all the radius axes for polar charts.
 *
 * Returns all radial axes configured in polar charts along with their IDs.
 * Radius axes are used in charts like `RadarChart` to define radial positioning and scaling.
 *
 * @returns An object containing:
 *   - `radiusAxis`: An object mapping axis IDs to their configurations `{ [axisId]: axis }`
 *   - `radiusAxisIds`: An array of all radius axis IDs in the chart
 *
 * @example
 * const { radiusAxis, radiusAxisIds } = useRadiusAxes();
 *
 * @see `useRadiusAxis` for accessing a single radius axis
 */
function useRadiusAxes() {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartPolarAxis_1.selectorChartRadiusAxis), radiusAxis = _a.axis, radiusAxisIds = _a.axisIds;
    return { radiusAxis: radiusAxis, radiusAxisIds: radiusAxisIds };
}
/**
 * Get a specific rotation axis or the default rotation axis for polar charts.
 *
 * Returns the configuration and scale for a rotation axis in polar charts.
 * The rotation axis controls the angular positioning of data points around the circle.
 *
 * @param {AxisId} [axisId] - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's rotation axis configuration
 *   - Undefined to get the default (first) rotation axis
 * @returns The rotation axis configuration, or undefined if not found
 *
 * @example
 * // Get the default rotation axis
 * const rotationAxis = useRotationAxis();
 *
 * @example
 * // Get a specific rotation axis by string ID
 * const rotationAxis = useRotationAxis('categories');
 */
function useRotationAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartPolarAxis_1.selectorChartRotationAxis), rotationAxis = _a.axis, rotationAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : rotationAxisIds[0];
    return rotationAxis[id];
}
/**
 * Get a specific radius axis or the default radius axis for polar charts.
 *
 * Returns the configuration and scale for a radial axis in polar charts.
 * The radius axis controls the radial distance of data points from the center of the circle.
 *
 * @param {AxisId} [axisId] - The axis identifier. Can be:
 *   - A string or number matching the axis ID defined in the chart's radius axis configuration
 *   - Undefined to get the default (first) radius axis
 * @returns The radius axis configuration, or undefined if not found
 *
 * @example
 * // Get the default radius axis
 * const radiusAxis = useRadiusAxis();
 *
 * @example
 * // Get a specific radius axis by string ID
 * const radiusAxis = useRadiusAxis('magnitude');
 */
function useRadiusAxis(axisId) {
    var store = (0, useStore_1.useStore)();
    var _a = store.use(useChartPolarAxis_1.selectorChartRadiusAxis), radiusAxis = _a.axis, radiusAxisIds = _a.axisIds;
    var id = axisId !== null && axisId !== void 0 ? axisId : radiusAxisIds[0];
    return radiusAxis[id];
}
