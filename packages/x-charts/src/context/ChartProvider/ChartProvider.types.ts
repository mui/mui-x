import type {
  ChartsContextValue,
  ChartsPluginParams,
  ChartsProviderProps,
} from '../ChartsProvider/ChartsProvider.types';
import type { ChartAnyPluginSignature } from '../../internals/plugins/models';
import type { ChartSeriesType } from '../../models/seriesType/config';

/**
 * @deprecated Use `ChartsContextValue` instead. We added S to the charts prefix to align with other components.
 */
export type ChartContextValue<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = ChartsContextValue<TSignatures, TOptionalSignatures>;

/**
 * @deprecated Use `ChartsPluginParams` instead. We added S to the charts prefix to align with other components.
 */
export type ChartPluginParams<
  TSeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = ChartsPluginParams<TSeriesType, TSignatures>;

/**
 * @deprecated Use `ChartsProviderProps` instead. We added S to the charts prefix to align with other components.
 */
export type ChartProviderProps<
  TSeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = ChartsProviderProps<TSeriesType, TSignatures>;
