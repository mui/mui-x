'use client';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import {
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  type UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { useStore } from '../internals/store/useStore';
import {
  type AxisId,
  type ChartsRadiusAxisProps,
  type ChartsRotationAxisProps,
  type PolarAxisDefaultized,
  type ScaleName,
  type AxisScaleConfig,
  type ChartsXAxisProps,
  type ChartsYAxisProps,
  type ComputedAxis,
} from '../models/axis';

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
export function useXAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);

  return { xAxis, xAxisIds };
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
export function useYAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);

  return { yAxis, yAxisIds };
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
export function useXAxis<T extends keyof AxisScaleConfig>(
  axisId?: AxisId,
): ComputedAxis<T, any, ChartsXAxisProps> {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);

  const id = axisId ?? xAxisIds[0];

  return xAxis[id] as ComputedAxis<T, any, ChartsXAxisProps>;
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
export function useYAxis<T extends keyof AxisScaleConfig>(
  axisId?: AxisId,
): ComputedAxis<T, any, ChartsYAxisProps> {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);

  const id = axisId ?? yAxisIds[0];

  return yAxis[id] as ComputedAxis<T, any, ChartsYAxisProps>;
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
export function useRotationAxes() {
  const store = useStore();
  const { axis: rotationAxis, axisIds: rotationAxisIds } = store.use(selectorChartRotationAxis);

  return { rotationAxis, rotationAxisIds };
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
export function useRadiusAxes() {
  const store = useStore();
  const { axis: radiusAxis, axisIds: radiusAxisIds } = store.use(selectorChartRadiusAxis);

  return { radiusAxis, radiusAxisIds };
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
export function useRotationAxis(
  axisId?: AxisId,
): PolarAxisDefaultized<ScaleName, any, ChartsRotationAxisProps> | undefined {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: rotationAxis, axisIds: rotationAxisIds } = store.use(selectorChartRotationAxis);

  const id = axisId ?? rotationAxisIds[0];

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
export function useRadiusAxis(
  axisId?: AxisId,
): PolarAxisDefaultized<ScaleName, any, ChartsRadiusAxisProps> | undefined {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: radiusAxis, axisIds: radiusAxisIds } = store.use(selectorChartRadiusAxis);

  const id = axisId ?? radiusAxisIds[0];

  return radiusAxis[id];
}
