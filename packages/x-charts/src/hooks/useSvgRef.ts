import * as React from 'react';
import { SvgContext } from '../context/DrawingProvider';

export function useSvgRef(): React.MutableRefObject<SVGSVGElement> {
  const { isInitialized, data } = React.useContext(SvgContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the svg ref context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  return data as React.MutableRefObject<SVGSVGElement>;
}
