import {
  getNextIndexFocusedItem,
  getPreviousIndexFocusedItem,
  getPreviousSeriesFocusedItem,
  getNextSeriesFocusedItem,
} from '../../internals/commonNextFocusItem';
import type { GetNextFocusedItem } from '../../internals/plugins/models/seriesConfig/getNextFocusedItem.types';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const getNextFocusedItem: GetNextFocusedItem<'pie'> = (currentItem, event, state) => {
  switch (event.key) {
    case 'ArrowRight':
      return getNextIndexFocusedItem<'pie', 'pie'>(currentItem, outSeriesTypes, state);
    case 'ArrowLeft':
      return getPreviousIndexFocusedItem<'pie', 'pie'>(currentItem, outSeriesTypes, state);
    case 'ArrowDown':
      return getPreviousSeriesFocusedItem<'pie', 'pie'>(currentItem, outSeriesTypes, state);
    case 'ArrowUp':
      return getNextSeriesFocusedItem<'pie', 'pie'>(currentItem, outSeriesTypes, state);
    default:
      return null;
  }
};

export default getNextFocusedItem;
