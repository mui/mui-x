import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';

import { CartesianContext } from '../context/CartesianContextProvider';
import { useTicks } from '../hooks/useTicks';
import {
  ChartsGridClasses,
  getChartsGridUtilityClass,
  chartsGridClasses,
} from './chartsGridClasses';

const GridRoot = styled('g', {
  name: 'MuiChartsGrid',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${chartsGridClasses.line}`]: {
    stroke: (theme.vars || theme).palette.divider,
    shapeRendering: 'crispEdges',
    strokeWidth: 1,
  },
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
  const { vertical, horizontal, ...other } = props;
  const { xAxis, xAxisIds, yAxis, yAxisIds } = React.useContext(CartesianContext);

  const classes = useUtilityClasses(props);

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
          <line
            key={`vertical-${formattedValue}`}
            y1={yScale.range()[0]}
            y2={yScale.range()[1]}
            x1={offset}
            x2={offset}
            className={classes.verticalLine}
          />
        ))}
      {horizontal &&
        yTicks.map(({ formattedValue, offset }) => (
          <line
            key={`horizontal-${formattedValue}`}
            y1={offset}
            y2={offset}
            x1={xScale.range()[0]}
            x2={xScale.range()[1]}
            className={classes.horizontalLine}
          />
        ))}
    </GridRoot>
  );
}

ChartsGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
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
