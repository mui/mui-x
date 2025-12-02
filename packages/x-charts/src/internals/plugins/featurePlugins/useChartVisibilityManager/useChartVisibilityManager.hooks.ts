import { useStore } from '../../../store/useStore';
import { useSelector } from '../../../store/useSelector';
import {
  UseChartVisibilityManagerSignature,
  type IsIdentifierVisibleFunction,
} from './useChartVisibilityManager.types';
import {
  selectorIsIdentifierHidden,
  selectorIsIdentifierHiddenGetter,
} from './useChartVisibilityManager.selectors';

export const useIsIdentifierVisible: IsIdentifierVisibleFunction = (identifier) => {
  const store = useStore<[UseChartVisibilityManagerSignature]>();
  return useSelector(store, selectorIsIdentifierHidden, identifier);
};

/**
 * Hook to get a function that checks if an item is visible.
 * @returns {(identifier: string | (string | number)[]) => boolean} Function to check item visibility.
 */
export function useGetIsIdentifierVisible(): IsIdentifierVisibleFunction {
  const store = useStore<[UseChartVisibilityManagerSignature]>();
  return useSelector(store, selectorIsIdentifierHiddenGetter);
}
