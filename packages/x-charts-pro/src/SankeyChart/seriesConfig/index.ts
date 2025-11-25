import type {
  ChartSeriesTypeConfig,
  SeriesProcessor,
  SeriesProcessorResult,
} from '@mui/x-charts/internals';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { tooltipGetter } from './tooltipGetter';
import { calculateSankeyLayout } from '../calculateSankeyLayout';

// Simple passthrough functions for sankey chart
const seriesProcessorWithoutDimensions = (series: any) => series;
const colorProcessor = (series: any) => series;
const legendGetter = () => [];

const seriesProcessor: SeriesProcessor<'sankey'> = (series, drawingArea) => {
  if (series.seriesOrder.length === 0) {
    return series as SeriesProcessorResult<'sankey'>;
  }
  return {
    series: {
      [series.seriesOrder[0]]: {
        ...series.series[series.seriesOrder[0]],
        sankeyLayout: calculateSankeyLayout(series.series[series.seriesOrder[0]], drawingArea),
      },
    },
    seriesOrder: series.seriesOrder,
  } satisfies SeriesProcessorResult<'sankey'>;
};

export const sankeySeriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessorWithoutDimensions,
  colorProcessor,
  legendGetter,
  tooltipGetter,
  getSeriesWithDefaultValues,
  seriesProcessor,
};
