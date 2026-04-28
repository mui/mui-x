'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { getRadialAxisHighlightUtilityClass } from './chartsRadialAxisHighlightClasses';
import ChartsRotationAxisHighlight from './ChartsRotationAxisHighlight';
import ChartsRadiusAxisHighlight from './ChartsRadiusAxisHighlight';
import { type ChartsRadialAxisHighlightProps } from './ChartsRadialAxisHighlight.types';

const useUtilityClasses = () => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getRadialAxisHighlightUtilityClass);
};

/**
 * Demos:
 *
 * - [Radial Lines](https://mui.com/x/react-charts/radial-lines/)
 *
 * API:
 *
 * - [ChartsRadialAxisHighlight API](https://mui.com/x/api/charts/charts-radial-axis-highlight/)
 */
function ChartsRadialAxisHighlight(props: ChartsRadialAxisHighlightProps) {
  const { rotation: rotationHighlight, radius: radiusHighlight } = props;

  const classes = useUtilityClasses();
  return (
    <React.Fragment>
      {rotationHighlight && rotationHighlight !== 'none' && (
        <ChartsRotationAxisHighlight type={rotationHighlight} classes={classes} />
      )}
      {radiusHighlight && radiusHighlight !== 'none' && (
        <ChartsRadiusAxisHighlight type={radiusHighlight} classes={classes} />
      )}
    </React.Fragment>
  );
}

ChartsRadialAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  radius: PropTypes.oneOf(['line', 'none']),
  rotation: PropTypes.oneOf(['band', 'line', 'none']),
} as any;

export { ChartsRadialAxisHighlight };
