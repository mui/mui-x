import type { SeriesId } from '../../../../../models/seriesType/common';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';

export function getMaxSeriesLength<OutSeriesType extends Exclude<ChartSeriesType, 'sankey'>>(
  series: ProcessedSeries<ChartSeriesType>,
  availableSeriesTypes: Set<OutSeriesType>,
): number {
  return Object.keys(series)
    .filter((type): type is OutSeriesType => availableSeriesTypes.has(type as OutSeriesType))
    .flatMap((type) => {
      const seriesOfType = series[type]!;
      return seriesOfType.seriesOrder
        .filter((seriesId: SeriesId) => {
          const seriesItem = seriesOfType.series[seriesId];
          if ('hidden' in seriesItem && seriesItem.hidden) {
            return false;
          }
          const data = seriesItem.data as unknown;
          // Columnar scatter data: typed-array-backed, no per-point hidden flag.
          if (
            data != null &&
            typeof data === 'object' &&
            (data as { __columnar?: true }).__columnar === true
          ) {
            return (data as { length: number }).length > 0;
          }
          const arrayData = data as readonly unknown[];
          return (
            arrayData.length > 0 &&
            arrayData.some(
              (value: unknown) =>
                value != null && !(typeof value === 'object' && 'hidden' in value && value.hidden),
            )
          );
        })
        .map((seriesId: SeriesId) => seriesOfType.series[seriesId].data.length);
    })
    .reduce((maxLengths, length) => Math.max(maxLengths, length), 0);
}
