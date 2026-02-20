'use client';
import { type ChartAnyPluginSignature, type ChartSeriesType } from '@mui/x-charts/internals';
import {
  useChartsContainerProProps,
  type UseChartsContainerProPropsReturnValue,
} from '../ChartsContainerPro/useChartsContainerProProps';
import type { ChartContainerProProps } from './ChartContainerPro';
import { type AllPluginSignatures } from '../internals/plugins/allPlugins';

/**
 * @deprecated Use `UseChartsContainerProPropsReturnValue` instead.
 */
export type UseChartContainerProPropsReturnValue<
  TSeries extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartsContainerProPropsReturnValue<TSeries, TSignatures>;

/**
 * @deprecated Use `useChartsContainerProProps` instead.
 */
export const useChartContainerProProps = <
  TSeries extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>,
>(
  props: ChartContainerProProps<TSeries, TSignatures>,
): UseChartContainerProPropsReturnValue<TSeries, TSignatures> => {
  return useChartsContainerProProps(props);
};
