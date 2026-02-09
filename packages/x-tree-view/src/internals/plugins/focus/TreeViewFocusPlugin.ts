import { createSelectorMemoized } from '@mui/x-internals/store';
import { TreeViewCancellableEvent, TreeViewItemId } from '../../../models';
import { expansionSelectors } from '../expansion';
import { focusSelectors } from './selectors';
import { itemsSelectors, TREE_VIEW_ROOT_PARENT_ID } from '../items';
import { TreeViewItemMeta } from '../../models';
import { MinimalTreeViewStore } from '../../MinimalTreeViewStore';

const itemStructureSelector = createSelectorMemoized(
  itemsSelectors.itemMetaLookup,
  itemsSelectors.itemOrderedChildrenIdsLookup,
  (metaLookup, childrenIdsLookup) => ({ metaLookup, childrenIdsLookup }),
);

export class TreeViewFocusPlugin {
  private store: MinimalTreeViewStore<any, any>;

  // We can't type `store`, otherwise we get the following TS error:
  // 'focus' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
  constructor(store: any) {
    this.store = store;

    // Whenever the items change, we need to ensure the focused item is still present.
    // If the focused item was removed, focus the closest neighbor instead of the first item.
    this.store.registerStoreEffect(itemStructureSelector, (previous: ReturnType<typeof itemStructureSelector>) => {
      const focusedItemId = focusSelectors.focusedItemId(store.state);
      if (focusedItemId == null) {
        return;
      }

      const hasItemBeenRemoved = !itemsSelectors.itemMeta(store.state, focusedItemId);
      if (!hasItemBeenRemoved) {
        return;
      }

      const closestItemId = this.getClosestFocusableItem(
        focusedItemId,
        previous.metaLookup,
        previous.childrenIdsLookup,
      );

      if (closestItemId == null) {
        this.setFocusedItemId(null);
        return;
      }

      this.applyItemFocus(null, closestItemId);
    });
  }

  /**
   * Find the closest focusable item to the removed item.
   * Priority: next sibling > previous sibling > parent > default focusable item.
   */
  private getClosestFocusableItem = (
    removedItemId: TreeViewItemId,
    previousMetaLookup: Record<string, TreeViewItemMeta>,
    previousChildrenIdsLookup: Record<string, TreeViewItemId[]>,
  ): TreeViewItemId | null => {
    const removedMeta = previousMetaLookup[removedItemId];
    if (!removedMeta) {
      return focusSelectors.defaultFocusableItemId(this.store.state);
    }

    const parentKey = removedMeta.parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const siblingIds = previousChildrenIdsLookup[parentKey] ?? [];
    const removedIndex = siblingIds.indexOf(removedItemId);

    if (removedIndex === -1) {
      return focusSelectors.defaultFocusableItemId(this.store.state);
    }

    // Scan forward first (next siblings), then backward (previous siblings).
    for (let i = removedIndex + 1; i < siblingIds.length; i += 1) {
      if (itemsSelectors.canItemBeFocused(this.store.state, siblingIds[i])) {
        return siblingIds[i];
      }
    }

    for (let i = removedIndex - 1; i >= 0; i -= 1) {
      if (itemsSelectors.canItemBeFocused(this.store.state, siblingIds[i])) {
        return siblingIds[i];
      }
    }

    // No focusable siblings left — try the parent
    if (
      removedMeta.parentId != null &&
      itemsSelectors.canItemBeFocused(this.store.state, removedMeta.parentId)
    ) {
      return removedMeta.parentId;
    }

    return focusSelectors.defaultFocusableItemId(this.store.state);
  };

  private setFocusedItemId = (itemId: TreeViewItemId | null) => {
    const focusedItemId = focusSelectors.focusedItemId(this.store.state);
    if (focusedItemId === itemId) {
      return;
    }

    this.store.set('focusedItemId', itemId);
  };

  private applyItemFocus = (event: React.SyntheticEvent | null, itemId: TreeViewItemId) => {
    this.store.items.getItemDOMElement(itemId)?.focus();
    this.setFocusedItemId(itemId);
    this.store.parameters.onItemFocus?.(event, itemId);
  };

  public buildPublicAPI = () => {
    return {
      focusItem: this.focusItem,
    };
  };

  /**
   * Focus the item with the given id.
   *
   * If the item is the child of a collapsed item, then this method will do nothing.
   * Make sure to expand the ancestors of the item before calling this method if needed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to focus.
   */
  public focusItem = (event: React.SyntheticEvent | null, itemId: TreeViewItemId) => {
    // If we receive an itemId, and it is visible, the focus will be set to it
    const itemMeta = itemsSelectors.itemMeta(this.store.state, itemId);
    const isItemVisible =
      itemMeta &&
      (itemMeta.parentId == null ||
        expansionSelectors.isItemExpanded(this.store.state, itemMeta.parentId));

    if (isItemVisible) {
      this.applyItemFocus(event, itemId);
    }
  };

  /**
   * Remove the focus from the currently focused item (both from the internal state and the DOM).
   */
  public removeFocusedItem = () => {
    const focusedItemId = focusSelectors.focusedItemId(this.store.state);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = itemsSelectors.itemMeta(this.store.state, focusedItemId);
    if (itemMeta) {
      const itemElement = this.store.items.getItemDOMElement(focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }

    this.setFocusedItemId(null);
  };

  /**
   * Event handler to fire when the `root` slot of the Tree View is focused.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   */
  public handleRootFocus = (
    event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    // if the event bubbled (which is React specific) we don't want to steal focus
    const defaultFocusableItemId = focusSelectors.defaultFocusableItemId(this.store.state);
    if (event.target === event.currentTarget && defaultFocusableItemId != null) {
      this.applyItemFocus(event, defaultFocusableItemId);
    }
  };

  /**
   * Event handler to fire when the `root` slot of the Tree View is blurred.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   */
  public handleRootBlur = (
    event: React.FocusEvent<HTMLUListElement> & TreeViewCancellableEvent,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    this.setFocusedItemId(null);
  };
}
