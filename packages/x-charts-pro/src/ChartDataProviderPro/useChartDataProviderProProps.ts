'use client';
import { ChartSeriesType, useChartDataProviderProps } from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from './ChartDataProviderPro';

export const useChartDataProviderProProps = <TSeries extends ChartSeriesType = ChartSeriesType>(
  props: ChartDataProviderProProps<TSeries>,
) => {
  const { children, initialZoom, onZoomChange, ...other } = props;

  const { animationProviderProps, chartProviderProps, highlightedProviderProps } =
    useChartDataProviderProps(other);

  return {
    children,
    highlightedProviderProps,
    animationProviderProps,
    chartProviderProps: {
      ...chartProviderProps,
      initialZoom,
      onZoomChange,
    },
  };
};
