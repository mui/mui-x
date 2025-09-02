import useLazyRef from '@mui/utils/useLazyRef';
import { TreeViewItemId, TreeViewSelectionPropagation } from '../models';
import { getLookupFromArray } from '../internals/plugins/useTreeViewSelection/useTreeViewSelection.utils';

const defaultGetItemId = (item: any) => item.id;

const defaultGetItemChildren = (item: any) => item.children;

/**
 * Applies the selection propagation rules to the default selected items.
 *
 * Example:
 * ```tsx
 * const defaultSelectedItems = useApplyPropagationToDefaultSelectedItems({
 *   items,
 *   selectionPropagation,
 *   defaultSelectedItems: ['10', '11', '13', '14'],
 * });
 *
 * return <RichTreeView items={items} selectionPropagation={selectionPropagation} defaultSelectedItems={defaultSelectedItems} />
 * ```
 */
export function useApplyPropagationToDefaultSelectedItems(
  parameters: UseApplyPropagationToDefaultSelectedItemsParameters<any>,
) {
  const {
    items: itemsParam,
    getItemId = defaultGetItemId,
    getItemChildren = defaultGetItemChildren,
    defaultSelectedItems,
    selectionPropagation,
  } = parameters;

  return useLazyRef(() => {
    const lookup = getLookupFromArray(defaultSelectedItems);

    function walk(items: any[], isParentSelected: boolean) {
      for (const item of items) {
        const itemId = getItemId(item);
        let isSelected = lookup[itemId];

        if (!isSelected && selectionPropagation.descendants && isParentSelected) {
          lookup[itemId] = true;
          isSelected = true;
        }

        const children = getItemChildren(item) ?? [];
        if (children.length > 0) {
          walk(children, isSelected);

          if (!isSelected && selectionPropagation.parents) {
            const areAllChildrenSelected = children.every(
              (childId: any) => lookup[getItemId(childId)],
            );
            if (areAllChildrenSelected) {
              lookup[itemId] = true;
            }
          }
        }
      }
    }

    walk(itemsParam, false);

    return Object.keys(lookup);
  }).current;
}

interface UseApplyPropagationToDefaultSelectedItemsParameters<R extends { children?: R[] }> {
  items: R[];
  getItemId?: (item: R) => TreeViewItemId;
  getItemChildren?: (item: R) => R[] | undefined;
  defaultSelectedItems: string[];
  selectionPropagation: TreeViewSelectionPropagation;
}
