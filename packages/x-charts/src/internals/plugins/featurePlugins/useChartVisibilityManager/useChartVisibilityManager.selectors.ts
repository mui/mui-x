import { createSelector } from '@mui/x-internals/store';
import type { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { ChartOptionalRootSelector } from '../../utils/selectors';

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
  (visibilityManager) => visibilityManager?.visibilityMap,
);

/**
 * Selector to check if a specific item identifier is hidden.
 */
export const selectorIsIdentifierHidden = createSelector(
  selectorVisibilityMap,
  (visibilityMap, identifier: string | undefined) => {
    if (!visibilityMap || !identifier) {
      return false;
    }

    return visibilityMap?.[identifier] === true;
  },
);
