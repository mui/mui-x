import type { ChartSeriesType } from '../models/seriesType/config';
import { createCommonKeyboardFocusHandler } from './createCommonKeyboardFocusHandler';

/**
 * Create a keyboard focus handler for common use cases where focused items are defined by series ID and data index.
 */
export function createActivatingKeyboardFocusHandler<
  SeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  TInputSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = SeriesType,
>(outSeriesTypes: Set<SeriesType>, allowCycles?: boolean, useCurrentSeriesMaxLength?: boolean) {
  const commonHandler = createCommonKeyboardFocusHandler<SeriesType, TInputSeriesType>(
    outSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

  const keyboardFocusHandler = (event: KeyboardEvent) => {
    // Repeats are reported as activations too, so the caller can keep preventing the default
    // scroll while the key is held. It is up to the caller to only fire the callback once.
    if (event.key === ' ' || event.key === 'Enter') {
      return 'activate' as const;
    }

    return commonHandler(event);
  };

  return keyboardFocusHandler;
}
