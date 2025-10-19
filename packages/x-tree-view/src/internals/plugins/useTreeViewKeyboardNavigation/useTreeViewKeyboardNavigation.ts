'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { useRtl } from '@mui/system/RtlProvider';
import { useTimeout } from '@base-ui-components/utils/useTimeout';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { TreeViewCancellableEvent } from '../../../models';
import { TreeViewItemMeta, TreeViewPlugin } from '../../models';
import {
  getFirstNavigableItem,
  getLastNavigableItem,
  getNextNavigableItem,
  getPreviousNavigableItem,
  isTargetInDescendants,
} from '../../utils/tree';
import {
  TreeViewLabelMap,
  UseTreeViewKeyboardNavigationSignature,
} from './useTreeViewKeyboardNavigation.types';
import { hasPlugin } from '../../utils/plugins';
import { useTreeViewLabel } from '../useTreeViewLabel';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { labelSelectors } from '../useTreeViewLabel/useTreeViewLabel.selectors';
import { selectionSelectors } from '../useTreeViewSelection/useTreeViewSelection.selectors';
import { expansionSelectors } from '../useTreeViewExpansion/useTreeViewExpansion.selectors';

function isPrintableKey(string: string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}

const TYPEAHEAD_TIMEOUT = 500;

export const useTreeViewKeyboardNavigation: TreeViewPlugin<
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, store, params }) => {
  const isRtl = useRtl();
  const labelMap = React.useRef<TreeViewLabelMap>({});

  const typeaheadQueryRef = React.useRef<string>('');
  const typeaheadTimeout = useTimeout();

  const updateLabelMap = useEventCallback(
    (callback: (labelMap: TreeViewLabelMap) => TreeViewLabelMap) => {
      labelMap.current = callback(labelMap.current);
    },
  );

  const itemMetaLookup = useStore(store, itemsSelectors.itemMetaLookup);
  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    const newLabelMap: { [itemId: string]: string } = {};

    const processItem = (item: TreeViewItemMeta) => {
      newLabelMap[item.id] = item.label!.toLowerCase();
    };

    Object.values(itemMetaLookup).forEach(processItem);
    labelMap.current = newLabelMap;
  }, [itemMetaLookup, params.getItemId, instance]);

  const getNextItem = (itemIdToCheck: string) => {
    const nextItemId = getNextNavigableItem(store.state, itemIdToCheck);
    // We reached the end of the tree, check from the beginning
    if (nextItemId === null) {
      return getFirstNavigableItem(store.state);
    }

    return nextItemId;
  };

  const getNextMatchingItemId = (itemId: string, query: string): string | null => {
    let matchingItemId: string | null = null;
    const checkedItems: Record<string, true> = {};
    // If query length > 1, first check if current item matches
    let currentItemId: string = query.length > 1 ? itemId : getNextItem(itemId);
    // The "!checkedItems[currentItemId]" condition avoids an infinite loop when there is no matching item.
    while (matchingItemId == null && !checkedItems[currentItemId]) {
      const itemLabel = labelMap.current[currentItemId];

      if (itemLabel?.startsWith(query)) {
        matchingItemId = currentItemId;
      } else {
        checkedItems[currentItemId] = true;
        currentItemId = getNextItem(currentItemId);
      }
    }
    return matchingItemId;
  };

  const getFirstMatchingItem = (itemId: string, newKey: string): string | null => {
    const cleanNewKey = newKey.toLowerCase();

    // Try matching with accumulated query + new key
    const concatenatedQuery = `${typeaheadQueryRef.current}${cleanNewKey}`;

    // check if the entire typed query matches an item
    const concatenatedQueryMatchingItemId = getNextMatchingItemId(itemId, concatenatedQuery);
    if (concatenatedQueryMatchingItemId != null) {
      typeaheadQueryRef.current = concatenatedQuery;
      return concatenatedQueryMatchingItemId;
    }

    const newKeyMatchingItemId = getNextMatchingItemId(itemId, cleanNewKey);
    if (newKeyMatchingItemId != null) {
      typeaheadQueryRef.current = cleanNewKey;
      return newKeyMatchingItemId;
    }

    typeaheadQueryRef.current = '';
    return null;
  };

  const canToggleItemSelection = (itemId: string) =>
    selectionSelectors.enabled(store.state) && !itemsSelectors.isItemDisabled(store.state, itemId);

  const canToggleItemExpansion = (itemId: string) => {
    return (
      !itemsSelectors.isItemDisabled(store.state, itemId) &&
      expansionSelectors.isItemExpandable(store.state, itemId)
    );
  };

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  const handleItemKeyDown = async (
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
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(store.state);

    // eslint-disable-next-line default-case
    switch (true) {
      // Select the item when pressing "Space"
      case key === ' ' && canToggleItemSelection(itemId): {
        event.preventDefault();
        if (isMultiSelectEnabled && event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.setItemSelection({
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
          labelSelectors.isItemEditable(store.state, itemId) &&
          !labelSelectors.isItemBeingEdited(store.state, itemId)
        ) {
          instance.setEditedItem(itemId);
        } else if (canToggleItemExpansion(itemId)) {
          instance.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else if (canToggleItemSelection(itemId)) {
          if (isMultiSelectEnabled) {
            event.preventDefault();
            instance.setItemSelection({ event, itemId, keepExistingSelection: true });
          } else if (!selectionSelectors.isItemSelected(store.state, itemId)) {
            instance.setItemSelection({ event, itemId });
            event.preventDefault();
          }
        }

        break;
      }

      // Focus the next focusable item
      case key === 'ArrowDown': {
        const nextItem = getNextNavigableItem(store.state, itemId);
        if (nextItem) {
          event.preventDefault();
          instance.focusItem(event, nextItem);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next item
          if (isMultiSelectEnabled && event.shiftKey && canToggleItemSelection(nextItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }

        break;
      }

      // Focuses the previous focusable item
      case key === 'ArrowUp': {
        const previousItem = getPreviousNavigableItem(store.state, itemId);
        if (previousItem) {
          event.preventDefault();
          instance.focusItem(event, previousItem);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous item
          if (isMultiSelectEnabled && event.shiftKey && canToggleItemSelection(previousItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, previousItem);
          }
        }

        break;
      }

      // If the focused item is expanded, we move the focus to its first child
      // If the focused item is collapsed and has children, we expand it
      case (key === 'ArrowRight' && !isRtl) || (key === 'ArrowLeft' && isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (expansionSelectors.isItemExpanded(store.state, itemId)) {
          const nextItemId = getNextNavigableItem(store.state, itemId);
          if (nextItemId) {
            instance.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (canToggleItemExpansion(itemId)) {
          instance.setItemExpansion({ event, itemId });
          event.preventDefault();
        }

        break;
      }

      // If the focused item is expanded, we collapse it
      // If the focused item is collapsed and has a parent, we move the focus to this parent
      case (key === 'ArrowLeft' && !isRtl) || (key === 'ArrowRight' && isRtl): {
        if (ctrlPressed) {
          return;
        }
        if (
          canToggleItemExpansion(itemId) &&
          expansionSelectors.isItemExpanded(store.state, itemId)
        ) {
          instance.setItemExpansion({ event, itemId });
          event.preventDefault();
        } else {
          const parent = itemsSelectors.itemParentId(store.state, itemId);
          if (parent) {
            instance.focusItem(event, parent);
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
          canToggleItemSelection(itemId) &&
          isMultiSelectEnabled &&
          ctrlPressed &&
          event.shiftKey
        ) {
          instance.selectRangeFromStartToItem(event, itemId);
        } else {
          instance.focusItem(event, getFirstNavigableItem(store.state));
        }

        event.preventDefault();
        break;
      }

      // Focuses the last item in the tree
      case key === 'End': {
        // Multi select behavior when pressing Ctrl + Shirt + End
        // Selects the focused item and all the items down to the last item.
        if (
          canToggleItemSelection(itemId) &&
          isMultiSelectEnabled &&
          ctrlPressed &&
          event.shiftKey
        ) {
          instance.selectRangeFromItemToEnd(event, itemId);
        } else {
          instance.focusItem(event, getLastNavigableItem(store.state));
        }

        event.preventDefault();
        break;
      }

      // Expand all siblings that are at the same level as the focused item
      case key === '*': {
        instance.expandAllSiblings(event, itemId);
        event.preventDefault();
        break;
      }

      // Multi select behavior when pressing Ctrl + a
      // Selects all the items
      case String.fromCharCode(event.keyCode) === 'A' &&
        ctrlPressed &&
        isMultiSelectEnabled &&
        selectionSelectors.enabled(store.state): {
        instance.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }

      // Type-ahead
      case !ctrlPressed && !event.shiftKey && isPrintableKey(key): {
        typeaheadTimeout.clear();

        const matchingItem = getFirstMatchingItem(itemId, key);

        if (matchingItem != null) {
          instance.focusItem(event, matchingItem);
          event.preventDefault();
        } else {
          typeaheadQueryRef.current = '';
        }

        typeaheadTimeout.start(TYPEAHEAD_TIMEOUT, () => {
          typeaheadQueryRef.current = '';
        });
        break;
      }
    }
  };

  return {
    instance: {
      updateLabelMap,
      handleItemKeyDown,
    },
  };
};

useTreeViewKeyboardNavigation.params = {};
