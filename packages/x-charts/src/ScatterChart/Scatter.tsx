import * as React from 'react';
import { ScatterSeriesType } from '../models/seriesType/scatter';
import { D3Scale } from '../hooks/useScale';
import { useTooltipItemProps } from '../hooks/useTooltipItemProps';

export interface ScatterProps {
  series: ScatterSeriesType;
  xScale: D3Scale;
  yScale: D3Scale;
  markerSize: number;
}

export function Scatter(props: ScatterProps) {
  const { series, xScale, yScale, markerSize } = props;
  const getItemProps = useTooltipItemProps();

  return (
    <g>
      {series.data.map(({ x, y, id }, dataIndex) => (
        <circle
          key={id}
          cx={0}
          cy={0}
          r={markerSize}
          transform={`translate(${xScale(x as number)}, ${yScale(y as number)})`}
          fill="red"
          {...getItemProps({ type: 'scatter', seriesId: series.id, dataIndex })}
        />
      ))}
    </g>
  );
}
