import * as React from 'react';
import { useStore } from '../../../store/useStore';
import { useSelector } from '../../../store/useSelector';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import {
  selectorVisibilityMap,
  selectorIsIdentifierHidden,
} from './useChartVisibilityManager.selectors';

/**
 * Hook to check if an item is visible based on the visibility manager state.
 * @param {string} identifier The identifier of the item to check.
 * @returns {boolean} Whether the item is visible.
 */
export function useIsItemVisible(identifier: string): boolean {
  const store = useStore<[UseChartVisibilityManagerSignature]>();

  return useSelector(store, selectorIsIdentifierHidden, identifier);
}

/**
 * Hook to get a function that checks if an item is visible.
 * @returns {(identifier: string) => boolean} Function to check item visibility.
 */
export function useGetIsItemVisible(): (identifier: string) => boolean {
  const store = useStore<[UseChartVisibilityManagerSignature]>();

  const hiddenIdentifiers = useSelector(store, selectorVisibilityMap);

  const fn = React.useCallback(
    (identifier: string) => hiddenIdentifiers?.[identifier] !== true,
    [hiddenIdentifiers],
  );

  return fn;
}
