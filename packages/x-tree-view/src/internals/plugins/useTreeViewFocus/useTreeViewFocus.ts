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
    (nodeId: string) => models.focusedNode.value === nodeId,
    [models.focusedNode.value],
  );

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    if (nodeId) {
      if (params.onFocusedNodeChange) {
        params.onFocusedNodeChange(event, nodeId);
      }
      models.focusedNode.setControlledValue(nodeId);
    }
  });

  const focusRoot = useEventCallback(() => {
    rootRef.current?.focus({ preventScroll: true });
  });

  populateInstance<UseTreeViewFocusSignature>(instance, {
    isNodeFocused,
    focusNode,
    focusRoot,
  });

  useInstanceEventHandler(instance, 'removeNode', ({ id }) => {
    if (
      models.focusedNode.value === id &&
      rootRef.current === ownerDocument(rootRef.current).activeElement
    ) {
      const newId = instance.getChildrenIds(null)[0];
      models.focusedNode.setControlledValue(newId);
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
        if (Array.isArray(models.selectedNodes.value)) {
          nodeToFocusId = models.selectedNodes.value.find(isNodeVisible);
        } else if (
          models.selectedNodes.value != null &&
          isNodeVisible(models.selectedNodes.value)
        ) {
          nodeToFocusId = models.selectedNodes.value;
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
      models.focusedNode.setControlledValue(null);
    };

  const focusedNode = instance.getNode(models.focusedNode.value!);
  const activeDescendant = focusedNode
    ? instance.getTreeItemId(focusedNode.id, focusedNode.idAttribute)
    : null;

  return {
    getRootProps: (otherHandlers) => ({
      onFocus: createHandleFocus(otherHandlers),
      onBlur: createHandleBlur(otherHandlers),
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.models = {
  focusedNode: {
    getDefaultValue: (params) => params.defaultFocusedNodeId,
  },
};

useTreeViewFocus.getDefaultizedParams = (params) => ({
  ...params,
  defaultFocusedNodeId: params.defaultFocusedNodeId ?? null,
});

useTreeViewFocus.params = {
  onFocusedNodeChange: true,
  focusedNode: true,
  defaultFocusedNodeId: true,
};
