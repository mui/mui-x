'use client';
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
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartsContainerPropsReturnValue<SeriesType, TSignatures>;

/**
 * @deprecated Use `useChartsContainerProps` instead.
 */
export const useChartContainerProps = <
  SeriesType extends ChartSeriesType = ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<SeriesType>,
>(
  props: ChartContainerProps<SeriesType, TSignatures>,
): UseChartContainerPropsReturnValue<SeriesType, TSignatures> => {
  return useChartsContainerProps(props);
};
