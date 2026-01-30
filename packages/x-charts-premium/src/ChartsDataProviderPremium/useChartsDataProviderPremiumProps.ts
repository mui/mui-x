'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartsDataProviderPremiumProps } from './ChartsDataProviderPremium';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartsDataProviderPremiumProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsDataProviderPremiumProps<TSeries, TSignatures>,
) => {
  const { chartProviderProps, localeText, slots, slotProps, children } =
    useChartsDataProviderProps(props);

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
