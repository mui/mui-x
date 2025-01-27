'use client';
import {
  ChartAnyPluginSignature,
  ChartSeriesType,
  useChartDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartDataProviderProProps } from './ChartDataProviderPro';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartDataProviderProProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartDataProviderProProps<TSeries, TSignatures>,
) => {
  const { animationProviderProps, chartProviderProps, children } = useChartDataProviderProps(props);

  return {
    children,
    animationProviderProps,
    chartProviderProps,
  };
};
