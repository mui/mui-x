import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import {
  getFirstNode,
  getLastNode,
  getNextNode,
  getPreviousNode,
  populateInstance,
} from '../../useTreeView/useTreeView.utils';
import {
  TreeViewFirstCharMap,
  UseTreeViewKeyboardNavigationSignature,
} from './useTreeViewKeyboardNavigation.types';
import { TreeViewBaseItem } from '../../../models';
import { MuiCancellableEvent } from '../../models/MuiCancellableEvent';

function isPrintableCharacter(string: string) {
  return !!string && string.length === 1 && !!string.match(/\S/);
}

function findNextFirstChar(firstChars: string[], startIndex: number, char: string) {
  for (let i = startIndex; i < firstChars.length; i += 1) {
    if (char === firstChars[i]) {
      return i;
    }
  }
  return -1;
}

export const useTreeViewKeyboardNavigation: TreeViewPlugin<
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, params }) => {
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';
  const firstCharMap = React.useRef<TreeViewFirstCharMap>({});
  const hasFirstCharMapBeenUpdatedImperatively = React.useRef(false);

  const updateFirstCharMap = useEventCallback(
    (callback: (firstCharMap: TreeViewFirstCharMap) => TreeViewFirstCharMap) => {
      hasFirstCharMapBeenUpdatedImperatively.current = true;
      firstCharMap.current = callback(firstCharMap.current);
    },
  );

  React.useEffect(() => {
    if (hasFirstCharMapBeenUpdatedImperatively.current) {
      return;
    }

    const newFirstCharMap: { [itemId: string]: string } = {};

    const processItem = (item: TreeViewBaseItem) => {
      const getItemId = params.getItemId;
      const itemId = getItemId ? getItemId(item) : (item as { id: string }).id;
      newFirstCharMap[itemId] = instance.getNode(itemId).label!.substring(0, 1).toLowerCase();
      item.children?.forEach(processItem);
    };

    params.items.forEach(processItem);
    firstCharMap.current = newFirstCharMap;
  }, [params.items, params.getItemId, instance]);

  const getFirstMatchingItem = (itemId: string, firstChar: string) => {
    let start: number;
    let index: number;
    const lowercaseChar = firstChar.toLowerCase();

    const firstCharIds: string[] = [];
    const firstChars: string[] = [];
    // This really only works since the ids are strings
    Object.keys(firstCharMap.current).forEach((mapItemId) => {
      const map = instance.getNode(mapItemId);
      const visible = map.parentId ? instance.isNodeExpanded(map.parentId) : true;
      const shouldBeSkipped = params.disabledItemsFocusable
        ? false
        : instance.isNodeDisabled(mapItemId);

      if (visible && !shouldBeSkipped) {
        firstCharIds.push(mapItemId);
        firstChars.push(firstCharMap.current[mapItemId]);
      }
    });

    // Get start index for search based on position of currentItem
    start = firstCharIds.indexOf(itemId) + 1;
    if (start >= firstCharIds.length) {
      start = 0;
    }

    // Check remaining slots in the menu
    index = findNextFirstChar(firstChars, start, lowercaseChar);

    // If not found in remaining slots, check from beginning
    if (index === -1) {
      index = findNextFirstChar(firstChars, 0, lowercaseChar);
    }

    // If a match was found...
    if (index > -1) {
      return firstCharIds[index];
    }

    return null;
  };

  const canToggleItemSelection = (itemId: string) =>
    !params.disableSelection && !instance.isNodeDisabled(itemId);

  const canToggleItemExpansion = (itemId: string) => {
    return !instance.isNodeDisabled(itemId) && instance.isNodeExpandable(itemId);
  };

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLElement> & MuiCancellableEvent,
    itemId: string,
  ) => {
    if (event.defaultMuiPrevented) {
      return;
    }

    if (event.altKey || event.currentTarget !== event.target) {
      return;
    }

    const ctrlPressed = event.ctrlKey || event.metaKey;
    const key = event.key;

    // eslint-disable-next-line default-case
    switch (true) {
      // Select the node when pressing "Space"
      case key === ' ' && canToggleItemSelection(itemId): {
        event.preventDefault();
        if (params.multiSelect && event.shiftKey) {
          instance.selectRange(event, { end: itemId });
        } else if (params.multiSelect) {
          instance.selectNode(event, itemId, true);
        } else {
          instance.selectNode(event, itemId);
        }
        break;
      }

      // If the focused node has children, we expand it.
      // If the focused node has no children, we select it.
      case key === 'Enter': {
        if (canToggleItemExpansion(itemId)) {
          instance.toggleNodeExpansion(event, itemId);
          event.preventDefault();
        } else if (canToggleItemSelection(itemId)) {
          if (params.multiSelect) {
            event.preventDefault();
            instance.selectNode(event, itemId, true);
          } else if (!instance.isNodeSelected(itemId)) {
            instance.selectNode(event, itemId);
            event.preventDefault();
          }
        }

        break;
      }

      // Focus the next focusable item
      case key === 'ArrowDown': {
        const nextItem = getNextNode(instance, itemId);
        if (nextItem) {
          event.preventDefault();
          instance.focusItem(event, nextItem);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next item
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(nextItem)) {
            instance.selectRange(
              event,
              {
                end: nextItem,
                current: itemId,
              },
              true,
            );
          }
        }

        break;
      }

      // Focuses the previous focusable item
      case key === 'ArrowUp': {
        const previousItem = getPreviousNode(instance, itemId);
        if (previousItem) {
          event.preventDefault();
          instance.focusItem(event, previousItem);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous item
          if (params.multiSelect && event.shiftKey && canToggleItemSelection(previousItem)) {
            instance.selectRange(
              event,
              {
                end: previousItem,
                current: itemId,
              },
              true,
            );
          }
        }

        break;
      }

      // If the focused item is expanded, we move the focus to its first child
      // If the focused item is collapsed and has children, we expand it
      case (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL): {
        if (instance.isNodeExpanded(itemId)) {
          const nextNodeId = getNextNode(instance, itemId);
          if (nextNodeId) {
            instance.focusItem(event, nextNodeId);
            event.preventDefault();
          }
        } else if (canToggleItemExpansion(itemId)) {
          instance.toggleNodeExpansion(event, itemId);
          event.preventDefault();
        }

        break;
      }

      // If the focused item is expanded, we collapse it
      // If the focused item is collapsed and has a parent, we move the focus to this parent
      case (key === 'ArrowLeft' && !isRTL) || (key === 'ArrowRight' && isRTL): {
        if (canToggleItemExpansion(itemId) && instance.isNodeExpanded(itemId)) {
          instance.toggleNodeExpansion(event, itemId);
          event.preventDefault();
        } else {
          const parent = instance.getNode(itemId).parentId;
          if (parent) {
            instance.focusItem(event, parent);
            event.preventDefault();
          }
        }

        break;
      }

      // Focuses the first node in the tree
      case key === 'Home': {
        instance.focusItem(event, getFirstNode(instance));

        // Multi select behavior when pressing Ctrl + Shift + Home
        // Selects the focused node and all nodes up to the first node.
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.rangeSelectToFirst(event, itemId);
        }

        event.preventDefault();
        break;
      }

      // Focuses the last item in the tree
      case key === 'End': {
        instance.focusItem(event, getLastNode(instance));

        // Multi select behavior when pressing Ctrl + Shirt + End
        // Selects the focused item and all the items down to the last item.
        if (canToggleItemSelection(itemId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.rangeSelectToLast(event, itemId);
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
      // Selects all the nodes
      case key === 'a' && ctrlPressed && params.multiSelect && !params.disableSelection: {
        instance.selectRange(event, {
          start: getFirstNode(instance),
          end: getLastNode(instance),
        });
        event.preventDefault();
        break;
      }

      // Type-ahead
      // TODO: Support typing multiple characters
      case !ctrlPressed && !event.shiftKey && isPrintableCharacter(key): {
        const matchingNode = getFirstMatchingItem(itemId, key);
        if (matchingNode != null) {
          instance.focusItem(event, matchingNode);
          event.preventDefault();
        }
        break;
      }
    }
  };

  populateInstance<UseTreeViewKeyboardNavigationSignature>(instance, {
    updateFirstCharMap,
    handleItemKeyDown,
  });
};

useTreeViewKeyboardNavigation.params = {};
