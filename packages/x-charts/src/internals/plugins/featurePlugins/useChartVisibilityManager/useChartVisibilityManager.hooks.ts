import { useStore } from '../../../store/useStore';
import { useSelector } from '../../../store/useSelector';
import {
  UseChartVisibilityManagerSignature,
  type VisibilityItemIdentifier,
} from './useChartVisibilityManager.types';
import {
  selectorHiddenIdentifiers,
  selectorIsIdentifierHidden,
} from './useChartVisibilityManager.selectors';
import { isSameIdentifier } from './isSameIdentifier';

/**
 * Hook to check if an item is visible based on the visibility manager state.
 * @param {VisibilityItemIdentifier} identifier The identifier of the item to check.
 * @returns {boolean} Whether the item is visible.
 */
export function useIsItemVisible(identifier: VisibilityItemIdentifier): boolean {
  const store = useStore<[UseChartVisibilityManagerSignature]>();

  return useSelector(store, selectorIsIdentifierHidden, identifier);
}

/**
 * Hook to get a function that checks if an item is visible.
 * @returns {(identifier: VisibilityItemIdentifier) => boolean} Function to check item visibility.
 */
export function useGetIsItemVisible(): (identifier: VisibilityItemIdentifier) => boolean {
  const store = useStore<[UseChartVisibilityManagerSignature]>();

  const hiddenIdentifiers = useSelector(store, selectorHiddenIdentifiers);

  return (identifier: VisibilityItemIdentifier) =>
    !hiddenIdentifiers?.some((id2) => isSameIdentifier(identifier, id2));
}
