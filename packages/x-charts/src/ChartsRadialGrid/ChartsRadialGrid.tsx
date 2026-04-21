'use client';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps } from '@mui/material/styles';
import {
  type ChartsRadialGridClasses,
  getChartsRadialGridUtilityClass,
} from './chartsRadialGridClasses';
import { GridRoot } from './styledComponents';
import { ChartsRotationGrid } from './ChartsRotationGrid';
import { ChartsRadiusGrid } from './ChartsRadiusGrid';
import { useRotationAxes, useRadiusAxes } from '../hooks/useAxis';
import { EPSILON } from '../utils/epsilon';

const useUtilityClasses = ({ classes }: ChartsRadialGridProps) => {
  const slots = {
    root: ['root'],
    rotationLine: ['line', 'rotationLine'],
    radiusLine: ['line', 'radiusLine'],
  };

  return composeClasses(slots, getChartsRadialGridUtilityClass, classes);
};

export interface ChartsRadialGridProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
  /**
   * Displays rotation (spoke) grid.
   */
  rotation?: boolean;
  /**
   * Displays radius (concentric) grid.
   */
  radius?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsRadialGridClasses>;
}

/**
 * Demos:
 *
 * - [Radar](https://mui.com/x/react-charts/radar/)
 *
 * API:
 *
 * - [ChartsRadialGrid API](https://mui.com/x/api/charts/charts-radial-grid/)
 */
function ChartsRadialGrid(inProps: ChartsRadialGridProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiChartsRadialGrid' });

  const { className, rotation, radius, ...other } = props;
  const { rotationAxis, rotationAxisIds } = useRotationAxes();
  const { radiusAxis, radiusAxisIds } = useRadiusAxes();

  const classes = useUtilityClasses(props);

  const rotationAxisConfig = rotationAxis[rotationAxisIds[0]];
  const radiusAxisConfig = radiusAxis[radiusAxisIds[0]];

  const innerRadius = radiusAxisConfig?.scale.range()[0] ?? 0;
  const outerRadius = radiusAxisConfig?.scale.range()[1] ?? 0;

  const startAngle = rotationAxisConfig?.scale.range()[0] ?? 0;
  let endAngle = rotationAxisConfig?.scale.range()[1] ?? 0;

  if (rotationAxisConfig.scaleType === 'point') {
    // The rotation gap we add between the first and last point.
    const dataRotationGap = (2 * Math.PI) / rotationAxisConfig.data!.length;

    // The missing angle between the last and first point.
    const angleGap = 2 * Math.PI - Math.abs(endAngle - startAngle);
    if (Math.abs(angleGap - dataRotationGap) < EPSILON) {
      // If they are close enough we close the circle.
      // Otherwise it means user deliberately modified the angles and so keep it as it is.
      endAngle = startAngle + 2 * Math.PI;
    }
  }

  return (
    <GridRoot {...other} className={clsx(classes.root, className)}>
      {rotation && rotationAxisConfig && (
        <ChartsRotationGrid
          axis={rotationAxisConfig}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          classes={classes}
        />
      )}

      {radius && radiusAxisConfig && (
        <ChartsRadiusGrid
          axis={radiusAxisConfig}
          startAngle={startAngle}
          endAngle={endAngle}
          classes={classes}
        />
      )}
    </GridRoot>
  );
}

ChartsRadialGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Displays radius (concentric) grid.
   */
  radius: PropTypes.bool,
  /**
   * Displays rotation (spoke) grid.
   */
  rotation: PropTypes.bool,
} as any;

export { ChartsRadialGrid };
