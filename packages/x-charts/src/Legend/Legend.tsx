import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';
import { AnchorPosition, getTranslateValues } from './utils';

export type LegendProps = {
  position: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
};
export function Legend(props: LegendProps) {
  const { position, offset } = props;
  const { left, top, width, height } = React.useContext(DrawingContext);

  const contentWidth = 50;
  const contentHeight = 80;

  const { left: translateLeft, top: translateTop } = getTranslateValues(
    { width, height },
    position,
    { width: contentWidth, height: contentHeight },
  );

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;
  return (
    <g transform={`translate(${left + translateLeft + offsetX},${top + translateTop + offsetY})`}>
      <rect x={0} y={0} width={contentWidth} height={contentHeight} />
    </g>
  );
}
