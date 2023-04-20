import * as React from 'react';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../hooks/useScale';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';

export interface ScatterProps {
  series: ScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  markerSize: number;
  color: string;
}

export function Scatter(props: ScatterProps) {
  const { series, xScale, yScale, color, markerSize } = props;

  const getInteractionItemProps = useInteractionItemProps();

  return (
    <g>
      {series.data.map(({ x, y, id }, dataIndex) => (
        <circle
          key={id}
          cx={0}
          cy={0}
          r={markerSize}
          transform={`translate(${xScale(x as number)}, ${yScale(y as number)})`}
          fill={color}
          {...getInteractionItemProps({ type: 'scatter', seriesId: series.id, dataIndex })}
        />
      ))}
    </g>
  );
}
