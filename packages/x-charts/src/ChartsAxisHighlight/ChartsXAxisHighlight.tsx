'use client';
import * as React from 'react';
import { getValueToPositionMapper, useXScale } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsInteractionXAxisValue,
  UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
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

  const store = useStore<[UseChartCartesianAxisSignature]>();
  const axisXValue = useSelector(store, selectorChartsInteractionXAxisValue);

  const getXPosition = getValueToPositionMapper(xScale);

  const isBandScaleX = type === 'band' && axisXValue !== null && isBandScale(xScale);

  if (process.env.NODE_ENV !== 'production') {
    const isError = isBandScaleX && xScale(axisXValue) === undefined;

    if (isError) {
      console.error(
        [
          `MUI X Charts: The position value provided for the axis is not valid for the current scale.`,
          `This probably means something is wrong with the data passed to the chart.`,
          `The ChartsAxisHighlight component will not be displayed.`,
        ].join('\n'),
      );
    }
  }

  return (
    <React.Fragment>
      {isBandScaleX && xScale(axisXValue) !== undefined && (
        <ChartsAxisHighlightPath
          // @ts-expect-error, xScale value is checked in the statement above
          d={`M ${xScale(axisXValue) - (xScale.step() - xScale.bandwidth()) / 2} ${
            top
          } l ${xScale.step()} 0 l 0 ${height} l ${-xScale.step()} 0 Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      )}

      {type === 'line' && axisXValue !== null && (
        <ChartsAxisHighlightPath
          d={`M ${getXPosition(axisXValue)} ${top} L ${getXPosition(axisXValue)} ${top + height}`}
          className={classes.root}
          ownerState={{ axisHighlight: 'line' }}
        />
      )}
    </React.Fragment>
  );
}
