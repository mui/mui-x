'use client';
import { ChartSeriesType, useChartDataProviderProps } from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from './ChartDataProviderPro';

export const useChartDataProviderProProps = <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartDataProviderProProps<TSeries>,
) => {
  const { animationProviderProps, chartProviderProps, highlightedProviderProps, children } =
    useChartDataProviderProps(props);

  return {
    children,
    highlightedProviderProps,
    animationProviderProps,
    chartProviderProps,
  };
};
