import type { ChartSeriesType } from '../models/seriesType/config';
import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from './commonNextFocusItem';

function createKeyboardFocusHandler(
  outSeriesTypes: Set<Exclude<ChartSeriesType, 'sankey'>>,
  allowCycles?: boolean,
) {
  const keyboardFocusHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        return createGetNextIndexFocusedItem(outSeriesTypes, allowCycles);
      case 'ArrowLeft':
        return createGetPreviousIndexFocusedItem(outSeriesTypes, allowCycles);
      case 'ArrowDown':
        return createGetPreviousSeriesFocusedItem(outSeriesTypes);
      case 'ArrowUp':
        return createGetNextSeriesFocusedItem(outSeriesTypes);
      default:
        return null;
    }
  };
  return keyboardFocusHandler;
}

export default createKeyboardFocusHandler;
