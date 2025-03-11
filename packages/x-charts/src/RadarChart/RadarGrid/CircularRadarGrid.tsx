import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { RadarGridRenderProps } from './RadarGrid.types';

/**
 * @ignore - internal component.
 */
export function CircularRadarGrid(props: RadarGridRenderProps) {
  const { center, corners, divisions, radius } = props;
  const theme = useTheme();

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
          stroke={(theme.vars || theme).palette.text.primary}
          strokeWidth={1}
          fill="none"
        />
      ))}
      {divisionRadius.map((r) => (
        <circle
          key={r}
          cx={center.x}
          cy={center.y}
          r={r}
          stroke={(theme.vars || theme).palette.text.primary}
          strokeWidth={1}
          fill="none"
        />
      ))}
    </React.Fragment>
  );
}
