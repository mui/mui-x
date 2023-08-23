import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../useTreeView.utils';
import { UseTreeViewExpansionInstance } from './useTreeViewExpansion.types';

export const useTreeViewExpansion: TreeViewPlugin = ({ instance, props, state, setState }) => {
  const setExpandedState = (expanded: string[]) =>
    setState((prevState) => ({ ...prevState, expanded }));

  const isNodeExpanded = React.useCallback(
    (nodeId: string) => {
      return Array.isArray(state.expanded) ? state.expanded.indexOf(nodeId) !== -1 : false;
    },
    [state.expanded],
  );

  const isNodeExpandable = useEventCallback(
    (nodeId: string) => instance.nodeMap[nodeId] && instance.nodeMap[nodeId].expandable,
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, nodeId: string | null) => {
      if (nodeId == null) {
        return;
      }

      let newExpanded: string[];

      if (state.expanded.indexOf(nodeId!) !== -1) {
        newExpanded = state.expanded.filter((id) => id !== nodeId);
      } else {
        newExpanded = [nodeId].concat(state.expanded);
      }

      if (props.onNodeToggle) {
        props.onNodeToggle(event, newExpanded);
      }

      setExpandedState(newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    const map = instance.nodeMap[nodeId];
    const siblings = instance.getChildrenIds(map.parentId);

    const diff = siblings.filter(
      (child) => instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = state.expanded.concat(diff);

    if (diff.length > 0) {
      setExpandedState(newExpanded);

      if (props.onNodeToggle) {
        props.onNodeToggle(event, newExpanded);
      }
    }
  };

  populateInstance<UseTreeViewExpansionInstance>(instance, {
    isNodeExpanded,
    isNodeExpandable,
    toggleNodeExpansion,
    expandAllSiblings,
  });
};

useTreeViewExpansion.getInitialState = (props) => ({
  expanded: props.expanded ?? props.defaultExpanded,
});
