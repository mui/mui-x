import { TreeViewItemId } from '../../../models';
import { TreeViewItemMeta } from '../../models';
import type { SimpleTreeViewStore } from '../../SimpleTreeViewStore';
import { buildSiblingIndexes, TREE_VIEW_ROOT_PARENT_ID } from '../items';
import { jsxItemsitemWrapper, useJSXItemsItemPlugin } from './itemPlugin';

export class TreeViewJSXItemsPlugin {
  private store: SimpleTreeViewStore<any>;

  public constructor(store: SimpleTreeViewStore<any>) {
    this.store = store;
    store.itemPluginManager.register(useJSXItemsItemPlugin, jsxItemsitemWrapper);
  }

  /**
   * Insert a new item in the state from a Tree Item component.
   * @param {TreeViewItemMeta} item The meta-information of the item to insert.
   * @returns {() => void} A function to remove the item from the state.
   */
  public insertJSXItem = (item: TreeViewItemMeta) => {
    if (this.store.state.itemMetaLookup[item.id] != null) {
      throw new Error(
        [
          'MUI X: The Tree View component requires all items to have a unique `id` property.',
          'Alternatively, you can use the `getItemId` prop to specify a custom id for each item.',
          `Two items were provided with the same id in the \`items\` prop: "${item.id}"`,
        ].join('\n'),
      );
    }

    this.store.update({
      itemMetaLookup: { ...this.store.state.itemMetaLookup, [item.id]: item },
      // For Simple Tree View, we don't have a proper `item` object, so we create a very basic one.
      itemModelLookup: {
        ...this.store.state.itemModelLookup,
        [item.id]: { id: item.id, label: item.label ?? '' },
      },
    });

    return () => {
      const newItemMetaLookup = { ...this.store.state.itemMetaLookup };
      const newItemModelLookup = { ...this.store.state.itemModelLookup };
      delete newItemMetaLookup[item.id];
      delete newItemModelLookup[item.id];

      this.store.update({
        itemMetaLookup: newItemMetaLookup,
        itemModelLookup: newItemModelLookup,
      });
    };
  };

  /**
   * Updates the `labelMap` to register the first character of the given item's label.
   * This map is used to navigate the tree using type-ahead search.
   * @param {TreeViewItemId} itemId The id of the item to map the label of.
   * @param {string} label The item's label.
   * @returns {() => void} A function to remove the item from the `labelMap`.
   */
  public mapLabelFromJSX = (itemId: TreeViewItemId, label: string) => {
    this.store.keyboardNavigation.updateLabelMap((labelMap) => {
      labelMap[itemId] = label;
      return labelMap;
    });

    return () => {
      this.store.keyboardNavigation.updateLabelMap((labelMap) => {
        const newMap = { ...labelMap };
        delete newMap[itemId];
        return newMap;
      });
    };
  };

  /**
   * Store the ids of a given item's children in the state.
   * Those ids must be passed in the order they should be rendered.
   * @param {TreeViewItemId | null} parentId The id of the item to store the children of.
   * @param {TreeViewItemId[]} orderedChildrenIds The ids of the item's children.
   */
  public setJSXItemsOrderedChildrenIds = (
    parentId: TreeViewItemId | null,
    orderedChildrenIds: TreeViewItemId[],
  ) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;

    this.store.update({
      itemOrderedChildrenIdsLookup: {
        ...this.store.state.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...this.store.state.itemChildrenIndexesLookup,
        [parentIdWithDefault]: buildSiblingIndexes(orderedChildrenIds),
      },
    });
  };
}
