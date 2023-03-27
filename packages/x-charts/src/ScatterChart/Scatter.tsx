import * as React from 'react';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../hooks/useScale';

export interface ScatterProps {
  data: ScatterSeriesType['data'];
  xScale: D3Scale;
  yScale: D3Scale;
  markerSize: number;
}

export function Scatter(props: ScatterProps) {
  const { data, xScale, yScale, markerSize } = props;

  return (
    <g>
      {data.map(({ x, y, id }) => (
        <circle
          key={id}
          cx={0}
          cy={0}
          r={markerSize}
          transform={`translate(${xScale(x as number)}, ${yScale(y as number)})`}
          fill="red"
        />
      ))}
    </g>
  );
}
