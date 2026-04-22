import * as React from 'react';
import { areaRadial as d3AreaRadial } from '@mui/x-charts-vendor/d3-shape';
import type { CurveType, SeriesId } from '@mui/x-charts/models';
import { getCurveFactory } from '@mui/x-charts/internals';
import { type RadialLinePoint } from './useRadialLinePlotData';

export interface RadialAreaProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'points'> {
  seriesId: SeriesId;
  color: string;
  hidden?: boolean;
  curve?: CurveType;
  points: RadialLinePoint[];
}

function RadialArea(props: RadialAreaProps) {
  const { seriesId, color, hidden, curve, points, ...other } = props;

  const d =
    d3AreaRadial<RadialLinePoint>()
      .angle((p) => p.angle)
      .innerRadius((p) => p.baseRadius)
      .outerRadius((p) => p.radius)
      .curve(getCurveFactory(curve))(points) || '';

  return (
    <path
      data-series={seriesId}
      d={d}
      fill={color}
      stroke="none"
      opacity={hidden ? 0 : 1}
      {...other}
    />
  );
}

export { RadialArea };
