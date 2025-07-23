import { quadtree } from '@mui/x-charts-vendor/d3-quadtree';
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

    return quadtree(
      series.data as ScatterValueType[],
      (d) => d.x,
      (d) => d.y,
    );
  },
);
