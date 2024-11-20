'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { getAxisHighlightUtilityClass } from './chartsAxisHighlightClasses';
import ChartsYHighlight from './ChartsYAxisHighlight';
import ChartsXHighlight from './ChartsXAxisHighlight';
import { ChartsAxisHighlightProps } from './ChartsAxisHighlight.types';

const useUtilityClasses = () => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getAxisHighlightUtilityClass);
};

/**
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlight API](https://mui.com/x/api/charts/charts-axis-highlight/)
 */
function ChartsAxisHighlight(props: ChartsAxisHighlightProps) {
  const { x: xAxisHighlight, y: yAxisHighlight } = props;

  const classes = useUtilityClasses();
  return (
    <React.Fragment>
      {xAxisHighlight && <ChartsXHighlight type={xAxisHighlight} classes={classes} />}
      {yAxisHighlight && <ChartsYHighlight type={yAxisHighlight} classes={classes} />}
    </React.Fragment>
  );
}

ChartsAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  x: PropTypes.oneOf(['band', 'line', 'none']),
  y: PropTypes.oneOf(['band', 'line', 'none']),
} as any;

export { ChartsAxisHighlight };
