'use client';
import * as React from 'react';
import { getValueToPositionMapper, useYScale } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  UseChartCartesianAxisSignature,
  selectorChartsInteractionYAxisValue,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
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

  const store = useStore<[UseChartCartesianAxisSignature]>();
  const axisYValue = useSelector(store, selectorChartsInteractionYAxisValue);

  const getYPosition = getValueToPositionMapper(yScale);

  const isBandScaleY = type === 'band' && axisYValue !== null && isBandScale(yScale);

  if (process.env.NODE_ENV !== 'production') {
    const isError = isBandScaleY && yScale(axisYValue) === undefined;

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
      {isBandScaleY && yScale(axisYValue) !== undefined && (
        <ChartsAxisHighlightPath
          d={`M ${left} ${
            // @ts-expect-error, yScale value is checked in the statement above
            yScale(axisYValue) - (yScale.step() - yScale.bandwidth()) / 2
          } l 0 ${yScale.step()} l ${width} 0 l 0 ${-yScale.step()} Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {type === 'line' && axisYValue !== null && (
        <ChartsAxisHighlightPath
          d={`M ${left} ${getYPosition(axisYValue)} L ${left + width} ${getYPosition(axisYValue)}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}
    </React.Fragment>
  );
}
