import { quadtree } from '@mui/x-charts-vendor/d3-quadtree';
import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { SeriesId } from '../../../../models/seriesType/common';

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
      const potentialSeries = seriesState.processedSeries[key]?.series?.[id];

      if (potentialSeries) {
        series = potentialSeries;
        break;
      }
    }

    if (!series) {
      return null;
    }

    return quadtree(
      series.data,
      (d) => d.x,
      (d) => d.y,
    );
  },
);
