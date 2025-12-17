import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { UseChartKeyboardNavigationSignature } from '../../featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.types';
import type { ChartState } from '../chart';

/**
 * Get the next focusable item in the chart.
 * @param {SeriesItemIdentifier<TSeriesType> | null} currentItem The current focused item.
 * @param {KeyboardEvent} event The keyboard event that triggered the navigation.
 * @param {ChartState<[UseChartKeyboardNavigationSignature], []>}state The current chart state.
 * @returns {SeriesItemIdentifier<ChartSeriesType> | null} The next focusable item or null if none found.
 */
export type GetNextFocusedItem<
  TSeriesType extends ChartSeriesType,
  OutputSeriesType extends ChartSeriesType = ChartSeriesType,
> = (
  currentItem: (TSeriesType extends any ? FocusedItemIdentifier<TSeriesType> : never) | null,
  event: KeyboardEvent,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
) => FocusedItemIdentifier<OutputSeriesType> | null;
