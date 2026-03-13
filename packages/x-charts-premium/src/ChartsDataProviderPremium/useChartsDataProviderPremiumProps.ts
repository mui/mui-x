'use client';
import {
  type ChartAnyPluginSignature,
  type ChartSeriesType,
  useChartsDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartsDataProviderPremiumProps } from './ChartsDataProviderPremium';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export const useChartsDataProviderPremiumProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartsDataProviderPremiumProps<SeriesType, TSignatures>,
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
