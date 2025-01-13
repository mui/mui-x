import * as React from 'react';
import {
  ChartAnyPluginSignature,
  ChartInstance,
  ChartPublicAPI,
  ConvertSignaturesIntoPlugins,
  MergeSignaturesProperty,
} from '../../internals/plugins/models';
import { ChartStore } from '../../internals/plugins/utils/ChartStore';
import { ChartCorePluginSignatures } from '../../internals/plugins/corePlugins';
import { ChartSeriesConfig } from '../../internals/plugins/models/seriesConfig';
import { UseChartBaseProps } from '../../internals/store/useCharts.types';
import { ChartSeriesType } from '../../models/seriesType/config';

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
  store: ChartStore<TSignatures>;
  /**
   * The ref to the <svg />.
   */
  svgRef: React.RefObject<SVGSVGElement | null>;
};

export interface ChartProviderProps<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TSeries extends ChartSeriesType = ChartSeriesType,
> {
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: UseChartBaseProps<TSignatures> &
    MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'params'>;
  /**
   * The configuration helpers used to compute attributes according to the serries type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig?: ChartSeriesConfig<TSeries>;
  children: React.ReactNode;
}
