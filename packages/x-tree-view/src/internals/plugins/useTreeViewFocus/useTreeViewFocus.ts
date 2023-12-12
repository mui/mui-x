import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { EventHandlers } from '@mui/base/utils';
import ownerDocument from '@mui/utils/ownerDocument';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewFocusSignature } from './useTreeViewFocus.types';
import { useInstanceEventHandler } from '../../hooks/useInstanceEventHandler';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusSignature> = ({
  instance,
  params,
  models,
  rootRef,
}) => {
  const isNodeFocused = React.useCallback(
    (nodeId: string) => models.focusedNodeId.value === nodeId,
    [models.focusedNodeId.value],
  );

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    if (nodeId) {
      if (params.onNodeFocus) {
        params.onNodeFocus(event, nodeId);
      }
      models.focusedNodeId.setValue(nodeId);
    }
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    focusNode,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    if (
      models.focusedNodeId.value === id &&
      rootRef.current === ownerDocument(rootRef.current).activeElement
    ) {
      const newId = instance.getChildrenIds(null)[0];
      models.focusedNodeId.setValue(newId);
    }
  });

  const createHandleFocus =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onFocus?.(event);

      // if the event bubbled (which is React specific) we don't want to steal focus
      if (event.target === event.currentTarget) {
        const isNodeVisible = (nodeId: string) => {
          const node = instance.getNode(nodeId);
          return node && (node.parentId == null || instance.isNodeExpanded(node.parentId));
        };

        let nodeToFocusId: string | null | undefined;
        if (Array.isArray(models.selected.value)) {
          nodeToFocusId = models.selected.value.find(isNodeVisible);
        } else if (models.selected.value != null && isNodeVisible(models.selected.value)) {
          nodeToFocusId = models.selected.value;
        }

        if (nodeToFocusId == null) {
          nodeToFocusId = instance.getNavigableChildrenIds(null)[0];
        }

        instance.focusNode(event, nodeToFocusId);
      }
    };

  const createHandleBlur =
    (otherHandlers: EventHandlers) => (event: React.FocusEvent<HTMLUListElement>) => {
      otherHandlers.onBlur?.(event);
      models.focusedNodeId.setValue(null);
    };

  const focusedNode = instance.getNode(models.focusedNodeId.value!);
  const activeDescendant = focusedNode ? focusedNode.idAttribute : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      onBlur: createHandleBlur(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.models = {
  focusedNodeId: {
    controlledProp: 'focusedNodeId',
    defaultProp: 'defaultFocusedNodeId',
  },
};

useTreeViewFocus.getDefaultizedParams = (params) => ({
  ...params,
  disabledItemsFocusable: params.disabledItemsFocusable ?? false,
  defaultFocusedNodeId: params.defaultFocusedNodeId ?? null,
});
