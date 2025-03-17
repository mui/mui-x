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

        const ratioPrev = previous.r / (previous.r + highlighted.r);
        const ratioNext = next.r / (next.r + highlighted.r);

        return (
          <path
            className={classes?.slice}
            key={id}
            fill={color}
            d={`M
 ${center.cx} ${center.cy}
 L ${previous.x * (1 - ratioPrev) + highlighted.x * ratioPrev} ${previous.y * (1 - ratioPrev) + highlighted.y * ratioPrev}
 L ${highlighted.x} ${highlighted.y}
 L ${next.x * (1 - ratioNext) + highlighted.x * ratioNext} ${next.y * (1 - ratioNext) + highlighted.y * ratioNext}
 Z
 `}
            pointerEvents="none"
          />
        );
      })}
    </g>
  );
}
