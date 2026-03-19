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
import { getValueToPositionMapper } from '../../hooks/getValueToPositionMapper';
import type { ComputedAxis } from '../../models/axis';
import type { CurveType } from '../../models/curve';

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
    return { left: index, right: index };
  }

  // For continuous axes, find the two adjacent data points surrounding pointX.
  const xValue = scale.invert(pointX);
  const xAsNumber = xValue instanceof Date ? xValue.getTime() : xValue;

  const getAsNumber = (v: any) => (v instanceof Date ? v.getTime() : v);

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
    // Pointer is at or after the last data point — check if it's close enough.
    return { left: leftIndex, right: leftIndex };
  }

  return { left: leftIndex, right: leftIndex + 1 };
}

/**
 * Interpolate the y value between two points, accounting for step curves.
 * For step curves, the value switches at midpoint/start/end depending on the variant.
 */
function interpolateY(
  yLeft: number,
  yRight: number,
  t: number,
  curve?: CurveType,
): number {
  if (curve === 'stepAfter') {
    // Use left value until we reach the right point.
    return yLeft;
  }
  if (curve === 'stepBefore') {
    // Use right value for the entire segment.
    return yRight;
  }
  if (curve === 'step') {
    // Switch at midpoint.
    return t < 0.5 ? yLeft : yRight;
  }
  // Linear interpolation for all other curves (linear, monotoneX, etc.)
  // This is an approximation for non-linear curves, but good enough for hit detection.
  return yLeft + t * (yRight - yLeft);
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

export default function getItemAtPosition(
  state: ChartState<[UseChartCartesianAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'line'> | undefined {
  const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(state);
  const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(state);
  const series = selectorAllSeriesOfType(state, 'line') as ProcessedSeries['line'];

  if (!series || series.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  // Pass 1: Check area series (priority) — iterate stacking groups in reverse
  // so that topmost (last rendered) area is checked first.
  const { stackingGroups } = series;

  for (let g = stackingGroups.length - 1; g >= 0; g -= 1) {
    const groupIds = stackingGroups[g].ids;

    // Iterate in reverse so the topmost stacked area is checked first.
    for (let i = groupIds.length - 1; i >= 0; i -= 1) {
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
      const leftIsNull = data[left] == null;
      const rightIsNull = data[right] == null;

      if (leftIsNull && rightIsNull) {
        continue;
      }

      // Handle null gaps: if connectNulls, find the nearest non-null points to bridge.
      let effectiveLeft = left;
      let effectiveRight = right;

      if (leftIsNull || rightIsNull) {
        if (!connectNulls) {
          continue;
        }
        // Find nearest non-null points.
        if (leftIsNull) {
          for (let j = left - 1; j >= 0; j -= 1) {
            if (data[j] != null) {
              effectiveLeft = j;
              break;
            }
          }
          if (data[effectiveLeft] == null) {
            continue;
          }
        }
        if (rightIsNull) {
          for (let j = right + 1; j < data.length; j += 1) {
            if (data[j] != null) {
              effectiveRight = j;
              break;
            }
          }
          if (data[effectiveRight] == null) {
            continue;
          }
        }
      }

      const xScale = xAxis.scale;
      const yScale = yAxis.scale;
      const xPosition = getValueToPositionMapper(xScale);
      const xData = xAxis.data;

      if (!xData) {
        continue;
      }

      const xLeft = xPosition(xData[effectiveLeft]);
      const xRight = effectiveLeft === effectiveRight ? xLeft : xPosition(xData[effectiveRight]);

      // Get stacked y values (y0 = baseline, y1 = top) for each bracket point.
      const stackedLeft = visibleStackedData[effectiveLeft];
      const stackedRight = visibleStackedData[effectiveRight];

      if (!stackedLeft || !stackedRight) {
        continue;
      }

      const y0Left = getBaselinePixelY(baseline, yScale, stackedLeft[0]);
      const y1Left = yScale(stackedLeft[1]) as number;
      const y0Right = getBaselinePixelY(baseline, yScale, stackedRight[0]);
      const y1Right = yScale(stackedRight[1]) as number;

      if ([y0Left, y1Left, y0Right, y1Right].some((v) => v == null || Number.isNaN(v))) {
        continue;
      }

      let yBottom: number;
      let yTop: number;

      if (effectiveLeft === effectiveRight) {
        // Ordinal axis or pointer exactly on a data point.
        yBottom = y0Left;
        yTop = y1Left;
      } else {
        // Interpolate between the two bracket points.
        const xRange = xRight - xLeft;
        const t = xRange === 0 ? 0 : (point.x - xLeft) / xRange;

        yBottom = interpolateY(y0Left, y0Right, t, curve);
        yTop = interpolateY(y1Left, y1Right, t, curve);
      }

      // Account for inverted y-axis (screen coordinates: y increases downward).
      const yMin = Math.min(yBottom, yTop);
      const yMax = Math.max(yBottom, yTop);

      if (point.y >= yMin && point.y <= yMax) {
        // Return the nearest data index within the bracket.
        const dataIndex = getAxisIndex(xAxis, point.x);
        return {
          type: 'line',
          seriesId,
          dataIndex: dataIndex === -1 ? effectiveLeft : dataIndex,
        };
      }
    }
  }

  // Pass 2: Fallback — use closest-distance-to-point behavior for all series.
  // This covers non-area line series and also area series when the pointer
  // is outside the area polygon (e.g. above the top line), which is needed
  // for tooltips with trigger='item' to still work.
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

    const dataIndex = getAxisIndex(xAxis, point.x);

    if (dataIndex === -1) {
      continue;
    }

    const yValue = seriesItem.visibleStackedData[dataIndex]?.[1];

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
      closestItem = {
        type: 'line',
        seriesId,
        dataIndex,
      };
    }
  }

  return closestItem;
}
