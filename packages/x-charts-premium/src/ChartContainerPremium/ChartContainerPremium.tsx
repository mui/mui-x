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
 * @deprecated Use `ChartsContainerPremiumSlots` instead.
 */
export type ChartContainerPremiumSlots = ChartsContainerPremiumSlots;

/**
 * @deprecated Use `ChartsContainerPremiumSlotProps` instead.
 */
export type ChartContainerPremiumSlotProps = ChartsContainerPremiumSlotProps;

/**
 * @deprecated Use `ChartsContainerPremiumProps` instead.
 */
export type ChartContainerPremiumProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsContainerPremiumProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsContainerPremium` instead.
 */
export const ChartContainerPremium = ChartsContainerPremium;
