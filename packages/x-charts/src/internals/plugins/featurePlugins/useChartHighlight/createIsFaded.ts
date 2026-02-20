import type { HighlightItemIdentifier } from '../../../../models/seriesType';
import type { ChartSeriesType, HighlightScope } from '../../../../models/seriesType/config';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isFade logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsFaded<SeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>>(
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemIdentifier<SeriesType> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  // Exclude<ChartSeriesType, 'sankey' | 'heatmap'> should be ComposableChartSeriesType<SeriesType> to be correct.
  return function isFaded<TestedSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>>(
    item: HighlightItemIdentifier<TestedSeriesType> | null,
  ): boolean {
    if (!item) {
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
