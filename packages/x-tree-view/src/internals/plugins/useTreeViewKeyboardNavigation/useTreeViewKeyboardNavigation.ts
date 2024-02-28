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

    const newFirstCharMap: { [nodeId: string]: string } = {};

    const processItem = (item: TreeViewBaseItem) => {
      const getItemId = params.getItemId;
      const nodeId = getItemId ? getItemId(item) : (item as { id: string }).id;
      newFirstCharMap[nodeId] = instance.getNode(nodeId).label!.substring(0, 1).toLowerCase();
      item.children?.forEach(processItem);
    };

    params.items.forEach(processItem);
    firstCharMap.current = newFirstCharMap;
  }, [params.items, params.getItemId, instance]);

  const getFirstMatchingNode = (nodeId: string, firstChar: string) => {
    let start: number;
    let index: number;
    const lowercaseChar = firstChar.toLowerCase();

    const firstCharIds: string[] = [];
    const firstChars: string[] = [];
    // This really only works since the ids are strings
    Object.keys(firstCharMap.current).forEach((mapNodeId) => {
      const map = instance.getNode(mapNodeId);
      const visible = map.parentId ? instance.isNodeExpanded(map.parentId) : true;
      const shouldBeSkipped = params.disabledItemsFocusable
        ? false
        : instance.isNodeDisabled(mapNodeId);

      if (visible && !shouldBeSkipped) {
        firstCharIds.push(mapNodeId);
        firstChars.push(firstCharMap.current[mapNodeId]);
      }
    });

    // Get start index for search based on position of currentItem
    start = firstCharIds.indexOf(nodeId) + 1;
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

  const canToggleNodeSelection = (nodeId: string) =>
    !params.disableSelection && !instance.isNodeDisabled(nodeId);

  const canToggleNodeExpansion = (nodeId: string) =>
    !instance.isNodeDisabled(nodeId) && instance.isNodeExpandable(nodeId);

  // ARIA specification: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboardinteraction
  const handleItemKeyDown = (
    event: React.KeyboardEvent<HTMLLIElement> & MuiCancellableEvent,
    nodeId: string,
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
      case key === ' ' && canToggleNodeSelection(nodeId): {
        event.preventDefault();
        if (params.multiSelect && event.shiftKey) {
          instance.selectRange(event, { end: nodeId });
        } else if (params.multiSelect) {
          instance.selectNode(event, nodeId, true);
        } else {
          instance.selectNode(event, nodeId);
        }
        break;
      }

      // If the focused node has children, we expand it.
      // If the focused node has no children, we select it.
      case key === 'Enter': {
        if (canToggleNodeExpansion(nodeId)) {
          instance.toggleNodeExpansion(event, nodeId);
          event.preventDefault();
        } else if (canToggleNodeSelection(nodeId)) {
          if (params.multiSelect) {
            event.preventDefault();
            instance.selectNode(event, nodeId, true);
          } else if (!instance.isNodeSelected(nodeId)) {
            instance.selectNode(event, nodeId);
            event.preventDefault();
          }
        }

        break;
      }

      // Focus the next focusable node
      case key === 'ArrowDown': {
        const nextNode = getNextNode(instance, nodeId);
        if (nextNode) {
          event.preventDefault();
          instance.focusNode(event, nextNode);

          // Multi select behavior when pressing Shift + ArrowDown
          // Toggles the selection state of the next node
          if (params.multiSelect && event.shiftKey && canToggleNodeSelection(nextNode)) {
            instance.selectRange(
              event,
              {
                end: nextNode,
                current: nodeId,
              },
              true,
            );
          }
        }

        break;
      }

      // Focuses the previous focusable node
      case key === 'ArrowUp': {
        const previousNode = getPreviousNode(instance, nodeId);
        if (previousNode) {
          event.preventDefault();
          instance.focusNode(event, previousNode);

          // Multi select behavior when pressing Shift + ArrowUp
          // Toggles the selection state of the previous node
          if (params.multiSelect && event.shiftKey && canToggleNodeSelection(previousNode)) {
            instance.selectRange(
              event,
              {
                end: previousNode,
                current: nodeId,
              },
              true,
            );
          }
        }

        break;
      }

      // If the focused node is expanded, we move the focus to its first child
      // If the focused node is collapsed and has children, we expand it
      case (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL): {
        if (instance.isNodeExpanded(nodeId)) {
          const nextNodeId = getNextNode(instance, nodeId);
          if (nextNodeId) {
            instance.focusNode(event, nextNodeId);
            event.preventDefault();
          }
        } else if (canToggleNodeExpansion(nodeId)) {
          instance.toggleNodeExpansion(event, nodeId);
          event.preventDefault();
        }

        break;
      }

      // If the focused node is expanded, we collapse it
      // If the focused node is collapsed and has a parent, we move the focus to this parent
      case (key === 'ArrowLeft' && !isRTL) || (key === 'ArrowRight' && isRTL): {
        if (canToggleNodeExpansion(nodeId) && instance.isNodeExpanded(nodeId)) {
          instance.toggleNodeExpansion(event, nodeId);
          event.preventDefault();
        } else {
          const parent = instance.getNode(nodeId).parentId;
          if (parent) {
            instance.focusNode(event, parent);
            event.preventDefault();
          }
        }

        break;
      }

      // Focuses the first node in the tree
      case key === 'Home': {
        instance.focusNode(event, getFirstNode(instance));

        // Multi select behavior when pressing Ctrl + Shift + Home
        // Selects the focused node and all nodes up to the first node.
        if (canToggleNodeSelection(nodeId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.rangeSelectToFirst(event, nodeId);
        }

        event.preventDefault();
        break;
      }

      // Focuses the last node in the tree
      case key === 'End': {
        instance.focusNode(event, getLastNode(instance));

        // Multi select behavior when pressing Ctrl + Shirt + End
        // Selects the focused node and all the nodes down to the last node.
        if (canToggleNodeSelection(nodeId) && params.multiSelect && ctrlPressed && event.shiftKey) {
          instance.rangeSelectToLast(event, nodeId);
        }

        event.preventDefault();
        break;
      }

      // Expand all siblings that are at the same level as the focused node
      case key === '*': {
        instance.expandAllSiblings(event, nodeId);
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
        const matchingNode = getFirstMatchingNode(nodeId, key);
        if (matchingNode != null) {
          instance.focusNode(event, matchingNode);
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
