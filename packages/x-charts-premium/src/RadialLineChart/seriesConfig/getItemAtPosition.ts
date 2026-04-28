import { getValueToPositionMapper } from '@mui/x-charts/hooks';
import {
  type ChartState,
  type ProcessedSeries,
  type UseChartPolarAxisSignature,
  type ComputedAxis,
  type ChartsRadiusAxisProps,
  selectorAllSeriesOfType,
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  getPolarAxisIndex,
  isOrdinalScale,
  EPSILON,
} from '@mui/x-charts/internals';
import { evaluateCurveAtAngle, clampAngleRad } from '@mui/x-charts/internals';
import type { ScaleName, SeriesItemIdentifierWithType } from '@mui/x-charts/models';

/**
 * For a continuous rotation axis, find the two data indices that bracket the pointer's angle position.
 * For ordinal axes, returns the single matching index (left === right).
 * Returns null if the pointer is outside the data range.
 */
function getBracketIndices(
  rotationAxis: ComputedAxis,
  angle: number,
): { left: number; right: number } | null {
  const { scale, data: axisData } = rotationAxis;

  if (!axisData || axisData.length === 0) {
    return null;
  }

  if (isOrdinalScale(scale)) {
    const index = getPolarAxisIndex(rotationAxis, angle);
    if (index === -1) {
      return null;
    }

    const valueAngle = getValueToPositionMapper(scale)(axisData[index]);
    const gapAngle = clampAngleRad(angle - valueAngle);

    const [startAngle, endAngle] = scale.range();

    const isFullCircle =
      Math.abs(endAngle - startAngle + (scale.bandwidth() === 0 ? scale.step() : 0)) >=
      2 * Math.PI - EPSILON;

    if (gapAngle > Math.PI) {
      // We are between the previous and current rotation point.
      if (index === 0 && !isFullCircle) {
        return null; // Only relevant for band scales.
      }
      return { left: index > 0 ? index - 1 : axisData.length - 1, right: index };
    }

    // We are between the next and current rotation point.
    if (index === rotationAxis.data!.length - 1 && !isFullCircle) {
      return null; // Only relevant for band scales.
    }
    return { left: index, right: (index + 1) % axisData.length };
  }

  // For continuous axes, find the two adjacent data points surrounding pointX.
  const rotationValue = scale.invert(angle);
  const rotationAsNumber = rotationValue instanceof Date ? rotationValue.getTime() : rotationValue;

  const getAsNumber = (v: any) => (v instanceof Date ? v.getTime() : v);

  // Find the rightmost index where data[i] <= rotationValue.
  let leftIndex = -1;
  for (let i = 0; i < axisData.length; i += 1) {
    if (getAsNumber(axisData[i]) <= rotationAsNumber) {
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
 * Compute the r0 (baseline) for a given data point,
 * replicating the logic from useAreaPlotData.
 */
function getBaselineRadius(
  baseline: number | 'min' | 'max' | undefined,
  radiusScale: ComputedAxis['scale'],
  stackedY0: number,
): number {
  if (typeof baseline === 'number') {
    return radiusScale(baseline) as number;
  }
  if (baseline === 'max') {
    return radiusScale.range()[1] as number;
  }
  if (baseline === 'min') {
    return radiusScale.range()[0] as number;
  }
  // Default: use the stacked baseline value.
  const value = radiusScale(stackedY0) as number;
  if (Number.isNaN(value)) {
    return radiusScale.range()[0] as number;
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
  getPosition: (index: number) => { x: number; y: number; radius: number; rotation: number } | null,
  left: number,
  right: number,
  connectNulls: boolean | undefined,
): Array<{ x: number; y: number; radius: number; rotation: number }> {
  const points: Array<{ x: number; y: number; radius: number; rotation: number }> = [];

  if (connectNulls) {
    // All non-null points form one continuous curve.
    for (let i = 0; i < data.length; i += 1) {
      if (data[i] != null) {
        const position = getPosition(i);
        if (position != null && !Number.isNaN(position.y) && !Number.isNaN(position.x)) {
          points.push(position);
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
    const position = getPosition(i);
    if (position != null && !Number.isNaN(position.y) && !Number.isNaN(position.x)) {
      points.push(position);
    }
  }
  return points;
}

function isInRadiusRange(
  pointerRadius: number,
  radiusAxis: ComputedAxis<ScaleName, any, ChartsRadiusAxisProps>,
): boolean {
  const range = radiusAxis.scale.range();
  const minRadius = Math.min(range[0] as number, range[1] as number);
  const maxRadius = Math.max(range[0] as number, range[1] as number);
  return pointerRadius >= minRadius && pointerRadius <= maxRadius;
}
/**
 * The maximum pixel distance (in the radial direction) from a line at which
 * the line is still considered "close enough" to be selected over an area.
 */
const LINE_PROXIMITY_THRESHOLD = 15;

export default function getItemAtPosition(
  state: ChartState<[UseChartPolarAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'radialLine'> | undefined {
  const { axis: rotationAxes, axisIds: rotationAxisIds } = selectorChartRotationAxis(state);
  const { axis: radiusAxes, axisIds: radiusAxisIds } = selectorChartRadiusAxis(state);
  const center = selectorChartPolarCenter(state);
  const series = selectorAllSeriesOfType(state, 'radialLine') as ProcessedSeries['radialLine'];

  if (!series || series.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultRotationAxisId = rotationAxisIds[0];
  const defaultRadiusAxisId = radiusAxisIds[0];

  // Convert the pointer position to polar coordinates.
  const dx = point.x - center.cx;
  const dy = center.cy - point.y;
  const pointerRadius = Math.sqrt(dx * dx + dy * dy);
  const pointerAngle = Math.atan2(dx, dy);

  // Step 1: Find the closest line across all series (measured as radial distance).
  let closestDistance = Infinity;
  let closestItem: SeriesItemIdentifierWithType<'radialLine'> | undefined;

  for (const seriesId of series.seriesOrder) {
    const seriesItem = series.series[seriesId];

    if (seriesItem.hidden) {
      continue;
    }

    const rotationAxisId = seriesItem.rotationAxisId ?? defaultRotationAxisId;
    const radiusAxisId = seriesItem.radiusAxisId ?? defaultRadiusAxisId;

    const rotationAxis = rotationAxes[rotationAxisId];
    const radiusAxis = radiusAxes[radiusAxisId];

    if (!isInRadiusRange(pointerRadius, radiusAxis)) {
      continue;
    }
    const bracket = getBracketIndices(rotationAxis, pointerAngle);
    if (!bracket) {
      continue;
    }

    const { left, right } = bracket;
    const { visibleStackedData, data, connectNulls, curve } = seriesItem;

    const dataIndex = getPolarAxisIndex(rotationAxis, pointerAngle);
    if (dataIndex === -1) {
      continue;
    }

    // Evaluate the actual curve at the pointer's angle for precise distance.
    const rotationData = rotationAxis.data;
    if (!rotationData) {
      continue;
    }

    const rotationPosition = getValueToPositionMapper(rotationAxis.scale);
    const getRotation = (idx: number) => rotationPosition(rotationData[idx]);
    const getRadius = (idx: number) => {
      const stacked = visibleStackedData[idx];
      return stacked ? (radiusAxis.scale(stacked[1]) as number) : null;
    };
    const getPosition = (idx: number) => {
      const rotation = getRotation(idx);
      const radius = getRadius(idx);
      if (rotation == null || radius == null) {
        return null;
      }
      return {
        radius,
        rotation,
        // coordinate centered at (0, 0)
        x: radius * Math.sin(rotation),
        y: -radius * Math.cos(rotation),
      };
    };

    const curvePoints = collectCurvePoints(data, getPosition, left, right, connectNulls);

    if (curvePoints.length < 2) {
      continue;
    }

    const closestPoint = evaluateCurveAtAngle(curvePoints, pointerAngle, curve);
    if (closestPoint == null) {
      continue;
    }

    const distance = Math.abs(pointerRadius - Math.sqrt(closestPoint.x ** 2 + closestPoint.y ** 2));
    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = { type: 'radialLine', seriesId, dataIndex };
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

    for (let i = 0; i <= groupIds.length - 1; i += 1) {
      const seriesId = groupIds[i];
      const seriesItem = series.series[seriesId];

      if (seriesItem.hidden || !seriesItem.area) {
        continue;
      }

      const rotationAxisId = seriesItem.rotationAxisId ?? defaultRotationAxisId;
      const radiusAxisId = seriesItem.radiusAxisId ?? defaultRadiusAxisId;

      const rotationAxis = rotationAxes[rotationAxisId];
      const radiusAxis = radiusAxes[radiusAxisId];

      if (!rotationAxis || !radiusAxis) {
        continue;
      }

      const bracket = getBracketIndices(rotationAxis, pointerAngle);
      if (!bracket) {
        continue;
      }

      const { left, right } = bracket;
      const { visibleStackedData, data, connectNulls, baseline, curve } = seriesItem;

      // Check for null gaps at bracket points.
      if ((data[left] == null || data[right] == null) && !connectNulls) {
        continue;
      }

      const rotationScale = rotationAxis.scale;
      const radiusScale = radiusAxis.scale;
      const rotationPosition = getValueToPositionMapper(rotationScale);
      const rotationData = rotationAxis.data;

      if (!rotationData) {
        continue;
      }

      const getRotation = (idx: number) => rotationPosition(rotationData[idx]);

      const getRadius = (idx: number, position: 0 | 1) => {
        const stacked = visibleStackedData[idx];

        return position === 0
          ? getBaselineRadius(baseline, radiusScale, stacked ? stacked[0] : 0)
          : (radiusScale(stacked[1]) as number);
      };
      const getPosition = (position: 0 | 1) => (idx: number) => {
        const rotation = getRotation(idx);
        const radius = getRadius(idx, position);
        if (rotation == null || radius == null) {
          return null;
        }
        return {
          radius,
          rotation,
          // coordinate centered at (0, 0)
          x: radius * Math.sin(rotation),
          y: -radius * Math.cos(rotation),
        };
      };

      // Build pixel-coordinate points for the top and bottom curves,
      // then evaluate them at the pointer's x using the actual d3 curve.
      const topPoints = collectCurvePoints(data, getPosition(1), left, right, connectNulls);

      const bottomPoints = collectCurvePoints(data, getPosition(0), left, right, connectNulls);

      if (topPoints.length < 2 || bottomPoints.length < 2) {
        continue;
      }

      const outerPoint = evaluateCurveAtAngle(topPoints, pointerAngle, curve);
      const innerPoint = evaluateCurveAtAngle(bottomPoints, pointerAngle, curve);

      if (outerPoint == null || innerPoint == null) {
        continue;
      }

      const innerRadius = Math.sqrt(innerPoint.x ** 2 + innerPoint.y ** 2);
      const outerRadius = Math.sqrt(outerPoint.x ** 2 + outerPoint.y ** 2);
      const radiusMin = Math.min(innerRadius, outerRadius);
      const radiusMax = Math.max(innerRadius, outerRadius);

      if (pointerRadius >= radiusMin && pointerRadius <= radiusMax) {
        const dataIndex = getPolarAxisIndex(rotationAxis, pointerAngle);
        return {
          type: 'radialLine',
          seriesId,
          dataIndex: dataIndex === -1 ? left : dataIndex,
        };
      }
    }
  }

  // Step 4: No area matched — return the closest line regardless of threshold.
  return closestItem;
}
