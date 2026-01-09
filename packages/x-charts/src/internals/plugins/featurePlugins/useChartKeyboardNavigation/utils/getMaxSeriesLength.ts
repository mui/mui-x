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
        .filter(
          (seriesId: SeriesId) =>
            seriesOfType.series[seriesId].data.length > 0 &&
            seriesOfType.series[seriesId].data.some((value) => value != null),
        )
        .map((seriesId: SeriesId) => seriesOfType.series[seriesId].data.length);
    })
    .reduce((maxLengths, length) => Math.max(maxLengths, length), 0);
}
