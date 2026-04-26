import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries';
import type { IsItemVisibleFunction } from '../../useChartVisibilityManager';
import { getNonEmptySeriesArray } from './getNonEmptySeriesArray';

/**
 * Returns the previous series type and id that contains some data and is visible.
 * Returns `null` if no other series qualify.
 */
export function getPreviousNonEmptySeries<
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

  if (currentSeriesIndex <= 0) {
    // If no current series, or if it's the first series
    return nonEmptySeries[nonEmptySeries.length - 1];
  }
  return nonEmptySeries[(currentSeriesIndex - 1 + nonEmptySeries.length) % nonEmptySeries.length];
}
