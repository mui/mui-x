import { createSelector, createSelectorMemoized } from '@mui/x-internals/store';
import type {
  UseChartVisibilityManagerSignature,
  VisibilityIdentifier,
} from './useChartVisibilityManager.types';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { isIdentifierVisible } from './isIdentifierVisible';

/**
 * Selector to get the visibility manager state.
 */
const selectVisibilityManager: ChartOptionalRootSelector<UseChartVisibilityManagerSignature> = (
  state,
) => state.visibilityManager;

export const EMPTY_VISIBILITY_MAP = {};

/**
 * Selector to get the hidden identifiers from the visibility manager.
 */
export const selectorVisibilityMap = createSelector(
  selectVisibilityManager,
  (visibilityManager) => visibilityManager?.visibilityMap ?? EMPTY_VISIBILITY_MAP,
);

/**
 * Selector to check if a specific item identifier is hidden.
 */
export const selectorIsItemVisibleGetter = createSelectorMemoized(
  selectorVisibilityMap,
  (visibilityMap) => {
    return (...identifiers: VisibilityIdentifier[]) =>
      isIdentifierVisible(visibilityMap, identifiers);
  },
);
