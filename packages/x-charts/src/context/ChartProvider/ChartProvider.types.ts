import type * as React from 'react';
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

export type ChartContextValue<
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
  /**
   * The ref to the <svg />.
   */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /**
   * The ref to the chart root element.
   */
  chartRootRef: React.RefObject<HTMLDivElement | null>;
};

export type ChartPluginParams<TSignatures extends readonly ChartAnyPluginSignature[]> =
  UseChartBaseProps<TSignatures> &
    MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'params'>;

export interface ChartProviderProps<TSignatures extends readonly ChartAnyPluginSignature[] = []> {
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: ChartPluginParams<TSignatures>;
}
