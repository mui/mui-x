import * as React from 'react';
import { ChartSeriesType } from '../internals';
import { ColorContext } from '../context/ColorProvider';
import { ColorProcessorsConfig } from '../models/plugin';

export function useColorProcessor<T extends ChartSeriesType>(
  seriesType: T,
): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(seriesType?: ChartSeriesType) {
  const colorProcessors = React.useContext(ColorContext);

  if (!seriesType) {
    return colorProcessors;
  }

  return colorProcessors[seriesType];
}
