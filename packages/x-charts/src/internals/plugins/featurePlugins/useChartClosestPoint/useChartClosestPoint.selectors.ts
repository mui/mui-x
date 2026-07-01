import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { ChartRootSelector } from '../../utils/selectors';
import type { UseChartClosestPointSignature } from './useChartClosestPoint.types';
import type { SeriesId } from '../../../../models/seriesType/common';
import { Flatbush } from '../../../Flatbush';
import getMarkerSize from '../../../../ScatterChart/seriesConfig/getMarkerSize';
import type { ScatterSizeGetter } from '../../../../ScatterChart/seriesConfig/getMarkerSize';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import {
  selectorChartNormalizedXScales,
  selectorChartNormalizedYScales,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
} from '../useChartCartesianAxis';
import { selectorChartZAxis } from '../useChartZAxis';

const selectVoronoi: ChartRootSelector<UseChartClosestPointSignature> = (state) => state.voronoi;

export const selectorChartsIsVoronoiEnabled = createSelector(
  selectVoronoi,
  (voronoi) => voronoi?.isVoronoiEnabled,
);

export type ScatterFlatbushEntry = {
  flatbush: Flatbush;
  /** Per-point marker radius, in pixels. */
  getItemRadius: number | ((dataIndex: number) => number);
  /** Largest radius across all points in this series, in pixels. */
  maxItemRadius: number;
};

const EMPTY_MAP = new Map<SeriesId, ScatterFlatbushEntry>();
export const selectorChartSeriesEmptyFlatbushMap = () => EMPTY_MAP;

// Builds a spatial index of scatter points for closest-point detection. It lives
// in this scatter-only plugin (rather than the shared cartesian-axis selectors)
// so `Flatbush`/`flatqueue` stay out of charts that don't use closest-point.
export const selectorChartSeriesFlatbushMap = createSelectorMemoized(
  selectorChartSeriesProcessed,
  selectorChartNormalizedXScales,
  selectorChartNormalizedYScales,
  selectorChartDefaultXAxisId,
  selectorChartDefaultYAxisId,
  selectorChartZAxis,
  function selectChartSeriesFlatbushMap(
    allSeries,
    xAxesScaleMap,
    yAxesScaleMap,
    defaultXAxisId,
    defaultYAxisId,
    zAxisState,
  ) {
    // FIXME: Do we want to support non-scatter series here?
    const validSeries = allSeries.scatter;
    const flatbushMap = new Map<SeriesId, ScatterFlatbushEntry>();

    if (!validSeries) {
      return flatbushMap;
    }

    const zAxes = zAxisState?.axis ?? {};
    const zAxisIds = zAxisState?.axisIds ?? [];

    validSeries.seriesOrder.forEach((seriesId) => {
      const series = validSeries.series[seriesId];
      const { data, xAxisId = defaultXAxisId, yAxisId = defaultYAxisId } = series;

      if (data.length === 0) {
        return;
      }

      const flatbush = new Flatbush(data.length);

      const sizeAxis = zAxes[series.sizeAxisId ?? zAxisIds[0]];

      const isFixedSize = !sizeAxis || !sizeAxis.sizeScale;
      const getItemRadius = isFixedSize
        ? (series.markerSize ?? 0)
        : getMarkerSize(series, sizeAxis);

      let maxItemRadius = isFixedSize ? (getItemRadius as number) : 0;

      const originalXScale = xAxesScaleMap[xAxisId];
      const originalYScale = yAxesScaleMap[yAxisId];

      for (let i = 0; i < data.length; i += 1) {
        if (!isFixedSize) {
          maxItemRadius = Math.max(maxItemRadius, (getItemRadius as ScatterSizeGetter)(i));
        }
        // Add the points using a [0, 1] range so that we don't need to recreate the Flatbush structure when zooming.
        // This doesn't happen in practice, though, because currently the scales depend on the drawing area.
        flatbush.add(originalXScale(data[i].x)!, originalYScale(data[i].y)!);
      }

      flatbush.finish();
      flatbushMap.set(seriesId, { flatbush, getItemRadius, maxItemRadius });
    });

    return flatbushMap;
  },
);
