import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled, useThemeProps } from '@mui/material/styles';

import { useCartesianContext } from '../context/CartesianProvider';
import { useTicks } from '../hooks/useTicks';
import {
  ChartsGridClasses,
  getChartsGridUtilityClass,
  chartsGridClasses,
} from './chartsGridClasses';
import { useDrawingArea } from '../hooks/useDrawingArea';

const GridRoot = styled('g', {
  name: 'MuiChartsGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => [
    { [`&.${chartsGridClasses.verticalLine}`]: styles.verticalLine },
    { [`&.${chartsGridClasses.horizontalLine}`]: styles.horizontalLine },
    styles.root,
  ],
})({});

const GridLine = styled('line', {
  name: 'MuiChartsGrid',
  slot: 'Line',
  overridesResolver: (props, styles) => styles.line,
})(({ theme }) => ({
  stroke: (theme.vars || theme).palette.divider,
  shapeRendering: 'crispEdges',
  strokeWidth: 1,
}));

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
function ChartsGrid(props: ChartsGridProps) {
  const themeProps = useThemeProps({ props, name: 'MuiChartsGrid' });

  const drawingArea = useDrawingArea();
  const { vertical, horizontal, ...other } = themeProps;
  const { xAxis, xAxisIds, yAxis, yAxisIds } = useCartesianContext();

  const classes = useUtilityClasses(themeProps);

  const horizontalAxisId = yAxisIds[0];
  const verticalAxisId = xAxisIds[0];

  const {
    scale: xScale,
    tickNumber: xTickNumber,
    tickInterval: xTickInterval,
  } = xAxis[verticalAxisId];

  const {
    scale: yScale,
    tickNumber: yTickNumber,
    tickInterval: yTickInterval,
  } = yAxis[horizontalAxisId];

  const xTicks = useTicks({ scale: xScale, tickNumber: xTickNumber, tickInterval: xTickInterval });
  const yTicks = useTicks({ scale: yScale, tickNumber: yTickNumber, tickInterval: yTickInterval });

  return (
    <GridRoot {...other} className={classes.root}>
      {vertical &&
        xTicks.map(({ formattedValue, offset }) => (
          <GridLine
            key={`vertical-${formattedValue}`}
            y1={drawingArea.top}
            y2={drawingArea.top + drawingArea.height}
            x1={offset}
            x2={offset}
            className={classes.verticalLine}
          />
        ))}
      {horizontal &&
        yTicks.map(({ formattedValue, offset }) => (
          <GridLine
            key={`horizontal-${formattedValue}`}
            y1={offset}
            y2={offset}
            x1={drawingArea.left}
            x2={drawingArea.left + drawingArea.width}
            className={classes.horizontalLine}
          />
        ))}
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
