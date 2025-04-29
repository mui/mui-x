import { TreeViewItemMeta, TreeViewPluginSignature } from '../../models';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { UseTreeViewKeyboardNavigationSignature } from '../useTreeViewKeyboardNavigation';
import { TreeViewItemId } from '../../../models';

export interface UseTreeViewItemsInstance {
  /**
   * Insert a new item in the state from a Tree Item component.
   * @param {TreeViewItemMeta} item The meta-information of the item to insert.
   * @returns {() => void} A function to remove the item from the state.
   */
  insertJSXItem: (item: TreeViewItemMeta) => () => void;
  /**
   * Updates the `firstCharMap` to register the first character of the given item's label.
   * This map is used to navigate the tree using type-ahead search.
   * @param {TreeViewItemId} itemId The id of the item to map the first character of.
   * @param {string} firstChar The first character of the item's label.
   * @returns {() => void} A function to remove the item from the `firstCharMap`.
   */
  mapFirstCharFromJSX: (itemId: TreeViewItemId, firstChar: string) => () => void;
  /**
   * Store the ids of a given item's children in the state.
   * Those ids must be passed in the order they should be rendered.
   * @param {TreeViewItemId | null} parentId The id of the item to store the children of.
   * @param {TreeViewItemId[]} orderedChildrenIds The ids of the item's children.
   */
  setJSXItemsOrderedChildrenIds: (
    parentId: TreeViewItemId | null,
    orderedChildrenIds: TreeViewItemId[],
  ) => void;
}

export interface UseTreeViewJSXItemsParameters {}

export interface UseTreeViewItemsDefaultizedParameters {}

export type UseTreeViewJSXItemsSignature = TreeViewPluginSignature<{
  params: UseTreeViewJSXItemsParameters;
  defaultizedParams: UseTreeViewItemsDefaultizedParameters;
  instance: UseTreeViewItemsInstance;
  dependencies: [UseTreeViewItemsSignature, UseTreeViewKeyboardNavigationSignature];
}>;
