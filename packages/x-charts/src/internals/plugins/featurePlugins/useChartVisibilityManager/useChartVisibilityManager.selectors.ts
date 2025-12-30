import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type {
  UseChartVisibilityManagerSignature,
  VisibilityIdentifier,
} from './useChartVisibilityManager.types';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { isIdentifierVisible } from './isIdentifierVisible';
import { selectorChartSeriesConfig } from '../../corePlugins/useChartSeries';

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

/**
 * Selector that returns a function which returns whether an item is visible.
 */
export const selectorIsItemVisibleGetter = createSelectorMemoized(
  selectorVisibilityMap,
  selectorChartSeriesConfig,
  (visibilityMap, seriesConfig) => {
    return (identifier: VisibilityIdentifier) =>
      isIdentifierVisible(visibilityMap, identifier, seriesConfig);
  },
);
