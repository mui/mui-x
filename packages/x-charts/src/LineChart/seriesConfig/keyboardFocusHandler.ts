import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '../../internals/commonNextFocusItem';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const keyboardFocusHandler: KeyboardFocusHandler<'line', ComposableCartesianChartSeriesType> = (
  event,
) => {
  switch (event.key) {
    case 'ArrowRight':
      return createGetNextIndexFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowLeft':
      return createGetPreviousIndexFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowDown':
      return createGetPreviousSeriesFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowUp':
      return createGetNextSeriesFocusedItem(composableCartesianSeriesTypes);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
