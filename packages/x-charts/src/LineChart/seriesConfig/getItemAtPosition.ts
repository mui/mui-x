import type { UseChartCartesianAxisSignature } from '../../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { ChartState } from '../../internals/plugins/models/chart';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors';
import { selectorAllSeriesOfType } from '../../internals/seriesSelectorOfType';
import type { ProcessedSeries } from '../../internals/plugins/corePlugins/useChartSeries';
import { getAxisIndex } from '../../internals/plugins/featurePlugins/useChartCartesianAxis/getAxisValue';
import type { SeriesItemIdentifierWithType } from '../../models/seriesType';
import { isOrdinalScale } from '../../internals/scaleGuards';
import { getAsNumber } from '../../internals/getAsNumber';
import { getValueToPositionMapper } from '../../hooks/getValueToPositionMapper';
import type { ComputedAxis } from '../../models/axis';
import { evaluateCurveY } from './curveEvaluation';

/**
 * For a continuous x-axis, find the two data indices that bracket the pointer's x position.
 * For ordinal axes, returns the single matching index (left === right).
 * Returns null if the pointer is outside the data range.
 */
function getBracketIndices(
  xAxis: ComputedAxis,
  pointX: number,
): { left: number; right: number } | null {
  const { scale, data: axisData } = xAxis;

  if (!axisData || axisData.length === 0) {
    return null;
  }

  if (isOrdinalScale(scale)) {
    const index = getAxisIndex(xAxis, pointX);
    if (index === -1) {
      return null;
    }

    const axisPointValue = getValueToPositionMapper(xAxis.scale)(axisData[index]);

    if (axisPointValue <= pointX) {
      return index === axisData.length - 1 ? null : { left: index, right: index + 1 };
    }
    return index === 0 ? null : { left: index - 1, right: index };
  }

  // For continuous axes, find the two adjacent data points surrounding pointX.
  const xValue = scale.invert(pointX);
  const xAsNumber = getAsNumber(xValue);

  // Find the rightmost index where data[i] <= xValue.
  let leftIndex = -1;
  for (let i = 0; i < axisData.length; i += 1) {
    if (getAsNumber(axisData[i]) <= xAsNumber) {
      leftIndex = i;
    } else {
      break;
    }
  }

  if (leftIndex === -1) {
    // Pointer is before the first data point.
    return null;
  }

  if (leftIndex === axisData.length - 1) {
    if (getAsNumber(axisData[leftIndex]) < xAsNumber) {
      // Pointer is strictly past the last data point — out of range.
      return null;
    }
    // Pointer is exactly on the last data point.
    return { left: leftIndex, right: leftIndex };
  }

  return { left: leftIndex, right: leftIndex + 1 };
}

/**
 * Compute the pixel y0 (baseline) for a given data point,
 * replicating the logic from useAreaPlotData.
 */
function getBaselinePixelY(
  baseline: number | 'min' | 'max' | undefined,
  yScale: ComputedAxis['scale'],
  stackedY0: number,
): number {
  if (typeof baseline === 'number') {
    return yScale(baseline) as number;
  }
  if (baseline === 'max') {
    return yScale.range()[1] as number;
  }
  if (baseline === 'min') {
    return yScale.range()[0] as number;
  }

  // Default: use the stacked baseline value.
  const value = yScale(stackedY0) as number;
  if (Number.isNaN(value)) {
    return yScale.range()[0] as number;
  }
  return value;
}

// Collect the pixel-coordinate points for a contiguous (non-null) segment
// of a series that contains the bracket indices.
//
// When connectNulls is true, all non-null points are returned.
// When connectNulls is false, only the contiguous run containing [left, right] is returned.
function collectCurvePoints(
  data: ArrayLike<number | null | undefined>,
  getPixelX: (index: number) => number,
  getPixelY: (index: number) => number | null,
  left: number,
  right: number,
  connectNulls: boolean | undefined,
): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];

  if (connectNulls) {
    // All non-null points form one continuous curve.
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] != null) {
        const y = getPixelY(i);
        if (y != null && !Number.isNaN(y)) {
          points.push({ x: getPixelX(i), y });
        }
      }
    }
    return points;
  }

  // Find the contiguous non-null run containing [left, right].
  let start = left;
  while (start > 0 && data[start - 1] != null) {
    start -= 1;
  }
  let end = right;
  while (end < data.length - 1 && data[end + 1] != null) {
    end += 1;
  }

  for (let i = start; i <= end; i += 1) {
    const y = getPixelY(i);
    if (y != null && !Number.isNaN(y)) {
      points.push({ x: getPixelX(i), y });
    }
  }
  return points;
}

/**
 * The maximum pixel distance from a line curve at which the line is still
 * considered "close enough" to be selected over an area.
 */
const LINE_PROXIMITY_THRESHOLD = 15;

