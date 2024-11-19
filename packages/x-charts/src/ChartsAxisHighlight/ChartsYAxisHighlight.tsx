'use client';
import * as React from 'react';
import { getValueToPositionMapper, useYScale } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/useSelector';
import { useStore } from '../internals/useStore';
import { selectorChartsInteractionYAxis } from '../context/InteractionSelectors';
import { useDrawingArea } from '../hooks';
import { ChartsAxisHighlightType } from './ChartsAxisHighlight.types';
import { ChartsAxisHighlightClasses } from './chartsAxisHighlightClasses';
import { ChartsAxisHighlightPath } from './ChartsAxisHighlightPath';

/**
 * @ignore - internal component.
 */
export default function ChartsYHighlight(props: {
  type: ChartsAxisHighlightType;
  classes: ChartsAxisHighlightClasses;
}) {
  const { type, classes } = props;

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
