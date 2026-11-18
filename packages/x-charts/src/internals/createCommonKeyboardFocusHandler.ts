import type { ChartSeriesType } from '../models/seriesType/config';
import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetFirstIndexFocusedItem,
  createGetLastIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
  createGetFirstSeriesFirstIndexFocusedItem,
  createGetLastSeriesLastIndexFocusedItem,
  createGetFirstSeriesFocusedItem,
  createGetLastSeriesFocusedItem,
} from './commonNextFocusItem';

/**
 * Create a keyboard focus handler for common use cases where focused item are defined by the series is and data index.
 */
export function createCommonKeyboardFocusHandler<
  SeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  TInputSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = SeriesType,
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
      case 'Home':
        // Ctrl+Home (⌘+Home on macOS) jumps to the first item of the first series.
        if (event.ctrlKey || event.metaKey) {
          return createGetFirstSeriesFirstIndexFocusedItem<TInputSeriesType, SeriesType>(
            outSeriesTypes,
            useCurrentSeriesMaxLength,
          );
        }
        return createGetFirstIndexFocusedItem<TInputSeriesType, SeriesType>(
          outSeriesTypes,
          useCurrentSeriesMaxLength,
        );
      case 'End':
        // Ctrl+End (⌘+End on macOS) jumps to the last item of the last series.
        if (event.ctrlKey || event.metaKey) {
          return createGetLastSeriesLastIndexFocusedItem<TInputSeriesType, SeriesType>(
            outSeriesTypes,
            useCurrentSeriesMaxLength,
          );
        }
        return createGetLastIndexFocusedItem<TInputSeriesType, SeriesType>(
          outSeriesTypes,
          useCurrentSeriesMaxLength,
        );
      case 'PageUp':
        return createGetFirstSeriesFocusedItem<TInputSeriesType, SeriesType>(outSeriesTypes);
      case 'PageDown':
        return createGetLastSeriesFocusedItem<TInputSeriesType, SeriesType>(outSeriesTypes);
      default:
        return null;
    }
  };
  return keyboardFocusHandler;
}
