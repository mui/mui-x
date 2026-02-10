import { ChartSeriesType, ChartsSeriesConfig } from '../models/seriesType/config';
import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from './commonNextFocusItem';
import type { KeyboardFocusHandler } from './plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

function createKeyboardFocusHandler<
  TSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  OutputSeriesType extends Exclude<ChartSeriesType, 'sankey'> = TSeriesType,
>(outSeriesTypes: Set<Exclude<ChartSeriesType, 'sankey'>>) {
  const keyboardFocusHandler: KeyboardFocusHandler<TSeriesType, OutputSeriesType> = (event) => {
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
  return keyboardFocusHandler;
}

export default createKeyboardFocusHandler;
