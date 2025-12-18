import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId } from '../models/seriesType/common';
import type { ProcessedSeries } from './plugins/corePlugins/useChartSeries';

/**
 * Returns the previous series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
export function getPreviousSeriesWithData<
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey'> = Exclude<ChartSeriesType, 'sankey'>,
>(
  series: ProcessedSeries<ChartSeriesType>,
  availableSeriesTypes: Set<OutSeriesType>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
): {
  type: OutSeriesType;
  seriesId: SeriesId;
} | null {
  const seriesType = Object.keys(series) as Array<ChartSeriesType>;
  const startingSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : 1;

  const typesAvailable = seriesType.filter((t): t is OutSeriesType =>
    availableSeriesTypes?.has(t as OutSeriesType),
  );
  const startingTypeIndex =
    type !== undefined && series[type] ? typesAvailable.indexOf(type as OutSeriesType) : 0;

  // Loop over all series types starting with the current seriesType
  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (typesAvailable.length + startingTypeIndex - typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    const maxGap = typeGap === 0 ? startingSeriesIndex + 1 : seriesOfType.seriesOrder.length;
    for (let seriesGap = 1; seriesGap < maxGap; seriesGap += 1) {
      const seriesIndex =
        (seriesOfType.seriesOrder.length + startingSeriesIndex - seriesGap) %
        seriesOfType.seriesOrder.length;

      if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
        return {
          type: typesAvailable[typeIndex],
          seriesId: seriesOfType.seriesOrder[seriesIndex],
        };
      }
    }
  }

  // End looping on the initial type down to the initial series (excluded)
  const typeIndex = startingTypeIndex;
  const seriesOfType = series[typesAvailable[typeIndex]]!;

  const availableSeriesIds = seriesOfType.seriesOrder;

  for (
    let seriesIndex = availableSeriesIds.length - 1;
    seriesIndex > startingSeriesIndex;
    seriesIndex -= 1
  ) {
    if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
      return {
        type: typesAvailable[typeIndex],
        seriesId: seriesOfType.seriesOrder[seriesIndex],
      };
    }
  }
  return null;
}
