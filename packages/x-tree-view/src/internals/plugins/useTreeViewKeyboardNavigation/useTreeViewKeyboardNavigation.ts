import * as React from 'react';
import { useRtl } from '@mui/system/RtlProvider';
import useEventCallback from '@mui/utils/useEventCallback';
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
  TreeViewFirstCharMap,
  UseTreeViewKeyboardNavigationSignature,
} from './useTreeViewKeyboardNavigation.types';
import { hasPlugin } from '../../utils/plugins';
import { useTreeViewLabel } from '../useTreeViewLabel';
import { useSelector } from '../../hooks/useSelector';
import {
  selectorItemMetaLookup,
  selectorIsItemDisabled,
  selectorItemParentId,
} from '../useTreeViewItems/useTreeViewItems.selectors';
import {
  selectorIsItemBeingEdited,
  selectorIsItemEditable,
} from '../useTreeViewLabel/useTreeViewLabel.selectors';
import { selectorIsItemSelected } from '../useTreeViewSelection/useTreeViewSelection.selectors';
import {
  selectorIsItemExpandable,
  selectorIsItemExpanded,
} from '../useTreeViewExpansion/useTreeViewExpansion.selectors';

function isPrintableKey(string: string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}

export const useTreeViewKeyboardNavigation: TreeViewPlugin<
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, store, params }) => {
  const isRtl = useRtl();
  const firstCharMap = React.useRef<TreeViewFirstCharMap>({});

  const updateFirstCharMap = useEventCallback(
    (callback: (firstCharMap: TreeViewFirstCharMap) => TreeViewFirstCharMap) => {
      firstCharMap.current = callback(firstCharMap.current);
    },
  );

  const itemMetaLookup = useSelector(store, selectorItemMetaLookup);
  React.useEffect(() => {
    if (instance.areItemUpdatesPrevented()) {
      return;
    }

    const newFirstCharMap: { [itemId: string]: string } = {};

    const processItem = (item: TreeViewItemMeta) => {
      newFirstCharMap[item.id] = item.label!.substring(0, 1).toLowerCase();
    };

    Object.values(itemMetaLookup).forEach(processItem);
    firstCharMap.current = newFirstCharMap;
  }, [itemMetaLookup, params.getItemId, instance]);

  const getFirstMatchingItem = (itemId: string, query: string) => {
    const cleanQuery = query.toLowerCase();

    const getNextItem = (itemIdToCheck: string) => {
      const nextItemId = getNextNavigableItem(store.value, itemIdToCheck);
      // We reached the end of the tree, check from the beginning
      if (nextItemId === null) {
        return getFirstNavigableItem(store.value);
      }

      return nextItemId;
    };

    let matchingItemId: string | null = null;
    let currentItemId: string = getNextItem(itemId);
    const checkedItems: Record<string, true> = {};
    // The "!checkedItems[currentItemId]" condition avoids an infinite loop when there is no matching item.
    while (matchingItemId == null && !checkedItems[currentItemId]) {
      if (firstCharMap.current[currentItemId] === cleanQuery) {
        matchingItemId = currentItemId;
      } else {
        checkedItems[currentItemId] = true;
        currentItemId = getNextItem(currentItemId);
      }
    }

    return matchingItemId;
  };

  const canToggleItemSelection = (itemId: string) =>
    !params.disableSelection && !selectorIsItemDisabled(store.value, itemId);

  const canToggleItemExpansion = (itemId: string) => {
    return (
      !selectorIsItemDisabled(store.value, itemId) && selectorIsItemExpandable(store.value, itemId)
    );
  };

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  const handleItemKeyDown = (
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

    // eslint-disable-next-line default-case
    switch (true) {
      // Select the item when pressing "Space"
      case key === ' ' && canToggleItemSelection(itemId): {
        event.preventDefault();
        if (params.multiSelect && event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.selectItem({
            event,
            itemId,
            keepExistingSelection: params.multiSelect,
            shouldBeSelected: params.multiSelect ? undefined : true,
          });
        }
        break;
      }

      // If the focused item has children, we expand it.
      // If the focused item has no children, we select it.
      case key === 'Enter': {
        if (
          hasPlugin(instance, useTreeViewLabel) &&
          selectorIsItemEditable(store.value, { itemId, isItemEditable: params.isItemEditable! }) &&
          !selectorIsItemBeingEdited(store.value, itemId)
        ) {
          instance.setEditedItemId(itemId);
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else if (canToggleItemSelection(itemId)) {
          if (params.multiSelect) {
            event.preventDefault();
            instance.selectItem({ event, itemId, keepExistingSelection: true });
          } else if (!selectorIsItemSelected(store.value, itemId)) {
            instance.selectItem({ event, itemId });
            event.preventDefault();
          }
        }

        break;
      }

      // Focus the next focusable item
      case key === 'ArrowDown': {
        const nextItem = getNextNavigableItem(store.value, itemId);
        if (nextItem) {
          event.preventDefault();
          instance.focusItem(event, nextItem);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next item
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(nextItem)) {
            instance.selectItemFromArrowNavigation(event, itemId, nextItem);
          }
        }

        break;
      }

      // Focuses the previous focusable item
      case key === 'ArrowUp': {
        const previousItem = getPreviousNavigableItem(store.value, itemId);
        if (previousItem) {
          event.preventDefault();
          instance.focusItem(event, previousItem);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous item
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(previousItem)) {
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
        if (selectorIsItemExpanded(store.value, itemId)) {
          const nextItemId = getNextNavigableItem(store.value, itemId);
          if (nextItemId) {
            instance.focusItem(event, nextItemId);
            event.preventDefault();
          }
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleItemExpansion(event, itemId);
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
        if (canToggleItemExpansion(itemId) && selectorIsItemExpanded(store.value, itemId)) {
          instance.toggleItemExpansion(event, itemId);
          event.preventDefault();
        } else {
          const parent = selectorItemParentId(store.value, itemId);
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
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromStartToItem(event, itemId);
        } else {
          instance.focusItem(event, getFirstNavigableItem(store.value));
        }

        event.preventDefault();
        break;
      }

      // Focuses the last item in the tree
      case key === 'End': {
        // Multi select behavior when pressing Ctrl + Shirt + End
        // Selects the focused item and all the items down to the last item.
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.selectRangeFromItemToEnd(event, itemId);
        } else {
          instance.focusItem(event, getLastNavigableItem(store.value));
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
        params.multiSelect &&
        !params.disableSelection: {
        instance.selectAllNavigableItems(event);
        event.preventDefault();
        break;
      }

      // Type-ahead
      // TODO: Support typing multiple characters
      case !ctrlPressed && !event.shiftKey && isPrintableKey(key): {
        const matchingItem = getFirstMatchingItem(itemId, key);
        if (matchingItem != null) {
          instance.focusItem(event, matchingItem);
          event.preventDefault();
        }
        break;
      }
    }
  };

  return {
    instance: {
      updateFirstCharMap,
      handleItemKeyDown,
    },
  };
};

useTreeViewKeyboardNavigation.params = {};
