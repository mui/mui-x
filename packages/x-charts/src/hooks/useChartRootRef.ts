'use client';
import type * as React from 'react';
import { useChartsContext } from '../context/ChartsProvider';

/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
export function useChartRootRef<T extends Element = HTMLDivElement>() {
  const { instance } = useChartsContext();

  return instance.chartRootRef as React.RefObject<T | null>;
}
