'use client';
import {
  type ChartAnyPluginSignature,
  type PolarChartSeriesType,
  useChartsRadialDataProviderProps,
} from '@mui/x-charts/internals';
import type { ChartsRadialDataProviderProProps } from './ChartsRadialDataProviderPro';
import type { RadialProPluginSignatures } from './ChartsRadialDataProviderPro.plugins';

export const useChartsRadialDataProviderProProps = <
  SeriesType extends PolarChartSeriesType = PolarChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = RadialProPluginSignatures<SeriesType>,
>(
  props: ChartsRadialDataProviderProProps<SeriesType, TSignatures>,
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
