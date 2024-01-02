import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { TreeViewPlugin } from '../../models';
import { populateInstance } from '../../useTreeView/useTreeView.utils';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  instance,
  params,
  models,
}) => {
  const isNodeExpanded = React.useCallback(
    (nodeId: string) => {
      return Array.isArray(models.expandedNodes.value)
        ? models.expandedNodes.value.indexOf(nodeId) !== -1
        : false;
    },
    [models.expandedNodes.value],
  );

  const isNodeExpandable = React.useCallback(
    (nodeId: string) => !!instance.getNode(nodeId)?.expandable,
    [instance],
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, nodeId: string | null) => {
      if (nodeId == null) {
        return;
      }

      const isExpandedBefore = models.expandedNodes.value.indexOf(nodeId!) !== -1;

      let newExpanded: string[];
      if (isExpandedBefore) {
        newExpanded = models.expandedNodes.value.filter((id) => id !== nodeId);
      } else {
        newExpanded = [nodeId].concat(models.expandedNodes.value);
      }

      if (params.onNodeExpansionToggle) {
        params.onNodeExpansionToggle(event, nodeId, !isExpandedBefore);
      }

      if (params.onExpandedNodesChange) {
        params.onExpandedNodesChange(event, newExpanded);
      }

      models.expandedNodes.setValue(newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    const node = instance.getNode(nodeId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) => instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = models.expandedNodes.value.concat(diff);

    if (diff.length > 0) {
      if (params.onNodeExpansionToggle) {
        diff.forEach((newlyExpandedNodeId) => {
          params.onNodeExpansionToggle!(event, newlyExpandedNodeId, true);
        });
      }

      if (params.onExpandedNodesChange) {
        params.onExpandedNodesChange(event, newExpanded);
      }

      models.expandedNodes.setValue(newExpanded);
    }
  };

  populateInstance<UseTreeViewExpansionSignature>(instance, {
    isNodeExpanded,
    isNodeExpandable,
    toggleNodeExpansion,
    expandAllSiblings,
  });
};

useTreeViewExpansion.models = {
  expandedNodes: {
    controlledProp: 'expandedNodes',
    defaultProp: 'defaultExpandedNodes',
  },
};

const DEFAULT_EXPANDED_NODES: string[] = [];

useTreeViewExpansion.getDefaultizedParams = (params) => ({
  ...params,
  defaultExpandedNodes: params.defaultExpandedNodes ?? DEFAULT_EXPANDED_NODES,
});
