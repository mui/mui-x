'use client';
import * as React from 'react';
import { SvgRefContext } from '../context/SvgRefProvider';

/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
export function useSvgRef(): React.MutableRefObject<SVGSVGElement> {
  const { isInitialized, data } = React.useContext(SvgRefContext);

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
