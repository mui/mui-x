'use client';
import * as React from 'react';
import { useChartId } from './useChartId';
import { AxisId } from '../models/axis';

/**
 * Returns a function that generates a gradient id for the given axis id and direction.
 */
export function useChartGradientIdBuilder() {
  const chartId = useChartId();
  return React.useCallback(
    (axisId: AxisId, axisDirection: 'x' | 'y' | 'z') =>
      `${chartId}-gradient-${axisDirection}-${axisId}`,
    [chartId],
  );
}

/**
 * Returns a function that generates a gradient id for the given axis id and direction.
 */
export function useChartGradientIdObjectBoundBuilder() {
  const chartId = useChartId();
  return React.useCallback(
    (axisId: AxisId, axisDirection: 'x' | 'y' | 'z') =>
      `${chartId}-gradient-${axisDirection}-${axisId}-object-bound`,
    [chartId],
  );
}

/**
 * Returns a gradient id for the given axis id and direction.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * For a gradient that respects the coordinates of the object on which it is applied, use `useChartGradientIdObjectBound` instead.
 *
 * @param axisId the axis id
 * @param axisDirection the direction of the axis
 * @returns the gradient id
 */
export function useChartGradientId(axisId: AxisId, axisDirection: 'x' | 'y' | 'z') {
  return useChartGradientIdBuilder()(axisId, axisDirection);
}

/**
 * Returns a gradient id for the given axis id and direction.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * This gradient differs from `useChartGradientId` in that it respects the coordinates of the object on which it is applied.
 *
 * @param axisId the axis id
 * @param axisDirection the direction of the axis
 * @returns the gradient id
 */
export function useChartGradientIdObjectBound(axisId: AxisId, axisDirection: 'x' | 'y' | 'z') {
  return useChartGradientIdObjectBoundBuilder()(axisId, axisDirection);
}
