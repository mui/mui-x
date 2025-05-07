import * as React from 'react';
import { RadarGridRenderProps } from './RadarGrid.types';

/**
 * @ignore - internal component.
 */
export function CircularRadarGrid(props: RadarGridRenderProps) {
  const { center, corners, divisions, radius, strokeColor, classes } = props;

  const divisionRadius = Array.from(
    { length: divisions },
    (_, index) => (radius * (index + 1)) / divisions,
  );

  return (
    <React.Fragment>
      {corners.map(({ x, y }, i) => (
        <path
          key={i}
          d={`M ${center.x} ${center.y} L ${x} ${y}`}
          stroke={strokeColor}
          strokeWidth={1}
          strokeOpacity={0.3}
          fill="none"
          className={classes?.radial}
        />
      ))}
      {divisionRadius.map((r) => (
        <circle
          key={r}
          cx={center.x}
          cy={center.y}
          r={r}
          stroke={strokeColor}
          strokeWidth={1}
          strokeOpacity={0.3}
          fill="none"
          className={classes?.divider}
        />
      ))}
    </React.Fragment>
  );
}
