'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { styled } from '@mui/material/styles';
import { useStore } from '../context/InteractionProvider';

import { getValueToPositionMapper, useXScale, useYScale } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/useSelector';
import {
  selectorChartsInteractionXAxis,
  selectorChartsInteractionYAxis,
} from '../context/InteractionSelectors';
import { useDrawingArea } from '../hooks';

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

function ChartsXHighlight(props: { type: AxisHighlight }) {
  const { type } = props;

  const classes = useUtilityClasses();

  const { top, height } = useDrawingArea();

  const xScale = useXScale();

  const store = useStore();
  const axisX = useSelector(store, selectorChartsInteractionXAxis);

  const getXPosition = getValueToPositionMapper(xScale);

  const isBandScaleX = type === 'band' && axisX !== null && isBandScale(xScale);

  if (process.env.NODE_ENV !== 'production') {
    const isError = isBandScaleX && xScale(axisX.value) === undefined;

    if (isError) {
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
            top
          } l ${xScale.step()} 0 l 0 ${height} l ${-xScale.step()} 0 Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {type === 'line' && axisX !== null && (
        <ChartsAxisHighlightPath
          d={`M ${getXPosition(axisX.value)} ${top} L ${getXPosition(axisX.value)} ${top + height}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}
    </React.Fragment>
  );
}

ChartsXHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  type: PropTypes.oneOf(['band', 'line', 'none']).isRequired,
} as any;

function ChartsYHighlight(props: { type: AxisHighlight }) {
  const { type } = props;

  const classes = useUtilityClasses();

  const { left, width } = useDrawingArea();

  const yScale = useYScale();

  const store = useStore();
  const axisY = useSelector(store, selectorChartsInteractionYAxis);

  const getYPosition = getValueToPositionMapper(yScale);

  const isBandScaleY = type === 'band' && axisY !== null && isBandScale(yScale);

  if (process.env.NODE_ENV !== 'production') {
    const isError = isBandScaleY && yScale(axisY.value) === undefined;

    if (isError) {
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
      {isBandScaleY && yScale(axisY.value) !== undefined && (
        <ChartsAxisHighlightPath
          d={`M ${left} ${
            // @ts-expect-error, yScale value is checked in the statement above
            yScale(axisY.value) - (yScale.step() - yScale.bandwidth()) / 2
          } l 0 ${yScale.step()} l ${width} 0 l 0 ${-yScale.step()} Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {type === 'line' && axisY !== null && (
        <ChartsAxisHighlightPath
          d={`M ${left} ${getYPosition(axisY.value)} L ${left + width} ${getYPosition(
            axisY.value,
          )}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}
    </React.Fragment>
  );
}

/**
 * Demos:
 *
 * - [Custom components](https://mui.com/x/react-charts/components/)
 *
 * API:
 *
 * - [ChartsAxisHighlight API](https://mui.com/x/api/charts/charts-axis-highlight/)
 */

ChartsYHighlight.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  type: PropTypes.oneOf(['band', 'line', 'none']).isRequired,
} as any;

function ChartsAxisHighlight(props: ChartsAxisHighlightProps) {
  const { x: xAxisHighlight, y: yAxisHighlight } = props;

  return (
    <React.Fragment>
      {xAxisHighlight && <ChartsXHighlight type={xAxisHighlight} />}
      {yAxisHighlight && <ChartsYHighlight type={yAxisHighlight} />}
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
