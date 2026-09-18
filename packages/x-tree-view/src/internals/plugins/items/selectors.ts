import type { TreeViewItemId } from '../../../models';
import type { TreeViewItemMeta } from '../../models';
import { isItemDisabled, TREE_VIEW_ROOT_PARENT_ID } from './utils';
import type { MinimalTreeViewState } from '../../MinimalTreeViewStore';
import type { RichTreeViewState } from '../../RichTreeViewStore';

const EMPTY_CHILDREN: TreeViewItemId[] = [];

export const itemsSelectors = {
  /**
   * Gets the DOM structure of the Tree View.
   */
  domStructure: (state: RichTreeViewState<any, any>) => state.domStructure,
  /**
   * Checks whether the disabled items are focusable.
   */
  disabledItemFocusable: (state: MinimalTreeViewState<any, any>) => state.disabledItemsFocusable,
  /**
   * Gets the meta-information of all items.
   */
  itemMetaLookup: (state: MinimalTreeViewState<any, any>) => state.itemMetaLookup,
  /**
   * Gets the ordered children ids of all items.
   */
  itemOrderedChildrenIdsLookup: (state: MinimalTreeViewState<any, any>) =>
    state.itemOrderedChildrenIdsLookup,
  /**
   * Gets the meta-information of an item.
   */
  itemMeta: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    (state.itemMetaLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? null) as TreeViewItemMeta | null,
  /**
   * Gets the ordered children ids of an item.
   */
  itemOrderedChildrenIds: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId | null) =>
    state.itemOrderedChildrenIdsLookup[itemId ?? TREE_VIEW_ROOT_PARENT_ID] ?? EMPTY_CHILDREN,
  /**
   * Gets the model of an item.
   */
  itemModel: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    state.itemModelLookup[itemId],
  /**
   * Checks whether an item is disabled.
   */
  isItemDisabled: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    isItemDisabled(state.itemMetaLookup, itemId),
  /**
   * Gets the index of an item in its parent's children.
   */
  itemIndex: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) => {
    const itemMeta = state.itemMetaLookup[itemId];
    if (itemMeta == null) {
      return -1;
    }

    const parentIndexes =
      state.itemChildrenIndexesLookup[itemMeta.parentId ?? TREE_VIEW_ROOT_PARENT_ID];
    return parentIndexes[itemMeta.id];
  },
  /**
   * Gets the id of an item's parent.
   */
  itemParentId: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    state.itemMetaLookup[itemId]?.parentId ?? null,
  /**
   * Gets the depth of an item (items at the root level have a depth of 0).
   */
  itemDepth: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    state.itemMetaLookup[itemId]?.depth ?? 0,
  /**
   * Checks whether an item can be focused.
   */
  canItemBeFocused: (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) =>
    state.disabledItemsFocusable ||
    (state.itemModelLookup[itemId] != null && !isItemDisabled(state.itemMetaLookup, itemId)),
  /**
   * Gets the identation between an item and its children.
   */
  itemChildrenIndentation: (state: MinimalTreeViewState<any, any>) => state.itemChildrenIndentation,
  /**
   * Gets the height of an individual item.
   */
  itemHeight: (state: MinimalTreeViewState<any, any>) => state.itemHeight,
};
