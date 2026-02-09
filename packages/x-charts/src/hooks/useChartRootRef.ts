'use client';
import type * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
export function useChartRootRef<T extends Element = HTMLDivElement>() {
  const { instance } = useChartContext();

  return instance.chartRootRef as React.RefObject<T | null>;
}
