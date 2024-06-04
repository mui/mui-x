import { HighlightItemData } from './HighlightedContext';
import { useHighlighted } from './useHighlighted';

export type ItemHighlightedState = {
  /**
   * Whether the item is highlighted.
   */
  isHighlighted: boolean;
  /**
   * Whether the item is faded.
   */
  isFaded: boolean;
};

/**
 * A hook to check the highlighted state of the item.
 * This function already calculates that an item is not faded if it is highlighted.
 *
 * If you need fine control over the state, use the `useHighlighted` hook instead.
 *
 * @param {HighlightItemData} item is the item to check
 * @returns {ItemHighlightedState} the state of the item
 */
export function useItemHighlighted(item: HighlightItemData | null): ItemHighlightedState {
  const highlighted = useHighlighted();

  if (!item) {
    return {
      isHighlighted: false,
      isFaded: false,
    };
  }

  const isHighlighted = highlighted.isHighlighted(item);
  const isFaded = !isHighlighted && highlighted.isFaded(item);

  return { isHighlighted, isFaded };
}
