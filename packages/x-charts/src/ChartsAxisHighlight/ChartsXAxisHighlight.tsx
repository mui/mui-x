'use client';
import * as React from 'react';
import { getValueToPositionMapper } from '../hooks/useScale';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsHighlightXAxisValue,
  selectorChartXAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { useDrawingArea } from '../hooks';
import { type ChartsAxisHighlightType } from './ChartsAxisHighlight.types';
import { type ChartsAxisHighlightClasses } from './chartsAxisHighlightClasses';
import { ChartsAxisHighlightPath } from './ChartsAxisHighlightPath';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';

/**
 * @ignore - internal component.
 */
export default function ChartsXHighlight(props: {
  type: ChartsAxisHighlightType;
  classes: ChartsAxisHighlightClasses;
}) {
  const { type, classes } = props;

  const { top, height } = useDrawingArea();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const axisXValues = store.use(selectorChartsHighlightXAxisValue);
  const xAxes = store.use(selectorChartXAxis);

  if (axisXValues.length === 0) {
    return null;
  }

  return axisXValues.map(({ axisId, value }) => {
    const xAxis = xAxes.axis[axisId];

    const xScale = xAxis.scale;
    const getXPosition = getValueToPositionMapper(xScale);

    const isXScaleOrdinal = type === 'band' && value !== null && isOrdinalScale(xScale);

    if (process.env.NODE_ENV !== 'production') {
      const isError = isXScaleOrdinal && xScale(value) === undefined;

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
        {isXScaleOrdinal && xScale(value) !== undefined && (
          <ChartsAxisHighlightPath
            d={`M ${xScale(value)! - (xScale.step() - xScale.bandwidth()) / 2} ${
              top
            } l ${xScale.step()} 0 l 0 ${height} l ${-xScale.step()} 0 Z`}
            className={classes.root}
            ownerState={{ axisHighlight: 'band' }}
          />
        )}

        {type === 'line' && value !== null && (
          <ChartsAxisHighlightPath
            d={`M ${getXPosition(value)} ${top} L ${getXPosition(value)} ${top + height}`}
            className={classes.root}
            ownerState={{ axisHighlight: 'line' }}
          />
        )}
      </React.Fragment>
    );
  });
}
