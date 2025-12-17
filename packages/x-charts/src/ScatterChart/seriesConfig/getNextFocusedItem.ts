import {
  getNextIndexFocusedItem,
  getPreviousIndexFocusedItem,
  getPreviousSeriesFocusedItem,
  getNextSeriesFocusedItem,
} from '../../internals/commonNextFocusItem';
import type { GetNextFocusedItem } from '../../internals/plugins/models/seriesConfig/getNextFocusedItem.types';

const outSeriesTypes: Set<'bar' | 'line' | 'scatter'> = new Set(['bar', 'line', 'scatter']);

const getNextFocusedItem: GetNextFocusedItem<'scatter'> = (currentItem, event, state) => {
  switch (event.key) {
    case 'ArrowRight':
      return getNextIndexFocusedItem<'scatter', 'bar' | 'line' | 'scatter'>(
        currentItem,
        outSeriesTypes,
        state,
      );
    case 'ArrowLeft':
      return getPreviousIndexFocusedItem<'scatter', 'bar' | 'line' | 'scatter'>(
        currentItem,
        outSeriesTypes,
        state,
      );
    case 'ArrowDown':
      return getPreviousSeriesFocusedItem<'scatter', 'bar' | 'line' | 'scatter'>(
        currentItem,
        outSeriesTypes,
        state,
      );
    case 'ArrowUp':
      return getNextSeriesFocusedItem<'scatter', 'bar' | 'line' | 'scatter'>(
        currentItem,
        outSeriesTypes,
        state,
      );
    default:
      return null;
  }
};

export default getNextFocusedItem;
