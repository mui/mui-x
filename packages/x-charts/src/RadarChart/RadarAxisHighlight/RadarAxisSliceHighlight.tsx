import * as React from 'react';
import { useRadarAxisHighlight } from './useRadarAxisHighlight';
import { RadarAxisHighlightClasses } from './radarAxisHighlightClasses';

const params = { includesNeighbors: true };

interface RadarAxisSliceHighlightProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarAxisHighlightClasses>;
}

/**
 * @ignore - internal component.
 */
export function RadarAxisSliceHighlight(props: RadarAxisSliceHighlightProps) {
  const { classes } = props;

  const data = useRadarAxisHighlight(params);

  if (data === null) {
    return null;
  }

  const { center, series, points } = data;

  return (
    <g className={classes?.root}>
      {series.map(({ id, color }, seriesIndex) => {
        const { highlighted, next = highlighted, previous = highlighted } = points[seriesIndex];

        return (
          <path
            className={classes?.slice}
            key={id}
            fill={color}
            d={`M
 ${center.cx} ${center.cy}
 L ${(previous.x + highlighted.x) / 2} ${(previous.y + highlighted.y) / 2}
 L ${highlighted.x} ${highlighted.y}
 L ${(next.x + highlighted.x) / 2} ${(next.y + highlighted.y) / 2}
 Z
 `}
            pointerEvents="none"
          />
        );
      })}
    </g>
  );
}
