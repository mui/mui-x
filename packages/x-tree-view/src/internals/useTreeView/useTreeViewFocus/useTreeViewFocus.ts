import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../../models';
import { populateInstance } from '../useTreeView.utils';
import {
  UseTreeViewFocusInstance,
  UseTreeViewFocusProps,
  UseTreeViewFocusState,
} from './useTreeViewFocus.types';

export const useTreeViewFocus: TreeViewPlugin<UseTreeViewFocusProps, UseTreeViewFocusState> = ({
  instance,
  props,
  state,
  setState,
  models,
}) => {
  const setFocusedNodeId = useEventCallback((nodeId: React.SetStateAction<string | null>) => {
    const cleanNodeId = typeof nodeId === 'function' ? nodeId(state.focusedNodeId) : nodeId;
    setState((prevState) => ({ ...prevState, focusedNodeId: cleanNodeId }));
  });

  const isNodeFocused = React.useCallback(
    (nodeId: string) => state.focusedNodeId === nodeId,
    [state.focusedNodeId],
  );

  const focusNode = useEventCallback((event: React.SyntheticEvent, nodeId: string | null) => {
    if (nodeId) {
      setFocusedNodeId(nodeId);

      if (props.onNodeFocus) {
        props.onNodeFocus(event, nodeId);
      }
    }
  });

  populateInstance<UseTreeViewFocusInstance>(instance, {
    isNodeFocused,
    focusNode,
    setFocusedNodeId,
  });

  const handleFocus = (event: React.FocusEvent<HTMLUListElement>) => {
    // if the event bubbled (which is React specific) we don't want to steal focus
    if (event.target === event.currentTarget) {
      const firstSelected = Array.isArray(models.selected.value)
        ? models.selected.value[0]
        : models.selected.value;
      instance.focusNode(event, firstSelected || instance.getNavigableChildrenIds(null)[0]);
    }

    if (props.onFocus) {
      props.onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLUListElement>) => {
    setFocusedNodeId(null);

    if (props.onBlur) {
      props.onBlur(event);
    }
  };

  const activeDescendant = instance.nodeMap[state.focusedNodeId!]
    ? instance.nodeMap[state.focusedNodeId!].idAttribute
    : null;

  return {
    getRootProps: () => ({
      onFocus: handleFocus,
      onBlur: handleBlur,
      'aria-activedescendant': activeDescendant ?? undefined,
    }),
  };
};

useTreeViewFocus.getInitialState = () => ({ focusedNodeId: null });
