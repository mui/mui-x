'use client';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartsDataProvider,
  type ChartsDataProviderProps,
  type ChartsDataProviderSlots,
  type ChartsDataProviderSlotProps,
} from '../ChartsDataProvider';

/**
 * @deprecated Use `ChartsDataProviderSlots` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderSlots = ChartsDataProviderSlots;

/**
 * @deprecated Use `ChartsDataProviderSlotProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderSlotProps = ChartsDataProviderSlotProps;

/**
 * @deprecated Use `ChartsDataProviderProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartDataProviderProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsDataProviderProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsDataProvider` instead. We added S to the charts prefix to align with other components.
 */
export const ChartDataProvider = ChartsDataProvider;
