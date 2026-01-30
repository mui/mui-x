import '../typeOverloads';

import type { ChartAnyPluginSignature } from '@mui/x-charts/internals';
import type {
  ChartProApi as ChartProApiOriginal,
  ProPluginsPerSeriesType,
} from '../context/ChartProApi';
import type { AllPluginSignatures } from '../internals/plugins/allPlugins';

export * from './ChartsContainerPro';
export * from './useChartsContainerProProps';

/**
 * @deprecated Use `ChartProApi` from `@mui/x-charts/context` instead.
 */
export type ChartProApi<
  ChartType extends keyof ProPluginsPerSeriesType | undefined = undefined,
  Signatures extends readonly ChartAnyPluginSignature[] =
    ChartType extends keyof ProPluginsPerSeriesType
      ? ProPluginsPerSeriesType[ChartType]
      : AllPluginSignatures,
> = ChartProApiOriginal<ChartType, Signatures>;
