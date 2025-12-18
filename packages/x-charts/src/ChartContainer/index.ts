import type { ChartApi as ChartApiOriginal, PluginsPerSeriesType } from '../context/ChartApi';
import type { ChartAnyPluginSignature } from '../internals/plugins/models/plugin';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export * from './ChartContainer';

/**
 * @deprecated Use `ChartApi` from `@mui/x-charts/context` instead.
 */
export type ChartApi<
  TSeries extends keyof PluginsPerSeriesType | undefined = undefined,
  TSignatures extends readonly ChartAnyPluginSignature[] =
    TSeries extends keyof PluginsPerSeriesType
      ? PluginsPerSeriesType[TSeries]
      : AllPluginSignatures,
> = ChartApiOriginal<TSeries, TSignatures>;
