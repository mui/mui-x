'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
export function useChartRootRef(): React.RefObject<HTMLDivElement | null> {
  const context = useChartContext();

  return context.chartRootRef;
}
