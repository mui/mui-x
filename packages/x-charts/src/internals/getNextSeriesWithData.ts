import {
  type ChartSeriesType,
  type ChartsSeriesConfig,
} from '../models/seriesType/config';
import { type SeriesId } from '../models/seriesType/common';
import { type ProcessedSeries } from './plugins/corePlugins/useChartSeries';
import { type FocusableSeriesTypes } from './plugins/featurePlugins/useChartKeyboardNavigation/useChartKeyboardNavigation.types';
import { isFocusableSeriesType } from './plugins/featurePlugins/useChartKeyboardNavigation/isFocusableSeriesType';

/**
 * Returns the next series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
export function getNextSeriesWithData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type?: FocusableSeriesTypes,
  seriesId?: SeriesId,
): {
  type: FocusableSeriesTypes;
  seriesId: SeriesId;
} | null {
  const seriesType = Object.keys(series) as Array<ChartSeriesType>;
  const startingTypeIndex = type !== undefined && series[type] ? seriesType.indexOf(type) : 0;
  const currentSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : -1;
  const typesAvailable = seriesType.filter(isFocusableSeriesType);

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