export default function getItemAtPosition(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'line'> | undefined {
  if (!state.experimentalFeatures?.enablePositionBasedPointerInteraction) {
    return undefined;
  }

  const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(state);
  const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(state);
  const series = selectorAllSeriesOfType(state, 'line') as ProcessedSeries['line'];

  if (!series || series.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  // Step 1: Find the closest line (curve) across all series.
  let closestDistance = Infinity;
  let closestItem: SeriesItemIdentifierWithType<'line'> | undefined;

  for (const seriesId of series.seriesOrder) {
    const seriesItem = series.series[seriesId];

    if (seriesItem.hidden) {
      continue;
    }

    const xAxisId = seriesItem.xAxisId ?? defaultXAxisId;
    const yAxisId = seriesItem.yAxisId ?? defaultYAxisId;

    const xAxis = xAxes[xAxisId];
    const yAxis = yAxes[yAxisId];

    const bracket = getBracketIndices(xAxis, point.x);
    if (!bracket) {
      continue;
    }

    const { left, right } = bracket;
    const { visibleStackedData, data, connectNulls, curve } = seriesItem;

    if (!connectNulls && (data[left] == null || data[right] == null)) {
      continue;
    }
    const dataIndex = getAxisIndex(xAxis, point.x);
    if (dataIndex === -1) {
      continue;
    }

    // For ordinal or pointer exactly on a data point, use the data point directly.
    if (left === right) {
      const yValue = visibleStackedData[left]?.[1];
      if (yValue == null) {
        continue;
      }
      const yPosition = yAxis.scale(yValue);
      if (yPosition == null) {
        continue;
      }
      const distance = Math.abs(point.y - yPosition);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = { type: 'line', seriesId, dataIndex };
      }
      continue;
    }

    // Evaluate the actual curve at the pointer's x for precise distance.
    const xData = xAxis.data;
    if (!xData) {
      continue;
    }

    const xPosition = getValueToPositionMapper(xAxis.scale);
    const getPixelX = (idx: number) => xPosition(xData[idx]);

    const curvePoints = collectCurvePoints(
      data,
      getPixelX,
      (idx) => {
        const stacked = visibleStackedData[idx];
        return stacked ? (yAxis.scale(stacked[1]) as number) : null;
      },
      left,
      right,
      connectNulls,
    );

    if (curvePoints.length < 2) {
      continue;
    }

    const yPosition = evaluateCurveY(curvePoints, point.x, curve);
    if (yPosition == null) {
      continue;
    }

    const distance = Math.abs(point.y - yPosition);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = { type: 'line', seriesId, dataIndex };
    }
  }

  // Step 2: If the closest line is within the proximity threshold, pick it.
  if (
    closestItem &&
    closestDistance <= LINE_PROXIMITY_THRESHOLD &&
    !series.series[closestItem.seriesId].area
  ) {
    return closestItem;
  }

  // Step 3: Check area series — iterate stacking groups in reverse
  // so that topmost (last rendered) area is checked first.
  const { stackingGroups } = series;

  for (let g = stackingGroups.length - 1; g >= 0; g -= 1) {
    const groupIds = stackingGroups[g].ids;

    // Iterate in direct order cause the `useAreaPlotData` is already doing a reverse order.
    for (let i = 0; i < groupIds.length; i += 1) {
      const seriesId = groupIds[i];
      const seriesItem = series.series[seriesId];

      if (seriesItem.hidden || !seriesItem.area) {
        continue;
      }

      const xAxisId = seriesItem.xAxisId ?? defaultXAxisId;
      const yAxisId = seriesItem.yAxisId ?? defaultYAxisId;

      const xAxis = xAxes[xAxisId];
      const yAxis = yAxes[yAxisId];

      if (!xAxis || !yAxis) {
        continue;
      }

      const bracket = getBracketIndices(xAxis, point.x);
      if (!bracket) {
        continue;
      }

      const { left, right } = bracket;
      const { visibleStackedData, data, connectNulls, baseline, curve } = seriesItem;

      // Check for null gaps at bracket points.
      if ((data[left] == null || data[right] == null) && !connectNulls) {
        continue;
      }

      const xScale = xAxis.scale;
      const yScale = yAxis.scale;
      const xPosition = getValueToPositionMapper(xScale);
      const xData = xAxis.data;

      if (!xData) {
        continue;
      }

      const getPixelX = (idx: number) => xPosition(xData[idx]);

      // Build pixel-coordinate points for the top and bottom curves,
      // then evaluate them at the pointer's x using the actual d3 curve.
      const topPoints = collectCurvePoints(
        data,
        getPixelX,
        (idx) => {
          const stacked = visibleStackedData[idx];
          return stacked ? (yScale(stacked[1]) as number) : null;
        },
        left,
        right,
        connectNulls,
      );

      const bottomPoints = collectCurvePoints(
        data,
        getPixelX,
        (idx) => {
          const stacked = visibleStackedData[idx];
          return stacked ? getBaselinePixelY(baseline, yScale, stacked[0]) : null;
        },
        left,
        right,
        connectNulls,
      );

      if (topPoints.length < 2 || bottomPoints.length < 2) {
        continue;
      }

      const yTop = evaluateCurveY(topPoints, point.x, curve);
      const yBottom = evaluateCurveY(bottomPoints, point.x, curve);

      if (yTop == null || yBottom == null) {
        continue;
      }

      const yMin = Math.min(yBottom, yTop);
      const yMax = Math.max(yBottom, yTop);

      if (point.y >= yMin && point.y <= yMax) {
        const dataIndex = getAxisIndex(xAxis, point.x);
        return {
          type: 'line',
          seriesId,
          dataIndex: dataIndex === -1 ? left : dataIndex,
        };
      }
    }
  }

  // Step 4: No area matched — return the closest line regardless of threshold.
  return closestItem;
}
