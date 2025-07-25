import type { ChartSeriesTypeConfig } from '@mui/x-charts/internals';

// Simple passthrough functions for sankey chart
const seriesProcessor = (series: any) => series;
const getColor = (series: any) => series;
const legendGetter = () => [];
const tooltipGetter = () =>
  ({
    identifier: {
      type: 'sankey',
      seriesId: '',
      subType: 'node',
      id: '',
    },
    color: '',
    label: undefined,
    value: {
      links: [],
      nodes: [],
    },
    seriesId: undefined,
    subType: undefined,
    formattedValue: null,
    markType: 'square',
  }) as const;
const getSeriesWithDefaultValues = (series: any) => series;

export const seriesConfig: ChartSeriesTypeConfig<'sankey'> = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  getSeriesWithDefaultValues,
};
