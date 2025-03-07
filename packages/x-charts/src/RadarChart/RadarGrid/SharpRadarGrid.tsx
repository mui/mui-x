import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { RadarGridRenderProps } from './RadarGrid.types';

export interface RadarGridProps {
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions?: number;
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape?: 'sharp' | 'rounded';
}

export function SharpRadarGrid(props: RadarGridRenderProps) {
  const { center, corners, divisions } = props;
  const theme = useTheme();

  const divisionRatio = Array.from({ length: divisions }, (_, index) => (index + 1) / divisions);

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
      {divisionRatio.map((ratio) => (
        <path
          key={ratio}
          d={`M ${corners
            .map(
              ({ x, y }) =>
                `${center.x * (1 - ratio) + ratio * x} ${center.y * (1 - ratio) + ratio * y}`,
            )
            .join(' L ')} Z`}
          stroke={(theme.vars || theme).palette.text.primary}
          strokeWidth={1}
          fill="none"
        />
      ))}
    </React.Fragment>
  );
}
