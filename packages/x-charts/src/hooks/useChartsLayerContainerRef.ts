'use client';
import type * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

/**
 * Get the ref for the chart surface element.
 * @returns The chart surface ref.
 */
export function useChartsLayerContainerRef(): React.RefObject<HTMLDivElement | null> {
  const { instance } = useChartContext();

  return instance.chartsLayerContainerRef;
}
