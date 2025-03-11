import * as React from 'react';
import PropTypes from 'prop-types';
import { useRadarGridData } from './useRadarGridData';
import { SharpRadarGrid } from './SharpRadarGrid';
import { RadarGridProps } from './RadarGrid.types';
import { CircularRadarGrid } from './CircularRadarGrid';

function RadarGrid(props: RadarGridProps) {
  const { divisions = 5, shape = 'sharp' } = props;
  const { center, corners, radius } = useRadarGridData();

  return shape === 'sharp' ? (
    <SharpRadarGrid divisions={divisions} corners={corners} center={center} radius={radius} />
  ) : (
    <CircularRadarGrid divisions={divisions} corners={corners} center={center} radius={radius} />
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
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape: PropTypes.oneOf(['circular', 'sharp']),
} as any;

export { RadarGrid };
