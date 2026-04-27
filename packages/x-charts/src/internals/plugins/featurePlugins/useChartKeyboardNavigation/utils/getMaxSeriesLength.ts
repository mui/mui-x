import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import type { IsItemVisibleFunction } from '../../useChartVisibilityManager';

export function getMaxSeriesLength<OutSeriesType extends Exclude<ChartSeriesType, 'sankey'>>(
  series: ProcessedSeries<ChartSeriesType>,
  availableSeriesTypes: Set<OutSeriesType>,
  isItemVisible?: IsItemVisibleFunction,
): number {
  return Object.keys(series)
    .filter((type): type is OutSeriesType => availableSeriesTypes.has(type as OutSeriesType))
    .flatMap((type) => {
      const seriesOfType = series[type]!;
      return seriesOfType.seriesOrder
        .filter((seriesId: SeriesId) => {
          const data = seriesOfType.series[seriesId].data;
          if (data.length === 0 || !data.some((value) => value != null)) {
            return false;
          }
          if (
            isItemVisible !== undefined &&
            !isItemVisible({ type, seriesId })
          ) {
            return false;
          }
          return true;
        })
        .map((seriesId: SeriesId) => seriesOfType.series[seriesId].data.length);
    })
    .reduce((maxLengths, length) => Math.max(maxLengths, length), 0);
}
