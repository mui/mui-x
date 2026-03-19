import type { ComposableChartSeriesType } from '../../../../models/seriesType/composition';
import type { HighlightItemIdentifierWithType } from '../../../../models';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';

export type HighlightCreator<SeriesType extends ChartSeriesType> = (
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemIdentifierWithType<SeriesType> | null,
) => <TestedSeriesType extends ComposableChartSeriesType<SeriesType>>(
  item: HighlightItemIdentifierWithType<TestedSeriesType> | null,
) => boolean;
