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
 * @deprecated Use `ChartsContainerSlots` instead.
 */
export type ChartContainerSlots = ChartsContainerSlots;

/**
 * @deprecated Use `ChartsContainerSlotProps` instead.
 */
export type ChartContainerSlotProps = ChartsContainerSlotProps;

/**
 * @deprecated Use `ChartsContainerProps` instead.
 */
export type ChartContainerProps<
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
> = ChartsContainerProps<SeriesType, TSignatures>;

/**
 * @deprecated Use `ChartsContainer` instead.
 */
export const ChartContainer = ChartsContainer;
