import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type HighlightScope } from './highlightConfig.types';
import { type HighlightItemIdentifier } from '../../../../models/seriesType';

function alwaysFalse(): boolean {
  return false;
}

/**
 * The isHighlighted logic for main charts (those that are identified by an id and a dataIndex)
 */
export function createIsHighlighted<SeriesType extends Exclude<ChartSeriesType, 'sankey'>>(
  highlightScope: HighlightScope<SeriesType> | null | undefined,
  highlightedItem: HighlightItemIdentifier<SeriesType> | null,
) {
  if (!highlightScope || !highlightedItem) {
    return alwaysFalse;
  }

  return function isHighlighted(item: HighlightItemIdentifier<ChartSeriesType> | null): boolean {
    if (!item) {
      return false;
    }

    // @ts-ignore Sankey is only in pro package
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
