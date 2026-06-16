import { type ScatterValueType } from '../../../../models/seriesType/scatter';
import { type Flatbush } from '../../../Flatbush';
import { type D3Scale } from '../../../../models/axis';
import { isOrdinalScale } from '../../../scaleGuards';

// Arbitrary large number to be sure we don't pull the entire dataset from flatbush when radius is not fixed.
const LARGE_NUMBER = 50;

export function findClosestPoints(
  flatbush: Flatbush,
  seriesData: readonly ScatterValueType[],
  xScale: D3Scale,
  yScale: D3Scale,
  xZoomStart: number,
  xZoomEnd: number,
  yZoomStart: number,
  yZoomEnd: number,
  svgPointX: number,
  svgPointY: number,
  maxRadius: number = Infinity,
  maxResults: number = 1,
  getItemRadius: number | ((dataIndex: number) => number) = 0,
) {
  const originalXScale = xScale.copy();
  const originalYScale = yScale.copy();
  originalXScale.range([0, 1]);
  originalYScale.range([0, 1]);

  const excludeIfOutsideDrawingArea = function excludeIfOutsideDrawingArea(index: number) {
    const x = originalXScale(seriesData[index].x)!;
    const y = originalYScale(seriesData[index].y)!;

    return x >= xZoomStart && x <= xZoomEnd && y >= yZoomStart && y <= yZoomEnd;
  };

  // We need to convert the distance from the original range [0, 1] to the current drawing area
  // so the comparison is done on pixels instead of normalized values.
  // fx and fy are the factors to convert the distance from [0, 1] to the current drawing area.
  const fx = xScale.range()[1] - xScale.range()[0];
  const fy = yScale.range()[1] - yScale.range()[0];
  const fxSq = fx * fx;
  const fySq = fy * fy;
  function sqDistFn(dx: number, dy: number) {
    return fxSq * dx * dx + fySq * dy * dy;
  }

  const pointX = originalXScale(
    invertScale(xScale, svgPointX, (dataIndex) => seriesData[dataIndex]?.x),
  );
  const pointY = originalYScale(
    invertScale(yScale, svgPointY, (dataIndex) => seriesData[dataIndex]?.y),
  );

  if (pointX === undefined || pointY === undefined) {
    return [];
  }

  const withFixRadius = typeof getItemRadius === 'number';
  const maxRadiusSq = Number.isFinite(maxRadius) ? maxRadius * maxRadius : Infinity;

  // Pull every candidate whose lower-bound (box) distance is within the hit threshold.
  // Any unpulled point j has box-dist > maxRadius, hence center-dist ≥ box-dist > maxRadius,
  // so it cannot be a hit. We re-rank by true edge distance below.
  const candidates = flatbush.neighbors(
    pointX,
    pointY,
    withFixRadius ? maxResults : LARGE_NUMBER,
    maxRadiusSq,
    excludeIfOutsideDrawingArea,
    sqDistFn,
  );

  if (withFixRadius) {
    // If radius is constant, we can skip the expensive edge-distance calculation and return candidates in box-distance order.
    return candidates;
  }

  // Re-rank by true (signed) edge distance. Negative values mean the cursor is inside
  // the marker — those win over any outside marker, with deeper containment ranked first.
  let ranked: { index: number; edge: number; centerDistSq: number }[] = [];
  for (const i of candidates) {
    const cx = originalXScale(seriesData[i].x)!;
    const cy = originalYScale(seriesData[i].y)!;
    const centerDistSq = sqDistFn(cx - pointX, cy - pointY);
    // Preserve the existing hit-area semantics: hit means center distance ≤ maxRadius.
    if (centerDistSq > maxRadiusSq) {
      continue;
    }
    const edge = Math.sqrt(centerDistSq) - getItemRadius(i);
    ranked.push({ index: i, edge, centerDistSq });
  }
  ranked.sort((a, b) => a.edge - b.edge);

  // The pointer is inside multiple marks, we sort them by distance to the center. Priority is
  // 1. marks that are under the pointer (negative edge distance) sorted by distance to the center
  // 2. marks that are outside the pointer (positive edge distance) by distance to the edge
  const splitIndex = ranked.findLastIndex((d) => d.edge < 0);
  if (splitIndex !== -1) {
    ranked = [
      ...ranked.slice(0, splitIndex + 1).sort((a, b) => a.centerDistSq - b.centerDistSq),
      ...ranked.slice(splitIndex + 1),
    ];
  }
  return ranked.slice(0, Math.min(ranked.length, maxResults)).map((d) => d.index);
}

function invertScale<T>(scale: D3Scale, value: number, getDataPoint: (dataIndex: number) => T) {
  if (isOrdinalScale(scale)) {
    const dataIndex =
      scale.bandwidth() === 0
        ? Math.floor((value - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
        : Math.floor((value - Math.min(...scale.range())) / scale.step());

    return getDataPoint(dataIndex);
  }

  return scale.invert(value);
}
