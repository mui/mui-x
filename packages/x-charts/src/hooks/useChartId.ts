'use client';
import * as React from 'react';
import { DrawingAreaContext } from '../context/DrawingAreaProvider';

/**
 * Get the unique identifier of the chart.
 * @returns {string} chartId
 */
export function useChartId(): string {
  const { chartId } = React.useContext(DrawingAreaContext);

  return React.useMemo(() => chartId, [chartId]);
}
