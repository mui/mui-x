import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from '../../internals/commonNextFocusItem';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'bar' | 'line' | 'scatter'> = new Set(['bar', 'line', 'scatter']);

const keyboardFocusHandler: KeyboardFocusHandler<'scatter', 'bar' | 'line' | 'scatter'> = (
  event,
) => {
  switch (event.key) {
    case 'ArrowRight':
      return createGetNextIndexFocusedItem(outSeriesTypes);
    case 'ArrowLeft':
      return createGetPreviousIndexFocusedItem(outSeriesTypes);
    case 'ArrowDown':
      return createGetPreviousSeriesFocusedItem(outSeriesTypes);
    case 'ArrowUp':
      return createGetNextSeriesFocusedItem(outSeriesTypes);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
