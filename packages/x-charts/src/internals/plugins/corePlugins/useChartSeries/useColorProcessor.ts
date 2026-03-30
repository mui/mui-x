'use client';
import * as React from 'react';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { useStore } from '../../../store/useStore';
import { selectorChartSeriesConfig } from '../useChartSeriesConfig';
import { type ColorProcessor } from '../useChartSeriesConfig';

type ColorProcessorsConfig<SeriesType extends ChartSeriesType> = {
  [Key in SeriesType]?: ColorProcessor<Key>;
};

export function useColorProcessor<SeriesType extends ChartSeriesType>(
  seriesType: SeriesType,
): ColorProcessor<SeriesType>;
export function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(seriesType?: ChartSeriesType) {
  const store = useStore();
  const seriesConfig = store.use(selectorChartSeriesConfig);

  const colorProcessors = React.useMemo(() => {
    const rep: ColorProcessorsConfig<ChartSeriesType> = {};
    (Object.keys(seriesConfig) as ChartSeriesType[]).forEach(
      <SeriesType extends ChartSeriesType>(seriesT: SeriesType) => {
        // @ts-expect-error https://github.com/microsoft/TypeScript/issues/61555
        rep[seriesT as SeriesType] = seriesConfig[seriesT]
          .colorProcessor as ColorProcessor<SeriesType>;
      },
    );
    return rep;
  }, [seriesConfig]);

  if (!seriesType) {
    return colorProcessors;
  }

  return colorProcessors[seriesType];
}
