'use client';
import * as React from 'react';
import { getValueToPositionMapper, useXScale } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/useSelector';
import { useStore } from '../internals/useStore';
import { selectorChartsInteractionXAxis } from '../context/InteractionSelectors';
import { useDrawingArea } from '../hooks';
import { ChartsAxisHighlightType } from './ChartsAxisHighlight.types';
import { ChartsAxisHighlightClasses } from './chartsAxisHighlightClasses';
import { ChartsAxisHighlightPath } from './ChartsAxisHighlightPath';

/**
 * @ignore - internal component.
 */
export default function ChartsXHighlight(props: {
  type: ChartsAxisHighlightType;
  classes: ChartsAxisHighlightClasses;
}) {
  const { type, classes } = props;

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
