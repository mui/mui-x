'use client';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import { AxisId } from '../models/axis';

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
export function useXAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);

  return { xAxis, xAxisIds };
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
export function useYAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);

  return { yAxis, yAxisIds };
}

/**
 * Get the X axis.
 * @param {AxisId | undefined} axisId - If provided returns the x axis with axisId, else returns the values for the default x axis.
 * @returns The X axis.
 */
export function useXAxis(axisId?: AxisId) {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);

  const id = axisId ?? xAxisIds[0];

  return xAxis[id];
}

/**
 * Get the Y axis.
 * @param {AxisId | undefined} axisId - If provided returns the y axis with axisId, else returns the values for the default y axis.
 * @returns The Y axis.
 */
export function useYAxis(axisId?: AxisId) {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);

  const id = axisId ?? yAxisIds[0];

  return yAxis[id];
}
