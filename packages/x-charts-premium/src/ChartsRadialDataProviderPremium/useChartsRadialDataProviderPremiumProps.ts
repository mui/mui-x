'use client';
import {
  type ChartAnyPluginSignature,
  type PolarChartSeriesType,
  useChartsRadialDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartsRadialDataProviderPremiumProps } from './ChartsRadialDataProviderPremium';
import type { RadialPremiumPluginSignatures } from './ChartsRadialDataProviderPremium.plugins';

export const useChartsRadialDataProviderPremiumProps = <
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends
    readonly ChartAnyPluginSignature[] = RadialPremiumPluginSignatures<SeriesType>,
>(
  props: ChartsRadialDataProviderPremiumProps<SeriesType, TSignatures>,
) => {
  const { chartProviderProps, localeText, slots, slotProps, children } =
    useChartsRadialDataProviderProps(props);

  return {
    children,
    localeText,
    chartProviderProps,
    slots,
    slotProps,
  };
};
