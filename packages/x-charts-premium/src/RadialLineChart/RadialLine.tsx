import * as React from 'react';
import { lineRadial as d3LineRadial } from '@mui/x-charts-vendor/d3-shape';
import { getCurveFactory } from '@mui/x-charts/internals';
import { type CurveType, type SeriesId } from '@mui/x-charts/models';
import { type RadialLinePoint } from './useRadialLinePlotData';

export interface RadialLineProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'points'> {
  seriesId: SeriesId;
  color: string;
  hidden?: boolean;
  points: RadialLinePoint[];
  curve?: CurveType;
}

function RadialLine(props: RadialLineProps) {
  const { seriesId, color, hidden, points, curve, ...other } = props;

  const d =
    d3LineRadial<RadialLinePoint>()
      .angle((p) => p.angle)
      .radius((p) => p.radius)
      .curve(getCurveFactory(curve))(points) || '';

  return (
    <path
      data-series={seriesId}
      d={d}
      stroke={color}
      fill="none"
      opacity={hidden ? 0 : 1}
      {...other}
    />
  );
}

export { RadialLine };
