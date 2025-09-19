import { ChartSeriesType, ChartsSeriesConfig } from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';

/**
 * Returns the next series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
export function getNextSeriesWithData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
): {
  type: Exclude<ChartSeriesType, 'sankey'>;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const currentSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : -1;
  const typesAvailable = Object.keys(series).filter((t) => t !== 'sankey') as Exclude<
    ChartSeriesType,
    'sankey'
  >[];

  // Loop over all series types starting with the current seriesType
  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (startingTypeIndex + typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    // Edge case for the current series type: we don't loop on previous series of the same type.
    const startingSeriesIndex = typeGap === 0 ? currentSeriesIndex + 1 : 0;

    for (
      let seriesIndex = startingSeriesIndex;
      seriesIndex < seriesOfType.seriesOrder.length;
      seriesIndex += 1
    ) {
      if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
        return {
          type: typesAvailable[typeIndex],
          seriesId: seriesOfType.seriesOrder[seriesIndex],
        };
      }
    }
  }

  // End looping on the initial type up to the initial series (excluded)
  const typeIndex = startingTypeIndex;
  const seriesOfType = series[typesAvailable[typeIndex]]!;

  const endingSeriesIndex = currentSeriesIndex;

  for (let seriesIndex = 0; seriesIndex < endingSeriesIndex; seriesIndex += 1) {
    if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
      return {
        type: typesAvailable[typeIndex],
        seriesId: seriesOfType.seriesOrder[seriesIndex],
      };
    }
  }

  return null;
}

/**
 * Returns the previous series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
export function getPreviousSeriesWithData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
): {
  type: Exclude<ChartSeriesType, 'sankey'>;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const startingSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : 1;

  const typesAvailable = Object.keys(series).filter((t) => t !== 'sankey') as Exclude<
    ChartSeriesType,
    'sankey'
  >[];

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

export function seriesHasData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type: ChartSeriesType,
  seriesId: SeriesId,
) {
  // @ts-ignore snakey is not in MIT version
  if (type === 'sankey') {
    return false;
  }
  const data = series[type]?.series[seriesId]?.data;
  return data && data.length > 0;
}
