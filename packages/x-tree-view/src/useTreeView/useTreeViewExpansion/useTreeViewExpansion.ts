import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../useTreeView.utils';
import { UseTreeViewExpansionInstance } from './useTreeViewExpansion.types';

export const useTreeViewExpansion: TreeViewPlugin = ({ instance, props }) => {
  const [expanded, setExpandedState] = useControlled({
    controlled: props.expanded,
    default: props.defaultExpanded,
    name: 'TreeView',
    state: 'expanded',
  });

  const isNodeExpanded = useEventCallback((nodeId: string) =>
    Array.isArray(expanded) ? expanded.indexOf(nodeId) !== -1 : false,
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

      if (expanded.indexOf(nodeId!) !== -1) {
        newExpanded = expanded.filter((id) => id !== nodeId);
      } else {
        newExpanded = [nodeId].concat(expanded);
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

    const newExpanded = expanded.concat(diff);

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
