import type {
  SeriesItemIdentifier,
  ChartSeriesType,
  HighlightScope,
} from '../../../../models/seriesType';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isHighlighted logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsHighlighted<
  SeriesType extends 'bar' | 'line' | 'scatter' | 'pie' | 'radar',
>(
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: SeriesItemIdentifier<SeriesType> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted(item: SeriesItemIdentifier<ChartSeriesType> | null): boolean {
    if (!item) {
      return false;
    }

    if (item.type === 'sankey') {
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
