'use client';
import { type ChartSeriesType, type ChartAnyPluginSignature } from '@mui/x-charts/internals';
import {
  ChartsDataProviderPro,
  type ChartsDataProviderProProps,
  type ChartsDataProviderProSlots,
  type ChartsDataProviderProSlotProps,
  defaultSeriesConfigPro,
} from '../ChartsDataProviderPro';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';

export { defaultSeriesConfigPro };

/**
 * @deprecated Use `ChartsDataProviderProSlots` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderProSlots = ChartsDataProviderProSlots;

/**
 * @deprecated Use `ChartsDataProviderProSlotProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderProSlotProps = ChartsDataProviderProSlotProps;

/**
 * @deprecated Use `ChartsDataProviderProProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderProProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsDataProviderProProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsDataProviderPro` instead. We added S to the charts prefix to align with other components.
 */
export const ChartDataProviderPro = ChartsDataProviderPro;
