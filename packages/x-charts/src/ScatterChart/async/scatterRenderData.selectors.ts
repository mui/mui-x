import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import { type SeriesId } from '../../models/seriesType/common';
import { getValueToPositionMapper } from '../../hooks/getValueToPositionMapper';
import { selectorChartSeriesProcessed } from '../../internals/plugins/corePlugins/useChartSeries';
import { selectorChartDrawingArea } from '../../internals/plugins/corePlugins/useChartDimensions';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../../internals/plugins/featurePlugins/useChartCartesianAxis';

/**
 * Pre-computed render data for a single scatter series.
 *
 * Coordinates are stored in a packed `Float64Array` (stride 3: `[x0, y0, i0,
 * x1, y1, i1, ...]`, where `iN` is the original `dataIndex`). Only points that
 * project inside the drawing area are kept, so the progressive renderer can
 * size its batches by the number of *visible* points — when zoomed in tightly
 * the wave finishes in a single tick. Batches are contiguous slices of this
 * array, so a batch's data is obtained with a zero-copy `subarray` view (see
 * {@link getScatterBatchView}).
 */
export interface ScatterSeriesRenderData {
  /** Packed projected pixel coordinates + dataIndex, stride 3. */
  coords: Float64Array;
  /** Number of visible points (i.e. `coords.length / 3`). */
  count: number;
}

const EMPTY_RENDER_DATA = new Map<SeriesId, ScatterSeriesRenderData>();

/**
 * Packed projected coordinates for every scatter series, filtered to the
 * drawing area. Recomputes when the processed series, axis scales, or drawing
 * area change.
 */
export const selectorScatterRenderData = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartDrawingArea,
  function selectorScatterRenderData(processedSeries, xAxes, yAxes, drawingArea) {
    const scatter = processedSeries.scatter;
    if (scatter === undefined) {
      return EMPTY_RENDER_DATA;
    }

    const defaultXAxisId = xAxes.axisIds[0];
    const defaultYAxisId = yAxes.axisIds[0];

    const result = new Map<SeriesId, ScatterSeriesRenderData>();

    const xMin = drawingArea.left - 1;
    const xMax = drawingArea.left + drawingArea.width;
    const yMin = drawingArea.top - 1;
    const yMax = drawingArea.top + drawingArea.height;

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
      const n = data.length;
      const packed = new Float64Array(n * 3);

      let j = 0;
      for (let i = 0; i < n; i += 1) {
        const x = getXPosition(data[i].x);
        if (!(x >= xMin && x <= xMax)) {
          continue;
        }
        const y = getYPosition(data[i].y);
        if (!(y >= yMin && y <= yMax)) {
          continue;
        }
        packed[j] = x;
        packed[j + 1] = y;
        packed[j + 2] = i;
        j += 3;
      }
      const coords = packed.slice(0, j);

      result.set(seriesId, { coords, count: j / 3 });
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
 * Zero-copy view of one batch's coordinates. `start`/`end` are visible-point
 * indices (not original `dataIndex` values). The returned `Float64Array` shares
 * the buffer with `renderData.coords`.
 */
export function getScatterBatchView(
  renderData: ScatterSeriesRenderData,
  start: number,
  end: number,
): Float64Array {
  return renderData.coords.subarray(start * 3, end * 3);
}
