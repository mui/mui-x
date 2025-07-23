import { quadtree } from '@mui/x-charts-vendor/d3-quadtree';
import KDBush, { TypedArrayConstructor } from 'kdbush';
import { ScatterValueType } from '../../../../models/seriesType/scatter';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { SeriesId } from '../../../../models/seriesType/common';
import { ChartSeriesConfig } from '../../models';

export const selectorChartSeriesState: ChartRootSelector<UseChartSeriesSignature> = (state) =>
  state.series;

export const selectorChartSeriesProcessed = createSelector(
  [selectorChartSeriesState],
  (seriesState) => seriesState.processedSeries,
);

export const selectorChartSeriesConfig = createSelector(
  [selectorChartSeriesState],
  (seriesState) => seriesState.seriesConfig,
);

export const selectorChartSeriesQuadtree = createSelector(
  [selectorChartSeriesState, (_, id: SeriesId) => id],
  (seriesState, id) => {
    let series;

    for (const key in seriesState.processedSeries) {
      if (!Object.hasOwn(seriesState.processedSeries, key)) {
        continue;
      }

      const potentialSeries =
        seriesState.processedSeries[key as keyof ChartSeriesConfig<'scatter'>]?.series?.[id];

      if (potentialSeries) {
        series = potentialSeries;
        break;
      }
    }

    if (!series) {
      return null;
    }

    console.log('new quadtree for series', id);
    return quadtree(
      series.data as ScatterValueType[],
      (d) => d.x,
      (d) => d.y,
    );
  },
);

class KDBushWithNearestNeighbor extends KDBush {
  nearest(qx: number, qy: number, r: number) {
    if (!this._finished) {
      throw new Error('Data not yet indexed - call index.finish().');
    }

    const { ids, coords, nodeSize } = this;
    const stack = [0, ids.length - 1, 0];
    let result: number | null = null;
    let resultDistSquared = Infinity;

    // TODO: We can make this even more efficient by avoiding searching rectangles whose corners are further than r from the query point.

    // recursively search for items within radius in the kd-sorted arrays
    while (stack.length) {
      const axis = stack.pop() || 0;
      const right = stack.pop() || 0;
      const left = stack.pop() || 0;

      // if we reached "tree node", search linearly
      if (right - left <= nodeSize) {
        for (let i = left; i <= right; i++) {
          const distSquared = sqDist(coords[2 * i], coords[2 * i + 1], qx, qy);
          if (distSquared < resultDistSquared) {
            result = ids[i];
            resultDistSquared = distSquared;
          }
        }
        continue;
      }

      // otherwise find the middle index
      const m = (left + right) >> 1;

      // include the middle item if it's in range
      const x = coords[2 * m];
      const y = coords[2 * m + 1];
      const distSquared = sqDist(x, y, qx, qy);
      if (distSquared < resultDistSquared) {
        result = ids[m];
        resultDistSquared = distSquared;
      }

      // queue search in halves that intersect the query
      if (axis === 0 ? qx - r <= x : qy - r <= y) {
        stack.push(left);
        stack.push(m - 1);
        stack.push(1 - axis);
      }
      if (axis === 0 ? qx + r >= x : qy + r >= y) {
        stack.push(m + 1);
        stack.push(right);
        stack.push(1 - axis);
      }
    }

    return { id: result, distance: Math.sqrt(resultDistSquared) };
  }
}

export const selectorChartKdbush = createSelector([selectorChartSeriesState], (seriesState) => {
  const kdbushMap = new Map<SeriesId, KDBushWithNearestNeighbor>();

  for (const seriesId in seriesState.processedSeries.scatter?.series ?? {}) {
    if (!Object.hasOwn(seriesState.processedSeries.scatter?.series ?? {}, seriesId)) {
      continue;
    }

    const series = seriesState.processedSeries.scatter?.series[seriesId as SeriesId];

    if (!series) {
      continue;
    }

    const kdbush = new KDBushWithNearestNeighbor(series.data.length);

    for (const datum of series.data) {
      kdbush.add(datum.x, datum.y);
    }

    kdbush.finish();

    kdbushMap.set(seriesId, kdbush);
  }

  return kdbushMap;
});

export const selectorChartSeriesKdbush = createSelector(
  [selectorChartKdbush, (_, id: SeriesId) => id],
  (kdbushMap, seriesId) => {
    console.log('new kdbush for series', seriesId);
    return kdbushMap.get(seriesId);
  },
);

function sqDist(ax: number, ay: number, bx: number, by: number) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
