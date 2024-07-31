import * as React from 'react';
import { ChartSeriesType } from '../../models/seriesType/config';
import { PluginContext } from './PluginContext';
import { SeriesFormatterConfig } from './SeriesFormatter.types';

export function useSeriesFormatter<T extends ChartSeriesType>(
  seriesType: T,
): SeriesFormatterConfig<T>[T];
export function useSeriesFormatter(): SeriesFormatterConfig<ChartSeriesType>;
export function useSeriesFormatter(seriesType?: ChartSeriesType) {
  const { isInitialized, data } = React.useContext(PluginContext);

  if (!isInitialized) {
    throw new Error(
      [
        'MUI X: Could not find the plugin context.',
        'It looks like you rendered your component outside of a ChartsContainer parent component.',
      ].join('\n'),
    );
  }

  if (!seriesType) {
    return data.seriesFormatters;
  }

  return data.seriesFormatters[seriesType];
}
