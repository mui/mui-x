import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { serializeIdentifier } from '../../corePlugins/useChartSeries/serializeIdentifier';
import type { ChartSeriesConfig } from '../../models';
import type { VisibilityIdentifier, VisibilityMap } from './useChartVisibilityManager.types';

export const visibilityParamToMap = (
  hiddenItems: VisibilityIdentifier[] | undefined,
  seriesConfig: ChartSeriesConfig<ChartSeriesType>,
): VisibilityMap => {
  const visibilityMap: VisibilityMap = new Map();

  if (hiddenItems) {
    hiddenItems.forEach((identifier) => {
      const uniqueId = serializeIdentifier(seriesConfig, identifier);
      visibilityMap.set(uniqueId, identifier);
    });
  }

  return visibilityMap;
};
