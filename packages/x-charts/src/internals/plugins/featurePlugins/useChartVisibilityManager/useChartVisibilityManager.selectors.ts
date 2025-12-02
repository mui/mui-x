import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { ChartOptionalRootSelector } from '../../utils/selectors';
import { isIdentifierVisible } from './isIdentifierVisible';

/**
 * Selector to get the visibility manager state.
 */
const selectVisibilityManager: ChartOptionalRootSelector<UseChartVisibilityManagerSignature> = (
  state,
) => state.visibilityManager;

/**
 * Selector to get the hidden identifiers from the visibility manager.
 */
export const selectorVisibilityMap = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.visibilityMap ?? {},
);

/**
 * Selector to get the separator used in the visibility manager.
 */
export const selectorSeparator = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.separator ?? '-',
);

/**
 * Selector to check if a specific item identifier is hidden.
 */
export const selectorIsIdentifierHidden = createSelector(
  selectorVisibilityMap,
  selectorSeparator,
  (visibilityMap, separator, identifier: string | (string | number)[]) =>
    isIdentifierVisible(visibilityMap, separator, identifier),
);

/**
 * Selector to check if a specific item identifier is hidden.
 */
export const selectorIsIdentifierHiddenGetter = createSelectorMemoized(
  selectorVisibilityMap,
  selectorSeparator,
  (visibilityMap, separator) => {
    return {
      // Return an object as selectors don't correctly memoize direct functions
      fn: (identifier: string | (string | number)[]) =>
        isIdentifierVisible(visibilityMap, separator, identifier),
    };
  },
);
