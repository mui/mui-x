import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRadarAxisHighlight } from './useRadarAxisHighlight';

import { type RadarAxisHighlightClasses } from './radarAxisHighlightClasses';
import { useUtilityClasses as useDeprecatedUtilityClasses } from './radarAxisHighlightClasses';
import { useUtilityClasses } from '../radarClasses';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

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
  const classes = useUtilityClasses();
  const deprecatedClasses = useDeprecatedUtilityClasses(props.classes);

  const theme = useTheme();
  const data = useRadarAxisHighlight();

  if (data === null) {
    return null;
  }

  const { center, series, points, radius, highlightedAngle, highlightedIndex, instance } = data;

  const [x, y] = instance.polar2svg(radius, highlightedAngle);
  return (
    <g className={`${classes.axisHighlightRoot} ${deprecatedClasses.root}`}>
      <path
        d={`M ${center.cx} ${center.cy} L ${x} ${y}`}
        stroke={(theme.vars || theme).palette.text.primary}
        strokeWidth={1}
        className={`${classes.axisHighlightLine} ${deprecatedClasses.line}`}
        pointerEvents="none"
        strokeDasharray="4 4"
      />
      {points.map((point, seriesIndex) => {
        const colorGetter = getSeriesColorFn(series[seriesIndex]);

        return (
          <circle
            key={series[seriesIndex].id}
            fill={colorGetter({ value: point.value, dataIndex: highlightedIndex })}
            cx={point.x}
            cy={point.y}
            className={`${classes.axisHighlightDot} ${deprecatedClasses.dot}`}
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
