import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../models/seriesType/common';
import { getValueToPositionMapper } from '../../hooks/getValueToPositionMapper';
import { selectorChartSeriesProcessed } from '../../internals/plugins/corePlugins/useChartSeries';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis';

/**
 * Pre-computed render data for a single scatter series.
 *
 * Coordinates are stored in a packed `Float64Array` (stride 2: `[x0, y0, x1,
 * y1, ...]`). Batches are contiguous slices of this array, so a batch's data is
 * obtained with a zero-copy `subarray` view (see {@link getScatterBatchView}).
 */
export interface ScatterSeriesRenderData {
  /** Packed projected pixel coordinates, stride 2. */
  coords: Float64Array;
  /** Number of points (i.e. `coords.length / 2`). */
  count: number;
}

const EMPTY_RENDER_DATA = new Map<SeriesId, ScatterSeriesRenderData>();

/**
 * Packed projected coordinates for every scatter series. Recomputes when the
 * processed series or axis scales change.
 */
export const selectorScatterRenderData = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
  function selectorScatterRenderData(processedSeries, xAxes, yAxes) {
    const scatter = processedSeries.scatter;
    if (scatter === undefined) {
      return EMPTY_RENDER_DATA;
    }

    const defaultXAxisId = xAxes.axisIds[0];
    const defaultYAxisId = yAxes.axisIds[0];

    const result = new Map<SeriesId, ScatterSeriesRenderData>();

    for (const seriesId of scatter.seriesOrder) {
      const series = scatter.series[seriesId];
      const xAxis = xAxes.axis[series.xAxisId ?? defaultXAxisId];
      const yAxis = yAxes.axis[series.yAxisId ?? defaultYAxisId];

      if (xAxis === undefined || yAxis === undefined) {
        continue;
      }

      const getXPosition = getValueToPositionMapper(xAxis.scale);
      const getYPosition = getValueToPositionMapper(yAxis.scale);

      const data = series.data;
      const count = data.length;
      const coords = new Float64Array(count * 2);

      for (let i = 0; i < count; i += 1) {
        coords[i * 2] = getXPosition(data[i].x);
        coords[i * 2 + 1] = getYPosition(data[i].y);
      }

      result.set(seriesId, { coords, count });
    }

    return result;
  },
);

/**
 * Render data for a single scatter series, or `undefined` while it is not
 * available yet (processors/axes still pending).
 */
export const selectorScatterSeriesRenderData = createSelector(
  selectorScatterRenderData,
  (renderData, seriesId: SeriesId) => renderData.get(seriesId),
);

/**
 * Zero-copy view of one batch's coordinates. `start`/`end` are point indices.
 * The returned `Float64Array` shares the buffer with `renderData.coords`.
 */
export function getScatterBatchView(
  renderData: ScatterSeriesRenderData,
  start: number,
  end: number,
): Float64Array {
  return renderData.coords.subarray(start * 2, end * 2);
}
