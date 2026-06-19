'use client';
import * as React from 'react';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useStore } from '../internals/store/useStore';
import {
  getSamplingBucketSize,
  getSamplingMinSpan,
  selectorChartsHighlightYAxisValue,
  selectorChartSamplingState,
  selectorChartYAxis,
  selectorChartZoomMap,
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
export default function ChartsYHighlight(props: {
  type: ChartsAxisHighlightType;
  classes: ChartsAxisHighlightClasses;
}) {
  const { type, classes } = props;

  const { left, width, height } = useDrawingArea();

  const store = useStore<[UseChartCartesianAxisSignature, UseChartBrushSignature]>();
  const axisYValues = store.use(selectorChartsHighlightYAxisValue);
  const yAxes = store.use(selectorChartYAxis);
  const samplingEnabled = store.use(selectorChartSamplingState)?.enabled ?? false;
  const zoomMap = store.use(selectorChartZoomMap);

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

    // When the bars are sampled, widen the band highlight to cover the whole merged bucket.
    let bandStart = 0;
    let bandSize = 0;
    if (isYScaleOrdinal) {
      const step = yScale.step();
      bandStart = yScale(value)! - (step - yScale.bandwidth()) / 2;
      bandSize = step;

      const data = yAxis.data;
      const zoom = zoomMap?.get(axisId);
      const bucketSize =
        samplingEnabled && data && zoom
          ? getSamplingBucketSize(
              zoom.end - zoom.start,
              getSamplingMinSpan(data.length, height),
              data.length,
            )
          : 1;
      if (bucketSize > 1 && data) {
        const index = data.indexOf(value);
        if (index >= 0) {
          const bucketStart = Math.floor(index / bucketSize) * bucketSize;
          const bucketEnd = Math.min(bucketStart + bucketSize - 1, data.length - 1);
          bandStart = yScale(data[bucketStart])! - (step - yScale.bandwidth()) / 2;
          bandSize = (bucketEnd - bucketStart + 1) * step;
        }
      }
    }

    return (
      <React.Fragment key={`${axisId}-${value}`}>
        {isYScaleOrdinal && yScale(value) !== undefined && (
          <ChartsAxisHighlightPath
            d={`M ${left} ${bandStart} l 0 ${bandSize} l ${width} 0 l 0 ${-bandSize} Z`}
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
