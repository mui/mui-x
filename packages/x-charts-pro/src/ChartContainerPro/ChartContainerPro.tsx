'use client';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import {
  ChartsContainerPro,
  type ChartsContainerProProps,
  type ChartsContainerProSlotProps,
  type ChartsContainerProSlots,
} from '../ChartsContainerPro';

/**
 * @deprecated Use `ChartsContainerProSlots` instead.
 */
export type ChartContainerProSlots = ChartsContainerProSlots;

/**
 * @deprecated Use `ChartsContainerProSlotProps` instead.
 */
export type ChartContainerProSlotProps = ChartsContainerProSlotProps;

/**
 * @deprecated Use `ChartsContainerProProps` instead.
 */
export type ChartContainerProProps<
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
> = ChartsContainerProProps<TSeries, TSignatures>;

/**
 * @deprecated Use `ChartsContainerPro` instead.
 */
export const ChartContainerPro = ChartsContainerPro;
