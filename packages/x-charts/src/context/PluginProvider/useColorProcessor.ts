import * as React from 'react';
import { ChartSeriesType } from '../../models/seriesType/config';
import { PluginContext } from './PluginContext';
import { ColorProcessorsConfig } from './ColorProcessor.types';

export function useColorProcessor<T extends ChartSeriesType>(
  seriesType: T,
): ColorProcessorsConfig<T>[T];
export function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(seriesType?: ChartSeriesType) {
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
    return data.colorProcessors;
  }

  return data.colorProcessors[seriesType];
}
