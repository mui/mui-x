import type {
  SeriesPositions,
  ChartSeriesTypeConfig,
  SeriesPositionsResult,
} from '@mui/x-charts/internals';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { tooltipGetter } from './tooltipGetter';
import { calculateSankeyLayout } from '../calculateSankeyLayout';

// Simple passthrough functions for sankey chart
const seriesProcessor = (series: any) => series;
const colorProcessor = (series: any) => series;
const legendGetter = () => [];

const seriesPositions: SeriesPositions<'sankey'> = (series, drawingArea) => {
  if (series.seriesOrder.length === 0) {
    return series as SeriesPositionsResult<'sankey'>;
  }
  return {
    ...series,
    series: {
      [series.seriesOrder[0]]: {
        ...series.series[series.seriesOrder[0]],
        sankeyLayout: calculateSankeyLayout(series.series[series.seriesOrder[0]], drawingArea),
      },
    },
  } satisfies SeriesPositionsResult<'sankey'>;
};

export const sankeySeriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessor,
  seriesPositions,
  colorProcessor,
  legendGetter,
  tooltipGetter,
  getSeriesWithDefaultValues,
};
