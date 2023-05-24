import * as React from 'react';
import { DrawingContext } from '../context/DrawingProvider';
import {
  AnchorPosition,
  SizingParams,
  getLegendSize,
  getSeriesToDisplay,
  getTranslateValues,
} from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';


export type LegendProps = {
  position: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
} & SizingParams;

export function Legend(props: LegendProps) {
  const {
    position = { horizontal: 'middle', vertical: 'top' },
    offset,
    direction = 'row',
    markSize = 20,
    itemWidth = 100,
    spacing = 2,
  } = props;
  const { left, top, width, height } = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  const legendSize = getLegendSize(seriesToDisplay.length, {
    direction,
    markSize,
    itemWidth,
    spacing,
  });

  const { left: translateLeft, top: translateTop } = getTranslateValues(
    { width, height },
    position,
    legendSize,
  );

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;
  return (
    <g transform={`translate(${left + translateLeft + offsetX},${top + translateTop + offsetY})`}>
      {/* <rect x={0} y={0} width={contentWidth} height={contentHeight} /> */}
      {seriesToDisplay.map(({ id, label, color }, seriesIndex) => (
        <g
          key={id}
          transform={`translate(${direction === 'row' ? seriesIndex * (itemWidth + spacing) : 0}, ${
            direction === 'column' ? seriesIndex * (markSize + spacing) : 0
          })`}
        >
          <rect x={0} y={0} width={markSize} height={markSize} fill={color} />
          <text x={markSize + 5} y={markSize / 2} alignmentBaseline="central">
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}
