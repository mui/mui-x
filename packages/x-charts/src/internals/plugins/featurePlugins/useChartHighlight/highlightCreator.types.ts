import type { SeriesItemIdentifier } from '../../../../models';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';

export type HighlightCreator<SeriesType extends ChartSeriesType> = (
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: SeriesItemIdentifier<SeriesType> | null,
) => (item: SeriesItemIdentifier<ChartSeriesType> | null) => boolean;
