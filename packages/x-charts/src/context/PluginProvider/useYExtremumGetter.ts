import * as React from 'react';
import { ChartSeriesType } from '../../models/seriesType/config';
import { PluginContext } from './PluginContext';
import { ExtremumGettersConfig } from './ExtremumGetter.types';

export function useYExtremumGetter<T extends ChartSeriesType>(
  seriesType: T,
): ExtremumGettersConfig<T>[T];
export function useYExtremumGetter(): ExtremumGettersConfig<ChartSeriesType>;
export function useYExtremumGetter(seriesType?: ChartSeriesType) {
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
    return data.yExtremumGetters;
  }

  return data.yExtremumGetters[seriesType];
}
