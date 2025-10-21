'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useChartStore } from '../internals/store/useChartStore';
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

  const store = useChartStore<[UseChartCartesianAxisSignature]>();
  const axisYValues = useStore(store, selectorChartsHighlightYAxisValue);
  const yAxes = useStore(store, selectorChartYAxis);

  if (axisYValues.length === 0) {
    return null;
  }

  return axisYValues.map(({ axisId, value }) => {
    const yAxis = yAxes.axis[axisId];
    const yScale = yAxis.scale;
    const getYPosition = getValueToPositionMapper(yScale);

    const isYScaleOrdinal = type === 'band' && value !== null && isOrdinalScale(yScale);

    if (process.env.NODE_ENV !== 'production') {
      const isError = isYScaleOrdinal && yScale(value) === undefined;

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
        {isYScaleOrdinal && yScale(value) !== undefined && (
          <ChartsAxisHighlightPath
            d={`M ${left} ${
              yScale(value)! - (yScale.step() - yScale.bandwidth()) / 2
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
