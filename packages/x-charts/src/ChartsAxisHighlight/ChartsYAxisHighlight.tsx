'use client';
import * as React from 'react';
import { getValueToPositionMapper } from '../hooks/getValueToPositionMapper';
import { isOrdinalScale } from '../internals/scaleGuards';
import { useStore } from '../internals/store/useStore';
import {
  selectorChartsHighlightYAxisValue,
  selectorChartYAxis,
  type UseChartCartesianAxisSignature,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorChartsInteractionPointerY } from '../internals/plugins/featurePlugins/useChartInteraction';
import { selectorChartBarSampledBandIndices } from '../internals/seriesRenderedSelector';
import {
  getBarSampledSlots,
  getBarSampledSlotAtCoordinate,
  getBarSampledSlotPosition,
} from '../internals/barSampledSlot';
import { useDrawingArea } from '../hooks';
import { type ChartsAxisHighlightType } from './ChartsAxisHighlight.types';
import { type ChartsAxisHighlightClasses } from './chartsAxisHighlightClasses';
import { ChartsAxisHighlightPath } from './ChartsAxisHighlightPath';
import type { UseChartBrushSignature } from '../internals/plugins/featurePlugins/useChartBrush';
import type { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction';

/**
 * @ignore - internal component.
 */
export default function ChartsYHighlight(props: {
  type: ChartsAxisHighlightType;
  classes: ChartsAxisHighlightClasses;
}) {
  const { type, classes } = props;

  const { left, width } = useDrawingArea();

  const store =
    useStore<
      [UseChartCartesianAxisSignature, UseChartBrushSignature, UseChartInteractionSignature]
    >();
  const axisYValues = store.use(selectorChartsHighlightYAxisValue);
  const yAxes = store.use(selectorChartYAxis);
  const sampledBandIndices = store.use(selectorChartBarSampledBandIndices);
  const pointerY = store.use(selectorChartsInteractionPointerY);

  if (axisYValues.length === 0) {
    return null;
  }

  return axisYValues.map(({ axisId, value }) => {
    const yAxis = yAxes.axis[axisId];
    const yScale = yAxis.scale;
    const getYPosition = getValueToPositionMapper(yScale);

    // Sampled bars sit on a uniform slot grid, so highlight the slot under the pointer.
    const sampledIndices = sampledBandIndices.y[axisId];
    if (type === 'band' && sampledIndices !== undefined && pointerY !== null) {
      const slots = getBarSampledSlots(yScale.range(), sampledIndices.length);
      const cursor = getBarSampledSlotAtCoordinate(slots, pointerY);
      const { position, thickness } = getBarSampledSlotPosition(slots, cursor);
      return (
        <ChartsAxisHighlightPath
          key={`${axisId}-${value}`}
          d={`M ${left} ${position} l 0 ${thickness} l ${width} 0 l 0 ${-thickness} Z`}
          className={classes.root}
          ownerState={{ axisHighlight: 'band' }}
        />
      );
    }

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
