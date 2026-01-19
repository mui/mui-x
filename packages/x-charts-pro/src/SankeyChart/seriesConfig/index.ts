import type { SeriesLayoutGetter, ChartSeriesTypeConfig } from '@mui/x-charts/internals';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import { tooltipGetter } from './tooltipGetter';
import { calculateSankeyLayout } from '../calculateSankeyLayout';
import tooltipItemPositionGetter from './tooltipPosition';
import keyboardFocusHandler from './keyboardFocusHandler';
import identifierSerializer from './identifierSerializer';

// Simple passthrough functions for sankey chart
const seriesProcessor = (series: any) => series;
const colorProcessor = (series: any) => series;
const legendGetter = () => [];

const seriesLayout: SeriesLayoutGetter<'sankey'> = (series, drawingArea) => {
  if (series.seriesOrder.length === 0) {
    return {};
  }
  return {
    [series.seriesOrder[0]]: {
      sankeyLayout: calculateSankeyLayout(series.series[series.seriesOrder[0]], drawingArea),
    },
  };
};

export const sankeySeriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessor,
  seriesLayout,
  colorProcessor,
  legendGetter,
  tooltipGetter,
  tooltipItemPositionGetter,
  getSeriesWithDefaultValues,
  keyboardFocusHandler,
  identifierSerializer,
};
