import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../../models';
import {
  getFirstNode,
  getLastNode,
  getNextNode,
  getPreviousNode,
  populateInstance,
} from '../useTreeView.utils';
import {
  UseTreeViewKeyboardNavigationInstance,
  UseTreeViewKeyboardNavigationDefaultizedProps,
} from './useTreeViewKeyboardNavigation.types';
import type { UseTreeViewSelectionDefaultizedProps } from '../useTreeViewSelection';
import { UseTreeViewNodesDefaultizedProps } from '../useTreeViewNodes';

function isPrintableCharacter(string: string) {
  return string && string.length === 1 && string.match(/\S/);
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
  UseTreeViewKeyboardNavigationDefaultizedProps &
    UseTreeViewSelectionDefaultizedProps<any> &
    UseTreeViewNodesDefaultizedProps
> = ({ instance, props, state }) => {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const firstCharMap = React.useRef<{ [nodeId: string]: string }>({});

  const mapFirstChar = useEventCallback((nodeId: string, firstChar: string) => {
    firstCharMap.current[nodeId] = firstChar;
  });

  const unMapFirstChar = useEventCallback((nodeId: string) => {
    const newMap = { ...firstCharMap.current };
    delete newMap[nodeId];
    firstCharMap.current = newMap;
  });

  populateInstance<UseTreeViewKeyboardNavigationInstance>(instance, {
    mapFirstChar,
    unMapFirstChar,
  });

  const getParent = (nodeId: string) => instance.nodeMap[nodeId].parentId;

  const handleNextArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (state.focusedNodeId != null && instance.isNodeExpandable(state.focusedNodeId)) {
      if (instance.isNodeExpanded(state.focusedNodeId)) {
        instance.focusNode(event, getNextNode(instance, state.focusedNodeId));
      } else if (!instance.isNodeDisabled(state.focusedNodeId)) {
        instance.toggleNodeExpansion(event, state.focusedNodeId);
      }
    }
    return true;
  };

  const handlePreviousArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (state.focusedNodeId == null) {
      return false;
    }

    if (
      instance.isNodeExpanded(state.focusedNodeId) &&
      !instance.isNodeDisabled(state.focusedNodeId)
    ) {
      instance.toggleNodeExpansion(event, state.focusedNodeId!);
      return true;
    }

    const parent = getParent(state.focusedNodeId);
    if (parent) {
      instance.focusNode(event, parent);
      return true;
    }
    return false;
  };

  const focusByFirstCharacter = (
    event: React.KeyboardEvent<HTMLUListElement>,
    nodeId: string,
    firstChar: string,
  ) => {
    let start: number;
    let index: number;
    const lowercaseChar = firstChar.toLowerCase();

    const firstCharIds: string[] = [];
    const firstChars: string[] = [];
    // This really only works since the ids are strings
    Object.keys(firstCharMap.current).forEach((mapNodeId) => {
      const map = instance.nodeMap[mapNodeId];
      const visible = map.parentId ? instance.isNodeExpanded(map.parentId) : true;
      const shouldBeSkipped = props.disabledItemsFocusable
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

    // If match was found...
    if (index > -1) {
      instance.focusNode(event, firstCharIds[index]);
    }
  };

  const selectNextNode = (event: React.KeyboardEvent<HTMLUListElement>, id: string) => {
    if (!instance.isNodeDisabled(getNextNode(instance, id))) {
      instance.selectRange(
        event,
        {
          end: getNextNode(instance, id),
          current: id,
        },
        true,
      );
    }
  };

  const selectPreviousNode = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    if (!instance.isNodeDisabled(getPreviousNode(instance, nodeId))) {
      instance.selectRange(
        event,
        {
          end: getPreviousNode(instance, nodeId)!,
          current: nodeId,
        },
        true,
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    let flag = false;
    const key = event.key;

    // If the tree is empty there will be no focused node
    if (event.altKey || event.currentTarget !== event.target || state.focusedNodeId == null) {
      return;
    }

    const ctrlPressed = event.ctrlKey || event.metaKey;
    switch (key) {
      case ' ':
        if (!props.disableSelection && !instance.isNodeDisabled(state.focusedNodeId)) {
          flag = true;
          if (props.multiSelect && event.shiftKey) {
            instance.selectRange(event, { end: state.focusedNodeId });
          } else if (props.multiSelect) {
            instance.selectNode(event, state.focusedNodeId, true);
          } else {
            instance.selectNode(event, state.focusedNodeId);
          }
        }
        event.stopPropagation();
        break;
      case 'Enter':
        if (!instance.isNodeDisabled(state.focusedNodeId)) {
          if (instance.isNodeExpandable(state.focusedNodeId)) {
            instance.toggleNodeExpansion(event, state.focusedNodeId);
            flag = true;
          } else if (!props.disableSelection) {
            flag = true;
            if (props.multiSelect) {
              instance.selectNode(event, state.focusedNodeId, true);
            } else {
              instance.selectNode(event, state.focusedNodeId);
            }
          }
        }
        event.stopPropagation();
        break;
      case 'ArrowDown':
        if (props.multiSelect && event.shiftKey && !props.disableSelection) {
          selectNextNode(event, state.focusedNodeId);
        }
        instance.focusNode(event, getNextNode(instance, state.focusedNodeId));
        flag = true;
        break;
      case 'ArrowUp':
        if (props.multiSelect && event.shiftKey && !props.disableSelection) {
          selectPreviousNode(event, state.focusedNodeId);
        }
        instance.focusNode(event, getPreviousNode(instance, state.focusedNodeId));
        flag = true;
        break;
      case 'ArrowRight':
        if (isRtl) {
          flag = handlePreviousArrow(event);
        } else {
          flag = handleNextArrow(event);
        }
        break;
      case 'ArrowLeft':
        if (isRtl) {
          flag = handleNextArrow(event);
        } else {
          flag = handlePreviousArrow(event);
        }
        break;
      case 'Home':
        if (
          props.multiSelect &&
          ctrlPressed &&
          event.shiftKey &&
          !props.disableSelection &&
          !instance.isNodeDisabled(state.focusedNodeId)
        ) {
          instance.rangeSelectToFirst(event, state.focusedNodeId);
        }
        instance.focusNode(event, getFirstNode(instance));
        flag = true;
        break;
      case 'End':
        if (
          props.multiSelect &&
          ctrlPressed &&
          event.shiftKey &&
          !props.disableSelection &&
          !instance.isNodeDisabled(state.focusedNodeId)
        ) {
          instance.rangeSelectToLast(event, state.focusedNodeId);
        }
        instance.focusNode(event, getLastNode(instance));
        flag = true;
        break;
      default:
        if (key === '*') {
          instance.expandAllSiblings(event, state.focusedNodeId);
          flag = true;
        } else if (
          props.multiSelect &&
          ctrlPressed &&
          key.toLowerCase() === 'a' &&
          !props.disableSelection
        ) {
          instance.selectRange(event, {
            start: getFirstNode(instance),
            end: getLastNode(instance),
          });
          flag = true;
        } else if (!ctrlPressed && !event.shiftKey && isPrintableCharacter(key)) {
          focusByFirstCharacter(event, state.focusedNodeId, key);
          flag = true;
        }
    }

    if (flag) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (props.onKeyDown) {
      props.onKeyDown(event);
    }
  };

  return { getRootProps: () => ({ onKeyDown: handleKeyDown }) };
};
