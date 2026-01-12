
import type { SeriesItemIdentifier } from '../../../../models/seriesType';
import type { ChartInstance, ChartState } from '../chart';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartAnyPluginSignature } from '../plugin';

export type GetItemAtPosition<TSeriesType extends ChartSeriesType,
    RequiredPluginsSignatures extends readonly ChartAnyPluginSignature[] = [],
    OptionalPluginsSignatures extends readonly ChartAnyPluginSignature[] = []> = (
        state: ChartState<RequiredPluginsSignatures, OptionalPluginsSignatures>,
        instance: ChartInstance<RequiredPluginsSignatures, OptionalPluginsSignatures>,
        point: { x: number; y: number },
    ) => SeriesItemIdentifier<TSeriesType> | undefined;