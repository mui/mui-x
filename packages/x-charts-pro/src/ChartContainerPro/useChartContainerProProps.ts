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
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartsContainerProPropsReturnValue<SeriesType, TSignatures>;

/**
 * @deprecated Use `useChartsContainerProProps` instead.
 */
export const useChartContainerProProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartContainerProProps<SeriesType, TSignatures>,
): UseChartContainerProPropsReturnValue<SeriesType, TSignatures> => {
  return useChartsContainerProProps(props);
};
