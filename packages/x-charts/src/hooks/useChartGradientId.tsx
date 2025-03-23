'use client';
import * as React from 'react';
import { useChartId } from './useChartId';
import { AxisId } from '../models/axis';

/**
 * Returns a function that generates a gradient id for the given axis id.
 */
export function useChartGradientIdBuilder() {
  const chartId = useChartId();
  return React.useCallback((axisId: AxisId) => `${chartId}-gradient-${axisId}`, [chartId]);
}

/**
 * Returns a function that generates a gradient id for the given axis id.
 */
export function useChartGradientIdObjectBoundBuilder() {
  const chartId = useChartId();
  return React.useCallback(
    (axisId: AxisId) => `${chartId}-gradient-${axisId}-object-bound`,
    [chartId],
  );
}

/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * For a gradient that respects the coordinates of the object on which it is applied, use `useChartGradientIdObjectBound` instead.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
export function useChartGradientId(axisId: AxisId) {
  return useChartGradientIdBuilder()(axisId);
}

/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * This gradient differs from `useChartGradientId` in that it respects the coordinates of the object on which it is applied.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
export function useChartGradientIdObjectBound(axisId: AxisId) {
  return useChartGradientIdObjectBoundBuilder()(axisId);
}
