'use client';
import * as React from 'react';
import { ChartPlugin } from '../../models';
import { UseChartSeriesSignature } from './useChartSeries.types';
import { blueberryTwilightPalette } from '../../../../colorPalettes';
import { preprocessSeries } from './processSeries';

export const useChartSeries: ChartPlugin<UseChartSeriesSignature> = ({
  params,
  store,
  seriesConfig,
}) => {
  const { series = [], dataset, theme, colors } = params;

  React.useEffect(() => {
    store.update((prev) => ({
      ...prev,
      series: preprocessSeries({
        series,
        colors: typeof colors === 'function' ? colors(theme) : colors,
        seriesConfig,
        dataset,
      }),
    }));
  }, [colors, dataset, series, theme, seriesConfig, store]);

  return {};
};

useChartSeries.params = {
  dataset: true,
  series: true,
  colors: true,
  theme: true,
};

useChartSeries.getDefaultizedParams = ({ params }) => ({
  ...params,
  colors: params.colors ?? blueberryTwilightPalette,
  theme: params.theme ?? 'light',
});

useChartSeries.getInitialState = ({ series = [], colors, theme, dataset }, _, seriesConfig) => {
  return {
    series: preprocessSeries({
      series,
      colors: typeof colors === 'function' ? colors(theme) : colors,
      seriesConfig,
      dataset,
    }),
  };
};
