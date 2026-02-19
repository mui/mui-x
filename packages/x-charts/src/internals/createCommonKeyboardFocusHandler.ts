import type { ChartSeriesType } from '../models/seriesType/config';
import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from './commonNextFocusItem';

/**
 * Create a keyboard focus handler for common use cases where focused item are defined by the series is and data index.
 */
export function createCommonKeyboardFocusHandler<
  TSeriesType extends Exclude<ChartSeriesType, 'sankey'>,
  TInputSeriesType extends Exclude<ChartSeriesType, 'sankey'> = TSeriesType,
>(outSeriesTypes: Set<TSeriesType>, allowCycles?: boolean) {
  const keyboardFocusHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        return createGetNextIndexFocusedItem<TInputSeriesType, TSeriesType>(outSeriesTypes, allowCycles);
      case 'ArrowLeft':
        return createGetPreviousIndexFocusedItem<TInputSeriesType, TSeriesType>(outSeriesTypes, allowCycles);
      case 'ArrowDown':
        return createGetPreviousSeriesFocusedItem<TInputSeriesType, TSeriesType>(outSeriesTypes);
      case 'ArrowUp':
        return createGetNextSeriesFocusedItem<TInputSeriesType, TSeriesType>(outSeriesTypes);
      default:
        return null;
    }
  };
  return keyboardFocusHandler;
}
