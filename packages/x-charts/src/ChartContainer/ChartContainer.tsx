'use client';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import {
  ChartsContainer,
  type ChartsContainerProps,
  type ChartsContainerSlotProps,
  type ChartsContainerSlots,
} from '../ChartsContainer';

/**
 * @deprecated Use `ChartsContainerSlots` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerSlots = ChartsContainerSlots;

/**
 * @deprecated Use `ChartsContainerSlotProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerSlotProps = ChartsContainerSlotProps;

/**
 * @deprecated Use `ChartsContainerProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContainerProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
> = ChartsContainerProps<SeriesType, TSignatures>;

/**
 * @deprecated Use `ChartsContainer` instead. We added S to the charts prefix to align with other components.
 */
export const ChartContainer = ChartsContainer;
