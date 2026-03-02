'use client';
import { type ChartSeriesType, type ChartAnyPluginSignature } from '@mui/x-charts/internals';
import {
  ChartsDataProviderPremium,
  type ChartsDataProviderPremiumProps,
  type ChartsDataProviderPremiumSlots,
  type ChartsDataProviderPremiumSlotProps,
  defaultSeriesConfigPremium,
} from '../ChartsDataProviderPremium';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';

export { defaultSeriesConfigPremium };

/**
 * @deprecated Use `ChartsDataProviderPremiumSlots` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderPremiumSlots = ChartsDataProviderPremiumSlots;

/**
 * @deprecated Use `ChartsDataProviderPremiumSlotProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderPremiumSlotProps = ChartsDataProviderPremiumSlotProps;

/**
 * @deprecated Use `ChartsDataProviderPremiumProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsDataProviderPremiumProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsDataProviderPremium` instead. We added S to the charts prefix to align with other components.
 */
export const ChartDataProviderPremium = ChartsDataProviderPremium;
