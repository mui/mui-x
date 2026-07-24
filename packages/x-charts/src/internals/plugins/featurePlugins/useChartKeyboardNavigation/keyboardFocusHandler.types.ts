import type {
  CartesianChartSeriesType,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import type { ChartState } from '../../models/chart';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';

export type FocusedItemUpdater<
  SeriesType extends ChartSeriesType,
  OutputSeriesType extends ChartSeriesType = ChartSeriesType,
> = (
  currentItem: (SeriesType extends any ? FocusedItemIdentifier<SeriesType> : never) | null,
  state: SeriesType extends CartesianChartSeriesType
    ? Pick<
        ChartState<
          [UseChartKeyboardNavigationSignature],
          [UseChartCartesianAxisSignature],
          SeriesType
        >,
        'series' | 'cartesianAxis'
      >
    : Pick<ChartState<[UseChartKeyboardNavigationSignature], [], SeriesType>, 'series'>,
) => FocusedItemIdentifier<OutputSeriesType> | null;

export type KeyboardActivation = 'activate';

/**
 * Get the next focusable item in the chart.
 * @param {SeriesItemIdentifierWithType<SeriesType> | null} currentItem The current focused item.
 * @param {KeyboardEvent} event The keyboard event that triggered the navigation.
 * @param {ChartState<[UseChartKeyboardNavigationSignature], []>} state The current chart state.
 * @returns {FocusedItemUpdater<ChartSeriesType> | KeyboardActivation | null} The next focusable item updater, an activation request, or null if none found.
 */
export type KeyboardFocusHandler<
  SeriesType extends ChartSeriesType,
  OutputSeriesType extends ChartSeriesType = ChartSeriesType,
> = (
  event: KeyboardEvent,
) => FocusedItemUpdater<SeriesType, OutputSeriesType> | KeyboardActivation | null;
