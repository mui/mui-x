'use client';
import * as React from 'react';
import { SizeContext } from '../context/SizeProvider';

export function useSvgRef(): React.MutableRefObject<SVGSVGElement> {
  const { isInitialized, data } = React.useContext(SizeContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the svg ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return data.svgRef as React.MutableRefObject<SVGSVGElement>;
}
