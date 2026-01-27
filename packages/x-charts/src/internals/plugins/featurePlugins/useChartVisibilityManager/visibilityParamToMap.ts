import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { ChartSeriesConfig } from '../../corePlugins/useChartSeriesConfig';
import { serializeIdentifier } from '../../corePlugins/useChartSeriesConfig/utils/serializeIdentifier';
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
