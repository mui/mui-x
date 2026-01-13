import { TreeViewCancellableEvent, TreeViewItemId } from '../../../models';
import { TreeViewAnyStore, TreeViewItemMeta } from '../../models';
import { expansionSelectors } from '../expansion';
import { itemsSelectors } from '../items';
import { labelSelectors, TreeViewLabelEditingPlugin } from '../labelEditing';
import { selectionSelectors } from '../selection/selectors';
import {
  getFirstNavigableItem,
  getLastNavigableItem,
  getNextNavigableItem,
  getPreviousNavigableItem,
  isTargetInDescendants,
} from '../../utils/tree';

const TYPEAHEAD_TIMEOUT = 500;

type TreeViewStoreWithLabelEditing = TreeViewAnyStore & {
  labelEditing?: TreeViewLabelEditingPlugin;
};

type TreeViewLabelMap = { [itemId: string]: string };

export class TreeViewKeyboardNavigationPlugin {
  private store: TreeViewStoreWithLabelEditing;

  private labelMap: TreeViewLabelMap;

  private typeaheadQuery = '';

  // We can't type `store`, otherwise we get the following TS error:
  // 'keyboardNavigation' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer.
  constructor(store: any) {
    this.store = store;

    this.labelMap = createLabelMapFromItemMetaLookup(
      itemsSelectors.itemMetaLookup(this.store.state),
    );

    // Whenever the itemMetaLookup changes, we need to regen the label map.
    this.store.registerStoreEffect(itemsSelectors.itemMetaLookup, (_, itemMetaLookup) => {
      if (this.store.shouldIgnoreItemsStateUpdate()) {
        return;
      }

      this.labelMap = createLabelMapFromItemMetaLookup(itemMetaLookup);
    });
  }

  private canToggleItemSelection = (itemId: TreeViewItemId) =>
    selectionSelectors.canItemBeSelected(this.store.state, itemId);

  private canToggleItemExpansion = (itemId: TreeViewItemId) => {
    return (
      !itemsSelectors.isItemDisabled(this.store.state, itemId) &&
      expansionSelectors.isItemExpandable(this.store.state, itemId)
    );
  };

  private getFirstItemMatchingTypeaheadQuery = (
    itemId: TreeViewItemId,
    newKey: string,
  ): TreeViewItemId | null => {
    const getNextItem = (itemIdToCheck: TreeViewItemId) => {
      const nextItemId = getNextNavigableItem(this.store.state, itemIdToCheck);
      // We reached the end of the tree, check from the beginning
      if (nextItemId === null) {
        return getFirstNavigableItem(this.store.state);
      }

      return nextItemId;
    };

    const getNextMatchingItemId = (query: string): TreeViewItemId | null => {
      let matchingItemId: TreeViewItemId | null = null;
      const checkedItems: Record<TreeViewItemId, true> = {};
      // If query length > 1, first check if current item matches
      let currentItemId: TreeViewItemId = query.length > 1 ? itemId : getNextItem(itemId);
      // The "!checkedItems[currentItemId]" condition avoids an infinite loop when there is no matching item.
      while (matchingItemId == null && !checkedItems[currentItemId]) {
        const itemLabel = this.labelMap[currentItemId];

        if (itemLabel?.startsWith(query)) {
          matchingItemId = currentItemId;
        } else {
          checkedItems[currentItemId] = true;
          currentItemId = getNextItem(currentItemId);
        }
      }
      return matchingItemId;
    };

    const cleanNewKey = newKey.toLowerCase();

    // Try matching with accumulated query + new key
    const concatenatedQuery = `${this.typeaheadQuery}${cleanNewKey}`;

    // check if the entire typed query matches an item
    const concatenatedQueryMatchingItemId = getNextMatchingItemId(concatenatedQuery);
    if (concatenatedQueryMatchingItemId != null) {
      this.typeaheadQuery = concatenatedQuery;
      return concatenatedQueryMatchingItemId;
    }

    const newKeyMatchingItemId = getNextMatchingItemId(cleanNewKey);
    if (newKeyMatchingItemId != null) {
      this.typeaheadQuery = cleanNewKey;
      return newKeyMatchingItemId;
    }

    this.typeaheadQuery = '';
    return null;
  };

