'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
export function useSvgRef(): React.RefObject<SVGSVGElement | null> {
  const context = useChartContext();

  if (!context) {
    throw new Error(
      [
        'MUI X: Could not find the svg ref context.',
        'It looks like you rendered your component outside of a ChartContainer parent component.',
      ].join('\n'),
    );
  }

  return context.svgRef;
}
