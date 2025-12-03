import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { isIdentifierVisible } from './isIdentifierVisible';

/**
 * Selector to get the visibility manager state.
 */
const selectVisibilityManager: ChartOptionalRootSelector<UseChartVisibilityManagerSignature> = (
  state,
) => state.visibilityManager;

const EMPTY_VISIBILITY_MAP = {};

/**
 * Selector to get the hidden identifiers from the visibility manager.
 */
export const selectorVisibilityMap = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.visibilityMap ?? EMPTY_VISIBILITY_MAP,
);

/**
 * Selector to get the separator used in the visibility manager.
 */
export const selectorSeparator = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.separator ?? '-',
);

/**
 * Selector to check if a specific item identifier is visible.
 */
export const selectorIsIdentifierVisible = createSelector(
  selectorVisibilityMap,
  selectorSeparator,
  (visibilityMap, separator, identifier: string | (string | number)[]) =>
    isIdentifierVisible(visibilityMap, separator, identifier),
);

/**
 * Selector to check if a specific item identifier is hidden.
 */
export const selectorIsIdentifierVisibleGetter = createSelectorMemoized(
  selectorVisibilityMap,
  selectorSeparator,
  (visibilityMap, separator) => {
    return {
      // Return an object as selectors don't correctly memoize direct functions
      get: (identifier: string | (string | number)[]) =>
        isIdentifierVisible(visibilityMap, separator, identifier),
    };
  },
);
