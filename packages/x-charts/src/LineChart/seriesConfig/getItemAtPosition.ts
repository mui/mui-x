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
import { getCurveFactory } from '../../internals/getCurve';

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

// --- Curve evaluation via d3 curve factories ---

/**
 * A captured path segment — either a straight line or a cubic bezier.
 */
interface CurveSegment {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** Control points for cubic bezier. Undefined for line segments. */
  cpx1?: number;
  cpy1?: number;
  cpx2?: number;
  cpy2?: number;
}

/**
 * A minimal d3 path context that captures line/bezier segments
 * instead of producing an SVG path string.
 */
class SegmentCapture {
  segments: CurveSegment[] = [];

  private cx = 0;

  private cy = 0;

  moveTo(x: number, y: number) {
    this.cx = x;
    this.cy = y;
  }

  lineTo(x: number, y: number) {
    this.segments.push({ x0: this.cx, y0: this.cy, x1: x, y1: y });
    this.cx = x;
    this.cy = y;
  }

  bezierCurveTo(cpx1: number, cpy1: number, cpx2: number, cpy2: number, x: number, y: number) {
    this.segments.push({
      x0: this.cx,
      y0: this.cy,
      cpx1,
      cpy1,
      cpx2,
      cpy2,
      x1: x,
      y1: y,
    });
    this.cx = x;
    this.cy = y;
  }

  closePath() {}
}

/** Evaluate a cubic Bezier at parameter t. */
function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const mt = 1 - t;
  return mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3;
}

/**
 * Find parameter t such that the segment's x(t) ≈ targetX using bisection.
 * 20 iterations gives ~1e-6 precision relative to the segment's x range.
 */
function findTForX(segment: CurveSegment, targetX: number): number {
  if (segment.cpx1 === undefined) {
    // Linear segment.
    const dx = segment.x1 - segment.x0;
    return dx === 0 ? 0 : (targetX - segment.x0) / dx;
  }

  // Cubic bezier — bisect.
  let lo = 0;
  let hi = 1;
  for (let iter = 0; iter < 20; iter += 1) {
    const mid = (lo + hi) / 2;
    const x = cubicBezier(mid, segment.x0, segment.cpx1, segment.cpx2!, segment.x1);
    if (x < targetX) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

/** Evaluate the segment's y at parameter t. */
function evaluateSegmentY(segment: CurveSegment, t: number): number {
  if (segment.cpx1 === undefined) {
    return segment.y0 + t * (segment.y1 - segment.y0);
  }
  return cubicBezier(t, segment.y0, segment.cpy1!, segment.cpy2!, segment.y1);
}

/**
 * Build the curve segments for a set of pixel-coordinate points
 * using d3's curve factory, then evaluate y at the given pixel x.
 *
 * Returns null if targetX is outside the curve's x range.
 */
function evaluateCurveY(
  points: Array<{ x: number; y: number }>,
  targetX: number,
  curveType?: CurveType,
): number | null {
  if (points.length === 0) {
    return null;
  }
  if (points.length === 1) {
    return points[0].y;
  }

  const capture = new SegmentCapture();
  const factory = getCurveFactory(curveType);
  const curveInstance = factory(capture as any);

  curveInstance.lineStart();
  for (const p of points) {
    curveInstance.point(p.x, p.y);
  }
  curveInstance.lineEnd();

  // Find the segment containing targetX.
  for (const segment of capture.segments) {
    const xMin = Math.min(segment.x0, segment.x1);
    const xMax = Math.max(segment.x0, segment.x1);

    if (targetX >= xMin - 0.5 && targetX <= xMax + 0.5) {
      const t = findTForX(segment, targetX);
      return evaluateSegmentY(segment, t);
    }
  }

  return null;
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

      if ((leftIsNull || rightIsNull) && !connectNulls) {
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

      if (left === right) {
        // Ordinal axis or pointer exactly on a data point.
        const stacked = visibleStackedData[left];
        if (!stacked) {
          continue;
        }
        const yBottom = getBaselinePixelY(baseline, yScale, stacked[0]);
        const yTop = yScale(stacked[1]) as number;
        if ([yBottom, yTop].some((v) => v == null || Number.isNaN(v))) {
          continue;
        }
        const yMin = Math.min(yBottom, yTop);
        const yMax = Math.max(yBottom, yTop);
        if (point.y >= yMin && point.y <= yMax) {
          return { type: 'line', seriesId, dataIndex: left };
        }
        continue;
      }

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

  // Pass 2: Fallback — use closest-distance-to-curve behavior for all series.
  // This covers non-area line series and also area series when the pointer
  // is outside the area polygon (for example, above the top line), which is needed
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

    const bracket = getBracketIndices(xAxis, point.x);
    if (!bracket) {
      continue;
    }

    const { left, right } = bracket;
    const { visibleStackedData, data, connectNulls, curve } = seriesItem;

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

  return closestItem;
}
