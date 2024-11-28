'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';

export function useSvgRef(): React.RefObject<SVGSVGElement> {
  const context = useChartContext();

  if (!context) {
    throw new Error(
      [
        'MUI X: Could not find the svg ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return context.svgRef;
}
