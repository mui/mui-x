'use client';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartsContainerPremium,
  type ChartsContainerPremiumProps,
  type ChartsContainerPremiumSlotProps,
  type ChartsContainerPremiumSlots,
} from '../ChartsContainerPremium';

/**
 * @deprecated Use `ChartsContainerPremiumSlots` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerPremiumSlots = ChartsContainerPremiumSlots;

/**
 * @deprecated Use `ChartsContainerPremiumSlotProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerPremiumSlotProps = ChartsContainerPremiumSlotProps;

/**
 * @deprecated Use `ChartsContainerPremiumProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsContainerPremiumProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsContainerPremium` instead. We added S to the charts prefix to align with other components.
 */
export const ChartContainerPremium = ChartsContainerPremium;
