'use client';
import * as React from 'react';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { useStore } from '../../../store/useStore';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig';
import { type ColorProcessor } from '../useChartSeriesConfig';

export type ColorProcessorsConfig<T extends ChartSeriesType> = {
  [Key in T]?: ColorProcessor<Key>;
};

export function useColorProcessor<T extends ChartSeriesType>(seriesType: T): ColorProcessor<T>;
export function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(seriesType?: ChartSeriesType) {
  const store = useStore();
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const colorProcessors = React.useMemo(() => {
    const rep: ColorProcessorsConfig<ChartSeriesType> = {};
    (Object.keys(seriesConfig) as ChartSeriesType[]).forEach(
      <T extends ChartSeriesType>(seriesT: T) => {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/61555
        rep[seriesT as T] = seriesConfig[seriesT].colorProcessor as ColorProcessor<T>;
      },
    );
    return rep;
  }, [seriesConfig]);

  if (!seriesType) {
    return colorProcessors;
  }

  return colorProcessors[seriesType];
}
