import { type Store } from '@mui/x-internals/store';
import type {
  ChartAnyPluginSignature,
  ChartInstance,
  ChartPublicAPI,
  ChartState,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
} from '../../internals/plugins/models';
import type { ChartCorePluginSignatures } from '../../internals/plugins/corePlugins';
import type { UseChartBaseProps } from '../../internals/store/useCharts.types';
import type { ChartSeriesType } from '../../models/seriesType/config';

export type ChartsContextValue<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = {
  /**
   * And object with all the methods needed to interact with the chart.
   */
  instance: ChartInstance<TSignatures, TOptionalSignatures>;
  /**
   * A subset of the `instance` method that are exposed to the developers.
   */
  publicAPI: ChartPublicAPI<TSignatures, TOptionalSignatures>;
  /**
   * The internal state of the chart.
   */
  store: Store<ChartState<TSignatures, TOptionalSignatures>>;
};

export type ChartsPluginParams<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> = UseChartBaseProps<TSignatures> &
  MergeSignaturesProperty<[...ChartCorePluginSignatures<SeriesType>, ...TSignatures], 'params'>;

export interface ChartsProviderProps<
  SeriesType extends ChartSeriesType,
  TSignatures extends readonly ChartAnyPluginSignature[],
> {
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: ChartsPluginParams<SeriesType, TSignatures>;
}
