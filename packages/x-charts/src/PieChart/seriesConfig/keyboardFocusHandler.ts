import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from '../../internals/commonNextFocusItem';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const keyboardFocusHandler: KeyboardFocusHandler<'pie', 'pie'> = (event) => {
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
