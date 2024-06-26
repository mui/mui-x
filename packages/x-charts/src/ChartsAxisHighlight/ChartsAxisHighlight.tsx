import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { styled } from '@mui/material/styles';
import { InteractionContext } from '../context/InteractionProvider';
import { useCartesianContext } from '../context/CartesianProvider';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';

export interface ChartsAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChartsAxisHighlightClassKey = keyof ChartsAxisHighlightClasses;

export function getAxisHighlightUtilityClass(slot: string) {
  return generateUtilityClass('MuiChartsAxisHighlight', slot);
}

export const chartsAxisHighlightClasses: ChartsAxisHighlightClasses = generateUtilityClasses(
  'MuiChartsAxisHighlight',
  ['root'],
);

const useUtilityClasses = () => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getAxisHighlightUtilityClass);
};

export const ChartsAxisHighlightPath = styled('path', {
  name: 'MuiChartsAxisHighlight',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})<{ ownerState: { axisHighlight: AxisHighlight } }>(({ ownerState, theme }) => ({
  pointerEvents: 'none',
  ...(ownerState.axisHighlight === 'band' && {
    fill: theme.palette.mode === 'light' ? 'gray' : 'white',
    fillOpacity: 0.1,
  }),
  ...(ownerState.axisHighlight === 'line' && {
    strokeDasharray: '5 2',
    stroke: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
  }),
}));

type AxisHighlight = 'none' | 'line' | 'band';

export type ChartsAxisHighlightProps = {
  x?: AxisHighlight;
  y?: AxisHighlight;
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
  const { xAxisIds, xAxis, yAxisIds, yAxis } = useCartesianContext();
  const classes = useUtilityClasses();

  const USED_X_AXIS_ID = xAxisIds[0];
  const USED_Y_AXIS_ID = yAxisIds[0];

  const xScale = xAxis[USED_X_AXIS_ID].scale;
  const yScale = yAxis[USED_Y_AXIS_ID].scale;

  const { axis } = React.useContext(InteractionContext);

  const getXPosition = getValueToPositionMapper(xScale);
  const getYPosition = getValueToPositionMapper(yScale);

  return (
    <React.Fragment>
      {xAxisHighlight === 'band' && axis.x !== null && isBandScale(xScale) && (
        <ChartsAxisHighlightPath
          d={`M ${(xScale(axis.x.value) ?? 0) - (xScale.step() - xScale.bandwidth()) / 2} ${
            yScale.range()[0]
          } l ${xScale.step()} 0 l 0 ${
            yScale.range()[1] - yScale.range()[0]
          } l ${-xScale.step()} 0 Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {yAxisHighlight === 'band' && axis.y !== null && isBandScale(yScale) && (
        <ChartsAxisHighlightPath
          d={`M ${xScale.range()[0]} ${
            (yScale(axis.y.value) ?? 0) - (yScale.step() - yScale.bandwidth()) / 2
          } l 0 ${yScale.step()} l ${
            xScale.range()[1] - xScale.range()[0]
          } 0 l 0 ${-yScale.step()} Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {xAxisHighlight === 'line' && axis.x !== null && (
        <ChartsAxisHighlightPath
          d={`M ${getXPosition(axis.x.value)} ${yScale.range()[0]} L ${getXPosition(
            axis.x.value,
          )} ${yScale.range()[1]}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}

      {yAxisHighlight === 'line' && axis.y !== null && (
        <ChartsAxisHighlightPath
          d={`M ${xScale.range()[0]} ${getYPosition(axis.y.value)} L ${
            xScale.range()[1]
          } ${getYPosition(axis.y.value)}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}
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
