import type {
  SeriesItemIdentifierWithType,
  FocusedItemIdentifier,
} from '../../../../../models/seriesType';
import type { ChartState } from '../../../models/chart';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ChartSeriesTypeRequiredPlugins } from './seriesConfig.types';

/**
 * Completes an item identifier with the data a pointer click would provide, so keyboard activation
 * emits the same payload as `getItemAtPosition`.
 * @param {ChartState} state The chart state.
 * @param {FocusedItemIdentifier<SeriesType>} identifier The identifier to complete.
 * @returns {SeriesItemIdentifierWithType<SeriesType>} The identifier with its click data.
 */
export type GetItemWithData<SeriesType extends ChartSeriesType> = (
  state: ChartState<ChartSeriesTypeRequiredPlugins<SeriesType>>,
  identifier: FocusedItemIdentifier<SeriesType>,
) => SeriesItemIdentifierWithType<SeriesType>;