  /**
   * Updates the `labelMap` to add/remove the first character of some item's labels.
   * This map is used to navigate the tree using type-ahead search.
   * This method is only used by the `useTreeViewJSXItems` plugin, otherwise the updates are handled internally.
   * @param {(map: TreeViewLabelMap) => TreeViewLabelMap} updater The function to update the map.
   */
  public updateLabelMap = (callback: (labelMap: TreeViewLabelMap) => TreeViewLabelMap) => {
    this.labelMap = callback(this.labelMap);
  };

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  /**
   * Callback fired when a key is pressed on an item.
   * Handles all the keyboard navigation logic.
   * @param {React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent} event The keyboard event that triggered the callback.
   * @param {TreeViewItemId} itemId The id of the item that the event was triggered on.
   */
  public handleItemKeyDown = async (
    event: React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent,
    itemId: TreeViewItemId,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    if (
      event.altKey ||
      isTargetInDescendants(event.target as HTMLElement, event.currentTarget as HTMLElement)
    ) {
      return;
    }

    const ctrlPressed = event.ctrlKey || event.metaKey;
    const key = event.key;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(this.store.state);

    // eslint-disable-next-line default-case
    switch (true) {
      // Select the item when pressing "Space"
      case key === ' ' && this.canToggleItemSelection(itemId): {
        event.preventDefault();
        if (isMultiSelectEnabled && event.shiftKey) {
          this.store.selection.expandSelectionRange(event, itemId);
        } else {
          this.store.selection.setItemSelection({
            event,
            itemId,
            keepExistingSelection: isMultiSelectEnabled,
            shouldBeSelected: undefined,
          });
        }
        break;
      }

      // If the focused item has children, we expand it.
      // If the focused item has no children, we select it.
      case key === 'Enter': {
        if (
          this.store.labelEditing?.setEditedItem &&
          labelSelectors.isItemEditable(this.store.state, itemId) &&
          !labelSelectors.isItemBeingEdited(this.store.state, itemId)
        ) {
          this.store.labelEditing.setEditedItem(itemId);
        } else if (this.canToggleItemExpansion(itemId)) {
          this.store.expansion.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else if (this.canToggleItemSelection(itemId)) {
          if (isMultiSelectEnabled) {
            event.preventDefault();
            this.store.selection.setItemSelection({ event, itemId, keepExistingSelection: true });
          } else if (!selectionSelectors.isItemSelected(this.store.state, itemId)) {
            this.store.selection.setItemSelection({ event, itemId });
            event.preventDefault();
          }
        }

        break;
      }

      // Focus the next focusable item
      case key === 'ArrowDown': {
        const nextItem = getNextNavigableItem(this.store.state, itemId);
        if (nextItem) {
          event.preventDefault();
          this.store.focus.focusItem(event, nextItem);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next item
          if (isMultiSelectEnabled && event.shiftKey && this.canToggleItemSelection(nextItem)) {
            this.store.selection.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }

        break;
      }

      // Focuses the previous focusable item
      case key === 'ArrowUp': {
        const previousItem = getPreviousNavigableItem(this.store.state, itemId);
        if (previousItem) {
          event.preventDefault();
          this.store.focus.focusItem(event, previousItem);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous item
          if (isMultiSelectEnabled && event.shiftKey && this.canToggleItemSelection(previousItem)) {
            this.store.selection.selectItemFromArrowNavigation(event, itemId, previousItem);
          }
        }

        break;
      }

      // If the focused item is expanded, we move the focus to its first child
      // If the focused item is collapsed and has children, we expand it
      case (key === 'ArrowRight' && !this.store.parameters.isRtl) ||
        (key === 'ArrowLeft' && this.store.parameters.isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (expansionSelectors.isItemExpanded(this.store.state, itemId)) {
          const nextItemId = getNextNavigableItem(this.store.state, itemId);
          if (nextItemId) {
            this.store.focus.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (this.canToggleItemExpansion(itemId)) {
          this.store.expansion.setItemExpansion({ event, itemId });
          event.preventDefault();
        }

        break;
      }

      // If the focused item is expanded, we collapse it
      // If the focused item is collapsed and has a parent, we move the focus to this parent
      case (key === 'ArrowLeft' && !this.store.parameters.isRtl) ||
        (key === 'ArrowRight' && this.store.parameters.isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (
          this.canToggleItemExpansion(itemId) &&
          expansionSelectors.isItemExpanded(this.store.state, itemId)
        ) {
          this.store.expansion.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else {
          const parent = itemsSelectors.itemParentId(this.store.state, itemId);
          if (parent) {
            this.store.focus.focusItem(event, parent);
            event.preventDefault();
          }
        }

        break;
      }

      // Focuses the first item in the tree
      case key === 'Home': {
        // Multi select behavior when pressing Ctrl + Shift + Home
        // Selects the focused item and all items up to the first item.
        if (
          this.canToggleItemSelection(itemId) &&
          isMultiSelectEnabled &&
          ctrlPressed &&
          event.shiftKey
        ) {
          this.store.selection.selectRangeFromStartToItem(event, itemId);
        } else {
          this.store.focus.focusItem(event, getFirstNavigableItem(this.store.state));
        }

        event.preventDefault();
        break;
      }

      // Focuses the last item in the tree
      case key === 'End': {
        // Multi select behavior when pressing Ctrl + Shirt + End
        // Selects the focused item and all the items down to the last item.
        if (
          this.canToggleItemSelection(itemId) &&
          isMultiSelectEnabled &&
          ctrlPressed &&
          event.shiftKey
        ) {
          this.store.selection.selectRangeFromItemToEnd(event, itemId);
        } else {
          this.store.focus.focusItem(event, getLastNavigableItem(this.store.state));
        }

        event.preventDefault();
        break;
      }

      // Expand all siblings that are at the same level as the focused item
      case key === '*': {
        this.store.expansion.expandAllSiblings(event, itemId);
        event.preventDefault();
        break;
      }

      // Multi select behavior when pressing Ctrl + a
      // Selects all the items
      case String.fromCharCode(event.keyCode) === 'A' &&
        ctrlPressed &&
        isMultiSelectEnabled &&
        selectionSelectors.enabled(this.store.state): {
        this.store.selection.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }

      // Type-ahead
      case !ctrlPressed && !event.shiftKey && isPrintableKey(key): {
        this.store.timeoutManager.clearTimeout('typeahead');

        const matchingItem = this.getFirstItemMatchingTypeaheadQuery(itemId, key);
        if (matchingItem != null) {
          this.store.focus.focusItem(event, matchingItem);
          event.preventDefault();
        } else {
          this.typeaheadQuery = '';
        }

        this.store.timeoutManager.startTimeout('typeahead', TYPEAHEAD_TIMEOUT, () => {
          this.typeaheadQuery = '';
        });
        break;
      }
    }
  };
}

function isPrintableKey(string: string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}

function createLabelMapFromItemMetaLookup(itemMetaLookup: {
  [itemId: string]: TreeViewItemMeta;
}): TreeViewLabelMap {
  const labelMap: { [itemId: string]: string } = {};

  const processItem = (item: TreeViewItemMeta) => {
    labelMap[item.id] = item.label!.toLowerCase();
  };

  Object.values(itemMetaLookup).forEach(processItem);

  return labelMap;
}
