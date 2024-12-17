'use client';
import * as React from 'react';
import { ChartSeriesType } from '../../models/seriesType/config';
import { useChartContext } from './useChartContext';
import { DefaultizedSeriesType } from '../../models/seriesType';
import { AxisDefaultized } from '../../models/axis';
import { ZAxisDefaultized } from '../../models/z-axis';

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
  const context = useChartContext();

  const colorProcessors = React.useMemo(() => {
    const rep: ColorProcessorsConfig<ChartSeriesType> = {};
    Object.keys(context.seriesConfig).forEach((seriesT) => {
      rep[seriesT as ChartSeriesType] = context.seriesConfig[seriesT].colorProcessor;
    });
    return rep;
  }, [context.seriesConfig]);

  if (!seriesType) {
    return colorProcessors;
  }

  return colorProcessors[seriesType];
}
