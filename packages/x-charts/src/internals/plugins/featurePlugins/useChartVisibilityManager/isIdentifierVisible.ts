import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { serializeIdentifier } from '../../corePlugins/useChartSeries/serializeIdentifier';
import type { ChartSeriesConfig } from '../../models';
import type { VisibilityIdentifier, VisibilityMap } from './useChartVisibilityManager.types';

export const isIdentifierVisible = (
  visibilityMap: VisibilityMap,
  identifier: VisibilityIdentifier,
  seriesConfig: ChartSeriesConfig<ChartSeriesType>,
): boolean => {
  const uniqueId = serializeIdentifier(seriesConfig, identifier);
  return !visibilityMap.has(uniqueId);
};
