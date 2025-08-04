'use client';
import * as React from 'react';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isBandScale } from '../internals/isBandScale';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsHighlightYAxisValue,
  selectorChartYAxis,
  UseChartCartesianAxisSignature,
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

  const store = useStore<[UseChartCartesianAxisSignature]>();
  const axisYValues = useSelector(store, selectorChartsHighlightYAxisValue);
  const yAxes = useSelector(store, selectorChartYAxis);

  if (axisYValues.length === 0) {
    return null;
  }

  return axisYValues.map(({ axisId, value }) => {
    const yAxis = yAxes.axis[axisId];
    const yScale = yAxis.scale;
    const getYPosition = getValueToPositionMapper(yScale);

    const isBandScaleY = type === 'band' && value !== null && isBandScale(yScale);

    if (process.env.NODE_ENV !== 'production') {
      const isError = isBandScaleY && yScale(value) === undefined;

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
      <React.Fragment key={`${axisId}-${value}`}>
        {isBandScaleY && yScale(value) !== undefined && (
          <ChartsAxisHighlightPath
            d={`M ${left} ${
              // @ts-expect-error, yScale value is checked in the statement above
              yScale(value) - (yScale.step() - yScale.bandwidth()) / 2
            } l 0 ${yScale.step()} l ${width} 0 l 0 ${-yScale.step()} Z`}
            className={classes.root}
            ownerState={{ axisHighlight: 'band' }}
          />
        )}

        {type === 'line' && value !== null && (
          <ChartsAxisHighlightPath
            d={`M ${left} ${getYPosition(value)} L ${left + width} ${getYPosition(value)}`}
            className={classes.root}
            ownerState={{ axisHighlight: 'line' }}
          />
        )}
      </React.Fragment>
    );
  });
}
