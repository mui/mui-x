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
})<{ ownerState: { axisHighlight: AxisHighlight } }>(({ theme }) => ({
  pointerEvents: 'none',
  variants: [
    {
      props: {
        axisHighlight: 'band',
      },
      style: {
        fill: 'white',
        fillOpacity: 0.1,
        ...theme.applyStyles('light', {
          fill: 'gray',
        }),
      },
    },
    {
      props: {
        axisHighlight: 'line',
      },
      style: {
        strokeDasharray: '5 2',
        stroke: '#ffffff',
        ...theme.applyStyles('light', {
          stroke: '#000000',
        }),
      },
    },
  ],
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

  const axisX = axis.x;
  const axisY = axis.y;

  const isBandScaleX = xAxisHighlight === 'band' && axisX !== null && isBandScale(xScale);
  const isBandScaleY = yAxisHighlight === 'band' && axisY !== null && isBandScale(yScale);

  if (process.env.NODE_ENV !== 'production') {
    const isXError = isBandScaleX && xScale(axisX.value) === undefined;
    const isYError = isBandScaleY && yScale(axisY.value) === undefined;

    if (isXError || isYError) {
      console.error(
        [
          `MUI X: The position value provided for the axis is not valid for the current scale.`,
          `This probably means something is wrong with the data passed to the chart.`,
          `The ChartsAxisHighlight component will not be displayed.`,
        ].join('\n'),
      );
    }
  }

  return (
    <React.Fragment>
      {isBandScaleX && xScale(axisX.value) !== undefined && (
        <ChartsAxisHighlightPath
          // @ts-expect-error, xScale value is checked in the statement above
          d={`M ${xScale(axisX.value) - (xScale.step() - xScale.bandwidth()) / 2} ${
            yScale.range()[0]
          } l ${xScale.step()} 0 l 0 ${
            yScale.range()[1] - yScale.range()[0]
          } l ${-xScale.step()} 0 Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {isBandScaleY && yScale(axisY.value) !== undefined && (
        <ChartsAxisHighlightPath
          d={`M ${xScale.range()[0]} ${
            // @ts-expect-error, yScale value is checked in the statement above
            yScale(axisY.value) - (yScale.step() - yScale.bandwidth()) / 2
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
