import * as React from 'react';
import PropTypes from 'prop-types';
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

  const divisionRatio = Array.from({ length: divisions }, (_, index) => (index + 1) / divisions);

  return (
    <React.Fragment>
      {corners.map(({ x, y }, i) => (
        <path key={i} d={`M ${center.x} ${center.y} L ${x} ${y}`} stroke="black" />
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
          stroke="black"
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
