'use client';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import {
  useChartsContainerPremiumProps,
  type UseChartsContainerPremiumPropsReturnValue,
} from '../ChartsContainerPremium/useChartsContainerPremiumProps';

/**
 * @deprecated Use `UseChartsContainerPremiumPropsReturnValue` instead.
 */
export type UseChartContainerPremiumPropsReturnValue<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartsContainerPremiumPropsReturnValue<SeriesType, TSignatures>;

/**
 * @deprecated Use `useChartsContainerPremiumProps` instead.
 */
export const useChartContainerPremiumProps = useChartsContainerPremiumProps;
