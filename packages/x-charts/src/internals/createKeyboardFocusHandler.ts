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
>(outSeriesTypes: Set<Exclude<ChartSeriesType, 'sankey'>>, allowCycles?: boolean) {
  // @ts-expect-error
  const keyboardFocusHandler: KeyboardFocusHandler<TSeriesType, OutputSeriesType> = (event) => {
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
