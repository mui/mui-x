'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartsDataProviderProProps } from './ChartsDataProviderPro';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartsDataProviderProProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartsDataProviderProProps<TSeries, TSignatures>,
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
