'use client';
import * as React from 'react';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { DefaultizedSeriesType } from '../../../../models/seriesType';
import { AxisDefaultized } from '../../../../models/axis';
import { ZAxisDefaultized } from '../../../../models/z-axis';
import { useSelector } from '../../../store/useSelector';
import { useStore } from '../../../store/useStore';
import { selectorChartSeriesConfig } from './useChartSeries.selectors';

export type ColorProcessor<T extends ChartSeriesType> = (
  series: DefaultizedSeriesType<T>,
  xAxis?: AxisDefaultized,
  yAxis?: AxisDefaultized,
  zAxis?: ZAxisDefaultized,
) => (dataIndex: number) => string;

export type ColorProcessorsConfig<T extends ChartSeriesType> = {
  [Key in T]?: ColorProcessor<Key>;
};

export function useColorProcessor<T extends ChartSeriesType>(
  seriesType: T,
): ColorProcessorsConfig<T>[T];
export function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;
export function useColorProcessor(seriesType?: ChartSeriesType) {
  const store = useStore();
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);

  const colorProcessors = React.useMemo(() => {
    const rep: ColorProcessorsConfig<ChartSeriesType> = {};
    (Object.keys(seriesConfig) as ChartSeriesType[]).forEach(
      <T extends ChartSeriesType>(seriesT: T) => {
        rep[seriesT] = seriesConfig[seriesT].colorProcessor;
      },
    );
    return rep;
  }, [seriesConfig]);

  if (!seriesType) {
    return colorProcessors;
  }

  return colorProcessors[seriesType];
}
