import * as React from 'react';
import { type SeriesId } from '@mui/x-charts/models';

export interface RadialAreaProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'points'> {
  seriesId: SeriesId;
  color: string;
  hidden?: boolean;
  points: { x: number; y: number }[];
}

function getRadialAreaPath(points: { x: number; y: number }[]) {
  if (points.length === 0) {
    return '';
  }
  return `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z`;
}

function RadialArea(props: RadialAreaProps) {
  const { seriesId, color, hidden, points, ...other } = props;

  return (
    <path
      data-series={seriesId}
      d={getRadialAreaPath(points)}
      fill={color}
      stroke="none"
      opacity={hidden ? 0 : 1}
      {...other}
    />
  );
}

export { RadialArea };
