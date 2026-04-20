import type { HighlightItemIdentifierWithType } from '../../../../models/seriesType';
import type { ComposableChartSeriesType } from '../../../../models/seriesType/composition';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isHighlighted logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsHighlighted<
  SeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
>(
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemIdentifierWithType<SeriesType> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted<TestedSeriesType extends ComposableChartSeriesType<SeriesType>>(
    item: HighlightItemIdentifierWithType<TestedSeriesType> | null,
  ): boolean {
    if (!item) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return item.seriesId === highlightedItem.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        item.dataIndex === highlightedItem.dataIndex && item.seriesId === highlightedItem.seriesId
      );
    }

    return false;
  };
}
