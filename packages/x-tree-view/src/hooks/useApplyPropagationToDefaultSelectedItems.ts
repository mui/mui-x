import * as React from 'react';
import { TreeViewItemId, TreeViewSelectionPropagation } from '../models';

const defaultGetItemId = (item: any) => item.id;

const defaultGetItemChildren = (item: any) => item.children;

export function useApplyPropagationToDefaultSelectedItems<R extends { children?: R[] }>(
  parameters: UseApplyPropagationToDefaultSelectedItemsParameters<R>,
) {
  const {
    items: itemsParam,
    getItemId = defaultGetItemId,
    getItemChildren = defaultGetItemChildren,
    defaultSelectedItems,
    selectionPropagation,
  } = parameters;

  return React.useMemo(() => {
    const selectedItemsMap = new Map<string, true>();
    for (const id of defaultSelectedItems) {
      selectedItemsMap.set(id, true);
    }
    const temp = [...defaultSelectedItems];

    function walk(items: R[], isParentSelected: boolean) {
      for (const item of items) {
        const itemId = getItemId(item);
        if (selectionPropagation.descendants && isParentSelected) {
          temp.push(itemId);
          selectedItemsMap.set(itemId, true);
        }

        const isSelected = selectedItemsMap.has(itemId);
        const children = getItemChildren(item) ?? [];

        if (children.length > 0) {
          walk(children, isSelected);
        }

        if (!isSelected && selectionPropagation.parents && children.length > 0) {
          const areAllChildrenSelected = children.every((childId: R) =>
            selectedItemsMap.has(getItemId(childId)),
          );
          if (areAllChildrenSelected) {
            temp.push(itemId);
            selectedItemsMap.set(itemId, true);
          }
        }
      }
    }

    walk(itemsParam, false);

    return temp;
  }, [
    itemsParam,
    getItemId,
    getItemChildren,
    selectionPropagation.descendants,
    selectionPropagation.parents,
    defaultSelectedItems,
  ]);
}

interface UseApplyPropagationToDefaultSelectedItemsParameters<R extends { children?: R[] }> {
  items: R[];
  getItemId?: (item: R) => TreeViewItemId;
  getItemChildren?: (item: R) => R[] | undefined;
  defaultSelectedItems: string[];
  selectionPropagation: TreeViewSelectionPropagation;
}
