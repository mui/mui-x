import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from '../../internals/commonNextFocusItem';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'radar'> = new Set(['radar']);

const keyboardFocusHandler: KeyboardFocusHandler<'radar', 'radar'> = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      return createGetNextIndexFocusedItem(outSeriesTypes, true);
    case 'ArrowLeft':
      return createGetPreviousIndexFocusedItem(outSeriesTypes, true);
    case 'ArrowDown':
      return createGetPreviousSeriesFocusedItem(outSeriesTypes);
    case 'ArrowUp':
      return createGetNextSeriesFocusedItem(outSeriesTypes);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
