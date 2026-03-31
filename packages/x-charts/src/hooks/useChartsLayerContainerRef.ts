'use client';
import type * as React from 'react';
import { useChartsContext } from '../context/ChartsProvider';

/**
 * Get the ref for the chart surface element.
 * @returns The chart surface ref.
 */
export function useChartsLayerContainerRef(): React.RefObject<HTMLDivElement | null> {
  const { instance } = useChartsContext();

  return instance.chartsLayerContainerRef;
}
