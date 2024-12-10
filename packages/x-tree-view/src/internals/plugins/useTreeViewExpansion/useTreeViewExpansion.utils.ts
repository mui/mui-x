import { TreeViewItemId } from '../../../models';
import { TreeViewUsedDefaultizedParams } from '../../models';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const createExpandedItemsMap = (expandedItems: string[]) => {
  const expandedItemsMap = new Map<TreeViewItemId, true>();
  expandedItems.forEach((id) => {
    expandedItemsMap.set(id, true);
  });

  return expandedItemsMap;
};

export const getExpansionTrigger = ({
  isItemEditable,
  expansionTrigger,
}: Pick<
  TreeViewUsedDefaultizedParams<UseTreeViewExpansionSignature>,
  'isItemEditable' | 'expansionTrigger'
>) => {
  if (expansionTrigger) {
    return expansionTrigger;
  }

  if (isItemEditable) {
    return 'iconContainer';
  }

  return 'content';
};
