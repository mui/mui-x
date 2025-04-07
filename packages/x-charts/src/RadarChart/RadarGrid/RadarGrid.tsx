import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRadarGridData } from './useRadarGridData';
import { SharpRadarGrid } from './SharpRadarGrid';
import { RadarGridProps } from './RadarGrid.types';
import { CircularRadarGrid } from './CircularRadarGrid';
import { SharpRadarStripes } from './SharpRadarStripes';
import { CircularRadarStripes } from './CircularRadarStripes';
import { useUtilityClasses } from './radarGridClasses';

function RadarGrid(props: RadarGridProps) {
  const theme = useTheme();

  const {
    divisions = 5,
    shape = 'sharp',
    stripeColor = (index) =>
      index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none',
  } = props;
  const gridData = useRadarGridData();

  const classes = useUtilityClasses(props.classes);
  if (gridData === null) {
    return null;
  }

  const { center, corners, radius } = gridData;

  return shape === 'sharp' ? (
    <React.Fragment>
      {stripeColor && (
        <SharpRadarStripes
          divisions={divisions}
          corners={corners}
          center={center}
          radius={radius}
          stripeColor={stripeColor}
          classes={classes}
        />
      )}
      <SharpRadarGrid
        divisions={divisions}
        corners={corners}
        center={center}
        radius={radius}
        strokeColor={(theme.vars || theme).palette.text.primary}
        classes={classes}
      />
    </React.Fragment>
  ) : (
    <React.Fragment>
      {stripeColor && (
        <CircularRadarStripes
          divisions={divisions}
          corners={corners}
          center={center}
          radius={radius}
          stripeColor={stripeColor}
          classes={classes}
        />
      )}
      <CircularRadarGrid
        divisions={divisions}
        corners={corners}
        center={center}
        radius={radius}
        strokeColor={(theme.vars || theme).palette.text.primary}
        classes={classes}
      />
    </React.Fragment>
  );
}

RadarGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
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
  /**
   * Get stripe fill color. Set it to `null` to remove stripes
   * @param {number} index The index of the stripe band.
   * @returns {string} The color to fill the stripe.
   * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
   */
  stripeColor: PropTypes.func,
} as any;

export { RadarGrid };
