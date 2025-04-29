import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import { useRadarAxisHighlight } from './useRadarAxisHighlight';

import {
  getRadarAxisHighlightUtilityClass,
  RadarAxisHighlightClasses,
} from './radarAxisHighlightClasses';

const useUtilityClasses = (classes: RadarAxisHighlightProps['classes']) => {
  const slots = {
    root: ['root'],
    line: ['line'],
    dot: ['dot'],
  };

  return composeClasses(slots, getRadarAxisHighlightUtilityClass, classes);
};

export interface RadarAxisHighlightProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarAxisHighlightClasses>;
}

/**
 * Attributes to display a shadow around a mark.
 */
const highlightMarkShadow = {
  r: 7,
  opacity: 0.3,
};

/**
 * Attributes to display a mark.
 */
const highlightMark = {
  r: 3,
  opacity: 1,
};

function RadarAxisHighlight(props: RadarAxisHighlightProps) {
  const classes = useUtilityClasses(props.classes);

  const theme = useTheme();
  const data = useRadarAxisHighlight();

  if (data === null) {
    return null;
  }

  const { center, series, points, radius, highlightedAngle, instance } = data;

  const [x, y] = instance.polar2svg(radius, highlightedAngle);
  return (
    <g className={classes.root}>
      <path
        d={`M ${center.cx} ${center.cy} L ${x} ${y}`}
        stroke={(theme.vars || theme).palette.text.primary}
        strokeWidth={1}
        className={classes.line}
        pointerEvents="none"
        strokeDasharray="4 4"
      />
      {points.map(({ highlighted }, seriesIndex) => {
        return (
          <circle
            key={series[seriesIndex].id}
            fill={series[seriesIndex].color}
            cx={highlighted.x}
            cy={highlighted.y}
            className={classes.dot}
            pointerEvents="none"
            {...(series[seriesIndex].hideMark ? highlightMark : highlightMarkShadow)}
          />
        );
      })}
    </g>
  );
}

RadarAxisHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
} as any;

export { RadarAxisHighlight };
