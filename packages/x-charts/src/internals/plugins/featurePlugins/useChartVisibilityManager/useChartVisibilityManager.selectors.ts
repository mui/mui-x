import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type {
  UseChartVisibilityManagerSignature,
  VisibilityIdentifier,
  VisibilityMap,
} from './useChartVisibilityManager.types';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import {
  selectorChartSeriesConfig,
  type ChartSeriesConfig,
} from '../../corePlugins/useChartSeriesConfig';
import { serializeIdentifier } from '../../corePlugins/useChartSeriesConfig/utils/serializeIdentifier';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

/**
 * Selector to get the visibility manager state.
 */
const selectVisibilityManager: ChartOptionalRootSelector<UseChartVisibilityManagerSignature> = (
  state,
) => state.visibilityManager;

export const EMPTY_VISIBILITY_MAP = new Map();

/**
 * Selector to get the hidden identifiers from the visibility manager.
 */
export const selectorVisibilityMap = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.visibilityMap ?? EMPTY_VISIBILITY_MAP,
);

const selectorIsItemVisibleFn = <T extends ChartSeriesType>(
  visibilityMap: VisibilityMap,
  seriesConfig: ChartSeriesConfig<T>,
) => {
  return (identifier: VisibilityIdentifier<T>) => {
    const uniqueId = serializeIdentifier(seriesConfig, identifier);
    return !visibilityMap.has(uniqueId);
  };
};

/**
 * Selector that returns a function which returns whether an item is visible.
 */
export const selectorIsItemVisibleGetter = createSelectorMemoized(
  selectorVisibilityMap,
  selectorChartSeriesConfig,
  selectorIsItemVisibleFn,
);
