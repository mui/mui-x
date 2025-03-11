import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRadarGridData } from './useRadarGridData';

export interface RadarGridProps {
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions?: number;
}

function RadarGrid(props: RadarGridProps) {
  const { divisions = 5 } = props;
  const { center, corners } = useRadarGridData();

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

RadarGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions: PropTypes.number,
} as any;

export { RadarGrid };
