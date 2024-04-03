import { TreeViewInstance } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

/**
 * This is used to determine the start and end of a selection range so
 * we can get the items between the two border items.
 *
 * It finds the items' common ancestor using
 * a naive implementation of a lowest common ancestor algorithm
 * (https://en.wikipedia.org/wiki/Lowest_common_ancestor).
 * Then compares the ancestor's 2 children that are ancestors of itemA and ItemB
 * so we can compare their indexes to work out which item comes first in a depth first search.
 * (https://en.wikipedia.org/wiki/Depth-first_search)
 *
 * Another way to put it is which item is shallower in a trémaux tree
 * https://en.wikipedia.org/wiki/Tr%C3%A9maux_tree
 */
export const findOrderInTremauxTree = (
  instance: TreeViewInstance<[UseTreeViewItemsSignature]>,
  itemAId: string,
  itemBId: string,
) => {
  if (itemAId === itemBId) {
    return [itemAId, itemBId];
  }

  const itemA = instance.getItemMeta(itemAId);
  const itemB = instance.getItemMeta(itemBId);

  if (itemA.parentId === itemB.id || itemB.parentId === itemA.id) {
    return itemB.parentId === itemA.id ? [itemA.id, itemB.id] : [itemB.id, itemA.id];
  }

  const aFamily: (string | null)[] = [itemA.id];
  const bFamily: (string | null)[] = [itemB.id];

  let aAncestor = itemA.parentId;
  let bAncestor = itemB.parentId;

  let aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
  let bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;

  let continueA = true;
  let continueB = true;

  while (!bAncestorIsCommon && !aAncestorIsCommon) {
    if (continueA) {
      aFamily.push(aAncestor);
      aAncestorIsCommon = bFamily.indexOf(aAncestor) !== -1;
      continueA = aAncestor !== null;
      if (!aAncestorIsCommon && continueA) {
        aAncestor = instance.getItemMeta(aAncestor!).parentId;
      }
    }

    if (continueB && !aAncestorIsCommon) {
      bFamily.push(bAncestor);
      bAncestorIsCommon = aFamily.indexOf(bAncestor) !== -1;
      continueB = bAncestor !== null;
      if (!bAncestorIsCommon && continueB) {
        bAncestor = instance.getItemMeta(bAncestor!).parentId;
      }
    }
  }

  const commonAncestor = aAncestorIsCommon ? aAncestor : bAncestor;
  const ancestorFamily = instance.getChildrenIds(commonAncestor);

  const aSide = aFamily[aFamily.indexOf(commonAncestor) - 1];
  const bSide = bFamily[bFamily.indexOf(commonAncestor) - 1];

  return ancestorFamily.indexOf(aSide!) < ancestorFamily.indexOf(bSide!)
    ? [itemAId, itemBId]
    : [itemBId, itemAId];
};
