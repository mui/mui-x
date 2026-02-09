import type { HighlightItemIdentifier, } from '../../../../models';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';

export type HighlightCreator<SeriesType extends ChartSeriesType> = (
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemIdentifier<SeriesType> | null,
) => (item: HighlightItemIdentifier<ChartSeriesType> | null) => boolean;
