import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useRadarAxisHighlight } from './useRadarAxisHighlight';
import { RadarAxisHighlightClasses } from './radarAxisHighlightClasses';

interface RadarAxisPointsHighlightProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarAxisHighlightClasses>;
}

/**
 * @ignore - internal component.
 */
export function RadarAxisPointsHighlight(props: RadarAxisPointsHighlightProps) {
  const { classes } = props;
  const theme = useTheme();
  const data = useRadarAxisHighlight();

  if (data === null) {
    return null;
  }

  const { center, series, points, radius, highlightedAngle, instance } = data;

  const [x, y] = instance.polar2svg(radius, highlightedAngle);
  return (
    <g className={classes?.root}>
      <path
        d={`M ${center.cx} ${center.cy} L ${x} ${y}`}
        stroke={(theme.vars || theme).palette.text.primary}
        strokeWidth={1}
        className={classes?.line}
        pointerEvents="none"
        strokeDasharray='4 4'
      />

      {points.map(({ highlighted }, seriesIndex) => {
        return (
          series[seriesIndex].showMark && (
            <circle
              key={series[seriesIndex].id}
              fill={series[seriesIndex].color}
              cx={highlighted.x}
              cy={highlighted.y}
              r={8}
              className={classes?.dot}
              opacity={0.5}
              pointerEvents="none"
            />
          )
        );
      })}
    </g>
  );
}
