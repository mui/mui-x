import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { RadarAxisSliceHighlight } from './RadarAxisSliceHighlight';
import { RadarAxisPointsHighlight } from './RadarAxisPointsHighlight';
import {
  getRadarAxisHighlightUtilityClass,
  RadarAxisHighlightClasses,
} from './radarAxisHighlightClasses';

const useUtilityClasses = (classes: RadarAxisHighlightProps['classes']) => {
  const slots = {
    root: ['root'],
    line: ['line'],
    slice: ['slice'],
    dot: ['dot'],
  };

  return composeClasses(slots, getRadarAxisHighlightUtilityClass, classes);
};

export interface RadarAxisHighlightProps {
  /**
   * Switch between different axis highlight visualization.
   * - points: display points on each highlighted value. Recommended for radar with multiple series.
   * - slice: display a slice around the highlighted value. Recommended for radar with a single series.
   * The default value is computed depending on the number of series provided.
   */
  axisHighlightShape: 'points' | 'slice';
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarAxisHighlightClasses>;
}

function RadarAxisHighlight(props: RadarAxisHighlightProps) {
  const classes = useUtilityClasses(props.classes);

  return props.axisHighlightShape === 'slice' ? (
    <RadarAxisSliceHighlight classes={classes} />
  ) : (
    <RadarAxisPointsHighlight classes={classes} />
  );
}

RadarAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Switch between different axis highlight visualization.
   * - points: display points on each highlighted value. Recommended for radar with multiple series.
   * - slice: display a slice around the highlighted value. Recommended for radar with a single series.
   * The default value is computed depending on the number of series provided.
   */
  axisHighlightShape: PropTypes.oneOf(['points', 'slice']).isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;

export { RadarAxisHighlight };
