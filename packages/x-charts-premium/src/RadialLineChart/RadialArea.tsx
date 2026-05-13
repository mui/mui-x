import * as React from 'react';
import { areaRadial as d3AreaRadial } from '@mui/x-charts-vendor/d3-shape';
import type { CurveType, SeriesId } from '@mui/x-charts/models';
import { getCurveFactory } from '@mui/x-charts/internals';
import { type RadialLinePoint } from './useRadialLinePlotData';
import { useItemHighlightState } from '../hooks';

export interface RadialAreaProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'points'> {
  seriesId: SeriesId;
  color: string;
  hidden?: boolean;
  curve?: CurveType;
  points: RadialLinePoint[];
}

function RadialArea(props: RadialAreaProps) {
  const { seriesId, color, hidden, curve, points, ...other } = props;

  const identifier = React.useMemo(() => ({ type: 'radialLine' as const, seriesId }), [seriesId]);

  const highlightState = useItemHighlightState(identifier);

  const isHighlighted = highlightState === 'highlighted';
  const isFaded = highlightState === 'faded';

  const d =
    d3AreaRadial<RadialLinePoint>()
      .angle((p) => p.angle)
      .innerRadius((p) => p.baseRadius)
      .outerRadius((p) => p.radius)
      .curve(getCurveFactory(curve))(points) || '';

  const fadedOpacity = isFaded ? 0.3 : 1;
  return (
    <path
      data-series={seriesId}
      data-highlighted={isHighlighted || undefined}
      data-faded={isFaded || undefined}
      d={d}
      fill={color}
      stroke="none"
      filter={isHighlighted ? 'brightness(120%)' : undefined}
      opacity={hidden ? 0 : fadedOpacity}
      {...other}
    />
  );
}

export { RadialArea };
