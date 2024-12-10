'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { useThemeProps } from '@mui/material/styles';
import { useCartesianContext } from '../context/CartesianProvider';
import { ChartsGridClasses, getChartsGridUtilityClass } from './chartsGridClasses';
import { useDrawingArea } from '../hooks/useDrawingArea';
import { GridRoot } from './styledComponents';
import { ChartsGridVertical } from './ChartsVerticalGrid';
import { ChartsGridHorizontal } from './ChartsHorizontalGrid';

const useUtilityClasses = ({ classes }: ChartsGridProps) => {
  const slots = {
    root: ['root'],
    verticalLine: ['line', 'verticalLine'],
    horizontalLine: ['line', 'horizontalLine'],
  };

  return composeClasses(slots, getChartsGridUtilityClass, classes);
};

export interface ChartsGridProps {
  /**
   * Displays vertical grid.
   */
  vertical?: boolean;
  /**
   * Displays horizontal grid.
   */
  horizontal?: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsGridClasses>;
}

/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsGrid API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsGrid(inProps: ChartsGridProps) {
  const props = useThemeProps({ props: inProps, name: 'MuiChartsGrid' });

  const drawingArea = useDrawingArea();
  const { vertical, horizontal, ...other } = props;
  const { xAxis, xAxisIds, yAxis, yAxisIds } = useCartesianContext();

  const classes = useUtilityClasses(props);

  const horizontalAxis = yAxis[yAxisIds[0]];
  const verticalAxis = xAxis[xAxisIds[0]];

  return (
    <GridRoot {...other} className={classes.root}>
      {vertical && (
        <ChartsGridVertical axis={verticalAxis} drawingArea={drawingArea} classes={classes} />
      )}

      {horizontal && (
        <ChartsGridHorizontal axis={horizontalAxis} drawingArea={drawingArea} classes={classes} />
      )}
    </GridRoot>
  );
}

ChartsGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Displays horizontal grid.
   */
  horizontal: PropTypes.bool,
  /**
   * Displays vertical grid.
   */
  vertical: PropTypes.bool,
} as any;

export { ChartsGrid };
