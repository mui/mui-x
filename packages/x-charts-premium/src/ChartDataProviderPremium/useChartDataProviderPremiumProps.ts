'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartDataProviderPremiumProps } from './ChartDataProviderPremium';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartDataProviderPremiumProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartDataProviderPremiumProps<TSeries, TSignatures>,
) => {
  const { chartProviderProps, localeText, slots, slotProps, children } =
    useChartDataProviderProps(props);

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
