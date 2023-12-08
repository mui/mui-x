import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { EventHandlers } from '@mui/base/utils';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import {
  getFirstNode,
  getLastNode,
  getNextNode,
  getPreviousNode,
  populateInstance,
} from '../../useTreeView/useTreeView.utils';
import { UseTreeViewKeyboardNavigationSignature } from './useTreeViewKeyboardNavigation.types';

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
  UseTreeViewKeyboardNavigationSignature
> = ({ instance, params, models }) => {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';
  const firstCharMap = React.useRef<{ [nodeId: string]: string }>({});

  const mapFirstChar = useEventCallback((nodeId: string, firstChar: string) => {
    firstCharMap.current[nodeId] = firstChar;

    return () => {
      const newMap = { ...firstCharMap.current };
      delete newMap[nodeId];
      firstCharMap.current = newMap;
    };
  });

  populateInstance<UseTreeViewKeyboardNavigationSignature>(instance, {
    mapFirstChar,
  });

  const handleNextArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (
      models.focusedNodeId.value != null &&
      instance.isNodeExpandable(models.focusedNodeId.value)
    ) {
      if (instance.isNodeExpanded(models.focusedNodeId.value)) {
        instance.focusNode(event, getNextNode(instance, models.focusedNodeId.value));
      } else if (!instance.isNodeDisabled(models.focusedNodeId.value)) {
        instance.toggleNodeExpansion(event, models.focusedNodeId.value);
      }
    }
    return true;
  };

  const handlePreviousArrow = (event: React.KeyboardEvent<HTMLUListElement>) => {
    if (models.focusedNodeId.value == null) {
      return false;
    }

    if (
      instance.isNodeExpanded(models.focusedNodeId.value) &&
      !instance.isNodeDisabled(models.focusedNodeId.value)
    ) {
      instance.toggleNodeExpansion(event, models.focusedNodeId.value!);
      return true;
    }

    const parent = instance.getNode(models.focusedNodeId.value).parentId;
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

  const createHandleKeyDown =
    (otherHandlers: EventHandlers) => (event: React.KeyboardEvent<HTMLUListElement>) => {
      otherHandlers.onKeyDown?.(event);

      let flag = false;
      const key = event.key;

      // If the tree is empty there will be no focused node
      if (
        event.altKey ||
        event.currentTarget !== event.target ||
        models.focusedNodeId.value == null
      ) {
        return;
      }

      const ctrlPressed = event.ctrlKey || event.metaKey;
      switch (key) {
        case ' ':
          if (!params.disableSelection && !instance.isNodeDisabled(models.focusedNodeId.value)) {
            flag = true;
            if (params.multiSelect && event.shiftKey) {
              instance.selectRange(event, { end: models.focusedNodeId.value });
            } else if (params.multiSelect) {
              instance.selectNode(event, models.focusedNodeId.value, true);
            } else {
              instance.selectNode(event, models.focusedNodeId.value);
            }
          }
          event.stopPropagation();
          break;
        case 'Enter':
          if (!instance.isNodeDisabled(models.focusedNodeId.value)) {
            if (instance.isNodeExpandable(models.focusedNodeId.value)) {
              instance.toggleNodeExpansion(event, models.focusedNodeId.value);
              flag = true;
            } else if (!params.disableSelection) {
              flag = true;
              if (params.multiSelect) {
                instance.selectNode(event, models.focusedNodeId.value, true);
              } else {
                instance.selectNode(event, models.focusedNodeId.value);
              }
            }
          }
          event.stopPropagation();
          break;
        case 'ArrowDown':
          if (params.multiSelect && event.shiftKey && !params.disableSelection) {
            selectNextNode(event, models.focusedNodeId.value);
          }
          instance.focusNode(event, getNextNode(instance, models.focusedNodeId.value));
          flag = true;
          break;
        case 'ArrowUp':
          if (params.multiSelect && event.shiftKey && !params.disableSelection) {
            selectPreviousNode(event, models.focusedNodeId.value);
          }
          instance.focusNode(event, getPreviousNode(instance, models.focusedNodeId.value));
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
            params.multiSelect &&
            ctrlPressed &&
            event.shiftKey &&
            !params.disableSelection &&
            !instance.isNodeDisabled(models.focusedNodeId.value)
          ) {
            instance.rangeSelectToFirst(event, models.focusedNodeId.value);
          }
          instance.focusNode(event, getFirstNode(instance));
          flag = true;
          break;
        case 'End':
          if (
            params.multiSelect &&
            ctrlPressed &&
            event.shiftKey &&
            !params.disableSelection &&
            !instance.isNodeDisabled(models.focusedNodeId.value)
          ) {
            instance.rangeSelectToLast(event, models.focusedNodeId.value);
          }
          instance.focusNode(event, getLastNode(instance));
          flag = true;
          break;
        default:
          if (key === '*') {
            instance.expandAllSiblings(event, models.focusedNodeId.value);
            flag = true;
          } else if (
            params.multiSelect &&
            ctrlPressed &&
            key.toLowerCase() === 'a' &&
            !params.disableSelection
          ) {
            instance.selectRange(event, {
              start: getFirstNode(instance),
              end: getLastNode(instance),
            });
            flag = true;
          } else if (!ctrlPressed && !event.shiftKey && isPrintableCharacter(key)) {
            focusByFirstCharacter(event, models.focusedNodeId.value, key);
            flag = true;
          }
      }

      if (flag) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

  return { getRootProps: (otherHandlers) => ({ onKeyDown: createHandleKeyDown(otherHandlers) }) };
};
