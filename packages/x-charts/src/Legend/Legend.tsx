import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';
import { getTranslateValues } from './utils';

export function Legend(props: any) {
  const { left, top, width, height } = React.useContext(DrawingContext);

  const contentWidth = 50;
  const contentHeight = 80;

  const { left: translateLeft, top: translateTop } = getTranslateValues(
    { width, height },
    { x: 'left', y: 'middle' },
    { width: contentWidth, height: contentHeight },
  );
  return (
    <g transform={`translate(${left + translateLeft},${top + translateTop})`}>
      <rect x={0} y={0} width={contentWidth} height={contentHeight} />
    </g>
  );
}
