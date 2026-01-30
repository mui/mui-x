'use client';
import type * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
export function useSvgRef(): React.RefObject<SVGSVGElement | null> {
  const { instance } = useChartContext();

  return instance.svgRef;
}
