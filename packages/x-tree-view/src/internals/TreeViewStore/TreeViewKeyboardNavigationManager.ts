import { TreeViewCancellableEvent } from '../../models';
import { expansionSelectors } from '../plugins/useTreeViewExpansion';
import { itemsSelectors } from '../plugins/useTreeViewItems';
import { TreeViewLabelMap } from '../plugins/useTreeViewKeyboardNavigation/useTreeViewKeyboardNavigation.types';
import { selectionSelectors } from '../plugins/useTreeViewSelection/useTreeViewSelection.selectors';
import {
  getFirstNavigableItem,
  getLastNavigableItem,
  getNextNavigableItem,
  getPreviousNavigableItem,
  isTargetInDescendants,
} from '../utils/tree';
import type { TreeViewStore } from './TreeViewStore';

const TYPEAHEAD_TIMEOUT = 500;

export class TreeViewKeyboardNavigationManager<Store extends TreeViewStore<any, any, any, any>> {
  private store: Store;

  private labelMap: TreeViewLabelMap = {};

  private typeaheadQuery = '';

  constructor(store: Store) {
    this.store = store;
  }

  private canToggleItemSelection = (itemId: string) =>
    selectionSelectors.enabled(this.store.state) &&
    !itemsSelectors.isItemDisabled(this.store.state, itemId);

  private canToggleItemExpansion = (itemId: string) => {
    return (
      !itemsSelectors.isItemDisabled(this.store.state, itemId) &&
      expansionSelectors.isItemExpandable(this.store.state, itemId)
    );
  };

  private getFirstItemMatchingTypeaheadQuery = (itemId: string, newKey: string): string | null => {
    const getNextItem = (itemIdToCheck: string) => {
      const nextItemId = getNextNavigableItem(this.store.state, itemIdToCheck);
      // We reached the end of the tree, check from the beginning
      if (nextItemId === null) {
        return getFirstNavigableItem(this.store.state);
      }

      return nextItemId;
    };

    const getNextMatchingItemId = (query: string): string | null => {
      let matchingItemId: string | null = null;
      const checkedItems: Record<string, true> = {};
      // If query length > 1, first check if current item matches
      let currentItemId: string = query.length > 1 ? itemId : getNextItem(itemId);
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

  public updateLabelMap = (callback: (labelMap: TreeViewLabelMap) => TreeViewLabelMap) => {
    this.labelMap = callback(this.labelMap);
  };

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  public handleItemKeyDown = async (
    event: React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent,
    itemId: string,
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
          this.store.expandSelectionRange(event, itemId);
        } else {
          this.store.setItemSelection({
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
          hasPlugin(instance, useTreeViewLabel) &&
          labelSelectors.isItemEditable(this.store.state, itemId) &&
          !labelSelectors.isItemBeingEdited(this.store.state, itemId)
        ) {
          instance.setEditedItem(itemId);
        } else if (this.canToggleItemExpansion(itemId)) {
          this.store.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else if (this.canToggleItemSelection(itemId)) {
          if (isMultiSelectEnabled) {
            event.preventDefault();
            this.store.setItemSelection({ event, itemId, keepExistingSelection: true });
          } else if (!selectionSelectors.isItemSelected(this.store.state, itemId)) {
            this.store.setItemSelection({ event, itemId });
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
          this.store.focusItem(event, nextItem);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next item
          if (isMultiSelectEnabled && event.shiftKey && this.canToggleItemSelection(nextItem)) {
            this.store.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }

        break;
      }

      // Focuses the previous focusable item
      case key === 'ArrowUp': {
        const previousItem = getPreviousNavigableItem(this.store.state, itemId);
        if (previousItem) {
          event.preventDefault();
          this.store.focusItem(event, previousItem);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous item
          if (isMultiSelectEnabled && event.shiftKey && this.canToggleItemSelection(previousItem)) {
            this.store.selectItemFromArrowNavigation(event, itemId, previousItem);
          }
        }

        break;
      }

      // If the focused item is expanded, we move the focus to its first child
      // If the focused item is collapsed and has children, we expand it
      case (key === 'ArrowRight' && !this.store.isRtl) ||
        (key === 'ArrowLeft' && this.store.isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (expansionSelectors.isItemExpanded(this.store.state, itemId)) {
          const nextItemId = getNextNavigableItem(this.store.state, itemId);
          if (nextItemId) {
            this.store.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (this.canToggleItemExpansion(itemId)) {
          this.store.setItemExpansion({ event, itemId });
          event.preventDefault();
        }

        break;
      }

      // If the focused item is expanded, we collapse it
      // If the focused item is collapsed and has a parent, we move the focus to this parent
      case (key === 'ArrowLeft' && !this.store.isRtl) ||
        (key === 'ArrowRight' && this.store.isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (
          this.canToggleItemExpansion(itemId) &&
          expansionSelectors.isItemExpanded(this.store.state, itemId)
        ) {
          this.store.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else {
          const parent = itemsSelectors.itemParentId(this.store.state, itemId);
          if (parent) {
            this.store.focusItem(event, parent);
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
          this.store.selectRangeFromStartToItem(event, itemId);
        } else {
          this.store.focusItem(event, getFirstNavigableItem(this.store.state));
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
          this.store.selectRangeFromItemToEnd(event, itemId);
        } else {
          this.store.focusItem(event, getLastNavigableItem(this.store.state));
        }

        event.preventDefault();
        break;
      }

      // Expand all siblings that are at the same level as the focused item
      case key === '*': {
        this.store.expandAllSiblings(event, itemId);
        event.preventDefault();
        break;
      }

      // Multi select behavior when pressing Ctrl + a
      // Selects all the items
      case String.fromCharCode(event.keyCode) === 'A' &&
        ctrlPressed &&
        isMultiSelectEnabled &&
        selectionSelectors.enabled(this.store.state): {
        this.store.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }

      // Type-ahead
      case !ctrlPressed && !event.shiftKey && isPrintableKey(key): {
        this.store.timeoutManager.clearTimeout('typeahead');

        const matchingItem = this.getFirstItemMatchingTypeaheadQuery(itemId, key);
        if (matchingItem != null) {
          this.store.focusItem(event, matchingItem);
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
