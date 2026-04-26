import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries';
import type { IsItemVisibleFunction } from '../../useChartVisibilityManager';
import { getNonEmptySeriesArray } from './getNonEmptySeriesArray';

/**
 * Returns the next series type and id that contains some data and is visible.
 * Returns `null` if no other series qualify.
 * @param series - The processed series from the store.
 * @param availableSeriesTypes - The set of series types that can be focused.
 * @param type - The current series type.
 * @param seriesId - The current series id.
 * @param isItemVisible - Optional predicate; when provided, hidden series are skipped.
 */
export function getNextNonEmptySeries<
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = Exclude<ChartSeriesType, 'sankey'>,
>(
  series: ProcessedSeries<ChartSeriesType>,
  availableSeriesTypes: Set<OutSeriesType>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
  isItemVisible?: IsItemVisibleFunction,
): {
  type: OutSeriesType;
  seriesId: SeriesId;
} | null {
  const nonEmptySeries = getNonEmptySeriesArray(series, availableSeriesTypes, isItemVisible);
  if (nonEmptySeries.length === 0) {
    return null;
  }

  const currentSeriesIndex =
    type !== undefined && seriesId !== undefined
      ? nonEmptySeries.findIndex(
          (seriesItem) => seriesItem.type === type && seriesItem.seriesId === seriesId,
        )
      : -1;
  return nonEmptySeries[(currentSeriesIndex + 1) % nonEmptySeries.length];
}
