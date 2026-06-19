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
 * Render data for one scatter series. Packed `Float64Array` indexed by
 * `dataIndex` (stride 3: `[x, y, visible]`). Off-screen points keep their slot
 * so a point's batch stays fixed across zoom/pan (no popping).
 */
export interface ScatterSeriesRenderData {
  /** Packed projected coordinates + visibility flag, stride 3. */
  coords: Float64Array;
  /** Total number of points (`coords.length / 3`). */
  count: number;
}

const EMPTY_RENDER_DATA = new Map<SeriesId, ScatterSeriesRenderData>();

/** Packed projected coordinates for every scatter series, indexed by `dataIndex`. */
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

      result.set(
        seriesId,
        packScatterSeriesCoords(series.data, getXPosition, getYPosition, {
          xMin,
          xMax,
          yMin,
          yMax,
        }),
      );
    }

    return result;
  },
);

/** Pixel bounds (inclusive) a point must fall within to be flagged visible. */
export interface ScatterVisibilityBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/**
 * Projects `data` into a `dataIndex`-indexed packed array (stride 3:
 * `[x, y, visible]`). Every point keeps its slot; `visible` is `1` inside
 * `bounds`, `0` otherwise.
 */
export function packScatterSeriesCoords(
  data: readonly { x: number | Date; y: number | Date }[],
  getXPosition: (value: number | Date) => number,
  getYPosition: (value: number | Date) => number,
  bounds: ScatterVisibilityBounds,
): ScatterSeriesRenderData {
  const n = data.length;
  const packed = new Float64Array(n * 3);

  for (let i = 0; i < n; i += 1) {
    const x = getXPosition(data[i].x);
    const y = getYPosition(data[i].y);
    const visible = x >= bounds.xMin && x <= bounds.xMax && y >= bounds.yMin && y <= bounds.yMax;
    packed[i * 3] = x;
    packed[i * 3 + 1] = y;
    packed[i * 3 + 2] = visible ? 1 : 0;
  }

  return { coords: packed, count: n };
}

/** Render data for one series, or `undefined` while processors/axes are pending. */
export const selectorScatterSeriesRenderData = createSelector(
  selectorScatterRenderData,
  (renderData, seriesId: SeriesId) => renderData.get(seriesId),
);
