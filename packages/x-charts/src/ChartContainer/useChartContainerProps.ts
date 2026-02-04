'use client';
import type * as React from 'react';
import { type ChartSeriesType } from '../models/seriesType/config';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';
import { type ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import {
  useChartsContainerProps,
  type UseChartsContainerPropsReturnValue,
} from '../ChartsContainer/useChartsContainerProps';
import type { ChartContainerProps } from './ChartContainer';

/**
 * @deprecated Use `UseChartsContainerPropsReturnValue` instead.
 */
export type UseChartContainerPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartsContainerPropsReturnValue<TSeries, TSignatures>;

/**
 * @deprecated Use `useChartsContainerProps` instead.
 */
export const useChartContainerProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerProps<TSeries, TSignatures>,
  ref: React.Ref<SVGSVGElement>,
): UseChartContainerPropsReturnValue<TSeries, TSignatures> => {
  return useChartsContainerProps(props, ref);
};
