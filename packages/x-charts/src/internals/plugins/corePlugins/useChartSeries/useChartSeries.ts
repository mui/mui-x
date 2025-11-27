'use client';
import * as React from 'react';
import { ChartPlugin } from '../../models';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { rainbowSurgePalette } from '../../../../colorPalettes';

export const useChartSeries: ChartPlugin<UseChartSeriesSignature> = ({
  params,
  store,
  seriesConfig,
}) => {
  const { series, dataset, theme, colors } = params;

  React.useEffect(() => {
    store.set('series', {
      ...store.state.series,
      series,
      colors,
      theme,
      dataset,
    });
  }, [colors, dataset, series, theme, seriesConfig, store]);

  return {};
};

useChartSeries.params = {
  dataset: true,
  series: true,
  colors: true,
  theme: true,
};

const EMPTY_ARRAY: any[] = [];

useChartSeries.getDefaultizedParams = ({ params }) => ({
  ...params,
  series: params.series?.length ? params.series : EMPTY_ARRAY,
  colors: params.colors ?? rainbowSurgePalette,
  theme: params.theme ?? 'light',
});

useChartSeries.getInitialState = ({ series = [], colors, theme, dataset }, _, seriesConfig) => {
  return {
    series: {
      seriesConfig,
      series,
      colors,
      theme,
      dataset,
    },
  };
};
