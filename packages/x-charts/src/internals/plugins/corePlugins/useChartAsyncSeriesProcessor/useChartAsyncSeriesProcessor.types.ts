import { type ChartPluginSignature } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ProcessedSeries } from '../useChartSeries/useChartSeries.types';
import type { UseChartSeriesSignature } from '../useChartSeries';
import type { UseChartSeriesConfigSignature } from '../useChartSeriesConfig';

export interface UseChartAsyncSeriesProcessorParameters {
  /**
   * If `true`, the series-processing pipeline runs in a Web Worker so the main thread
   * stays responsive while large datasets are processed. While the worker is busy, the
   * chart is empty and its loading overlay is shown. When the worker returns, the chart
   * re-renders with the full data.
   *
   * Constraints (v1):
   * - Series must use the `data` prop. `valueGetter` is not supported in this mode.
   * - Supported series types: `line`, `bar`, `scatter`.
   *
   * @default false
   */
  asyncProcessing?: boolean;
}

export type UseChartAsyncSeriesProcessorDefaultizedParameters =
  Required<UseChartAsyncSeriesProcessorParameters>;

export interface UseChartAsyncSeriesProcessorState<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> {
  asyncSeriesProcessor: {
    enabled: boolean;
    isProcessing: boolean;
    processedSeries: ProcessedSeries<SeriesType> | null;
    requestId: number;
  };
}

export type UseChartAsyncSeriesProcessorSignature<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = ChartPluginSignature<{
  params: UseChartAsyncSeriesProcessorParameters;
  defaultizedParams: UseChartAsyncSeriesProcessorDefaultizedParameters;
  state: UseChartAsyncSeriesProcessorState<SeriesType>;
  dependencies: [UseChartSeriesSignature<SeriesType>, UseChartSeriesConfigSignature<SeriesType>];
}>;
