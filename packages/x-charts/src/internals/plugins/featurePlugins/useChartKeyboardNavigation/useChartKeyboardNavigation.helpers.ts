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
  type: ChartSeriesType;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const currentSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : -1;
  const typesAvailable = Object.keys(series) as (keyof typeof series)[];

  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (startingTypeIndex + typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    const startingSeriesIndex =
      typeGap === 0 ? (currentSeriesIndex + 1) % seriesOfType.seriesOrder.length : 0;

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

  // End looping on the initial type up to the initial series
  const typeIndex = startingTypeIndex % typesAvailable.length;
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
  type: ChartSeriesType;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const startingSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : 1;

  const typesAvailable = Object.keys(series) as (keyof typeof series)[];

  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (typesAvailable.length + startingTypeIndex - typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    for (let seriesGap = 1; seriesGap < seriesOfType.seriesOrder.length; seriesGap += 1) {
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

  return null;
}

export function seriesHasData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type: ChartSeriesType,
  seriesId: SeriesId,
) {
  const data = series[type]?.series[seriesId]?.data;
  return data && data.length > 0;
}
