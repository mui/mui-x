import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier } from '../../../../models/seriesType';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import type { ChartState } from '../../models/chart';

export type FocusedItemUpdater<
  TSeriesType extends ChartSeriesType,
  OutputSeriesType extends ChartSeriesType = ChartSeriesType,
> = (
  currentItem: (TSeriesType extends any ? FocusedItemIdentifier<TSeriesType> : never) | null,
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
) => FocusedItemIdentifier<OutputSeriesType> | null;

/**
 * Get the next focusable item in the chart.
 * @param {SeriesItemIdentifier<TSeriesType> | null} currentItem The current focused item.
 * @param {KeyboardEvent} event The keyboard event that triggered the navigation.
 * @param {ChartState<[UseChartKeyboardNavigationSignature], []>} state The current chart state.
 * @returns {SeriesItemIdentifier<ChartSeriesType> | null} The next focusable item or null if none found.
 */
export type KeyboardFocusHandler<
  TSeriesType extends ChartSeriesType,
  OutputSeriesType extends ChartSeriesType = ChartSeriesType,
> = (event: KeyboardEvent) => FocusedItemUpdater<TSeriesType, OutputSeriesType> | null;
