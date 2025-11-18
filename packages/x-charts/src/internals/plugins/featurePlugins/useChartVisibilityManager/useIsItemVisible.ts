import { useStore } from '../../../store/useStore';
import { useSelector } from '../../../store/useSelector';
import { UseChartVisibilityManagerSignature } from './useChartVisibilityManager.types';
import { SeriesItemIdentifier } from '../../../../models/seriesType';
import { selectorIsIdentifierHidden } from './useChartVisibilityManager.selectors';

/**
 * Hook to check if an item is visible based on the visibility manager state.
 * @param {SeriesItemIdentifier} identifier The identifier of the item to check.
 * @returns {boolean} Whether the item is visible.
 */
export function useIsItemVisible(identifier: SeriesItemIdentifier): boolean {
  const store = useStore<[UseChartVisibilityManagerSignature]>();

  return useSelector(store, selectorIsIdentifierHidden, identifier);
}
