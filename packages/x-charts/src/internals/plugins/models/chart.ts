import type { ReadonlyStore } from '@mui/x-internals/store';
import type { ChartAnyPluginSignature } from './plugin';
import type { MergeSignaturesProperty } from './helpers';
import type { ChartCorePluginSignatures } from '../corePlugins';
import type { ChartSeriesType } from '../../../models/seriesType/config';

export type ChartInstance<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'instance'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;

export type ChartPublicAPI<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
> = MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'publicAPI'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;

export type ChartStateCacheKey = { id: number };

/**
 * A loosely-typed, read-only view of a chart store, accepting any plugin
 * signatures. Useful where a helper only needs to read state (e.g. a series
 * type sourcing extra state for its tooltip) and should not be coupled to a
 * specific plugin set. Being read-only, a concretely-typed store is assignable
 * to it without a cast.
 */
export type ChartStore = ReadonlyStore<ChartState<ChartAnyPluginSignature[]>>;

export type ChartState<
  TSignatures extends readonly ChartAnyPluginSignature[],
  TOptionalSignatures extends readonly ChartAnyPluginSignature[] = [],
  SeriesType extends ChartSeriesType = ChartSeriesType,
> = MergeSignaturesProperty<[...ChartCorePluginSignatures<SeriesType>, ...TSignatures], 'state'> &
  Partial<MergeSignaturesProperty<TOptionalSignatures, 'state'>> & {
    /**
     * The key used to identify the chart in the global cache object.
     */
    cacheKey: ChartStateCacheKey;
  };
