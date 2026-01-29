import type { SeriesItemIdentifier, ChartSeriesType, HighlightScope } from "../../../../models/seriesType";

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isFade logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsFaded<SeriesType extends 'bar' | 'line' | 'scatter' | 'pie' | 'radar'>(highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: SeriesItemIdentifier<SeriesType> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isFaded(item: SeriesItemIdentifier<ChartSeriesType> | null): boolean {
    if (!item) {
      return false;
    }

    if (item.type === 'sankey') {
      return false;
    }

    if (highlightScope.fade === 'series') {
      return (
        item.seriesId === highlightedItem.seriesId && item.dataIndex !== highlightedItem.dataIndex
      );
    }

    if (highlightScope.fade === 'global') {
      return (
        item.seriesId !== highlightedItem.seriesId || item.dataIndex !== highlightedItem.dataIndex
      );
    }

    return false;
  };
}
