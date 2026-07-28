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
  SeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap' | 'treemap'>,
  TInputSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap' | 'treemap'> = SeriesType,
>(outSeriesTypes: Set<SeriesType>, allowCycles?: boolean, useCurrentSeriesMaxLength?: boolean) {
  const keyboardFocusHandler = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        return createGetNextIndexFocusedItem<TInputSeriesType, SeriesType>(
          outSeriesTypes,
          allowCycles,
          useCurrentSeriesMaxLength,
        );
      case 'ArrowLeft':
        return createGetPreviousIndexFocusedItem<TInputSeriesType, SeriesType>(
          outSeriesTypes,
          allowCycles,
          useCurrentSeriesMaxLength,
        );
      case 'ArrowDown':
        return createGetPreviousSeriesFocusedItem<TInputSeriesType, SeriesType>(outSeriesTypes);
      case 'ArrowUp':
        return createGetNextSeriesFocusedItem<TInputSeriesType, SeriesType>(outSeriesTypes);
      default:
        return null;
    }
  };
  return keyboardFocusHandler;
}
