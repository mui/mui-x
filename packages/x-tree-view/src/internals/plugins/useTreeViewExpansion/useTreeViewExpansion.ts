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
  const setExpandedNodes = (event: React.SyntheticEvent, value: string[]) => {
    params.onExpandedNodesChange?.(event, value);
    models.expandedNodes.setControlledValue(value);
  };

  const isNodeExpanded = React.useCallback(
    (itemId: string) => {
      return Array.isArray(models.expandedNodes.value)
        ? models.expandedNodes.value.indexOf(itemId) !== -1
        : false;
    },
    [models.expandedNodes.value],
  );

  const isNodeExpandable = React.useCallback(
    (itemId: string) => !!instance.getNode(itemId)?.expandable,
    [instance],
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, itemId: string | null) => {
      if (itemId == null) {
        return;
      }

      const isExpandedBefore = models.expandedNodes.value.indexOf(itemId!) !== -1;

      let newExpanded: string[];
      if (isExpandedBefore) {
        newExpanded = models.expandedNodes.value.filter((id) => id !== itemId);
      } else {
        newExpanded = [itemId].concat(models.expandedNodes.value);
      }

      if (params.onNodeExpansionToggle) {
        params.onNodeExpansionToggle(event, itemId, !isExpandedBefore);
      }

      setExpandedNodes(event, newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, itemId: string) => {
    const node = instance.getNode(itemId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) => instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = models.expandedNodes.value.concat(diff);

    if (diff.length > 0) {
      if (params.onNodeExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onNodeExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      setExpandedNodes(event, newExpanded);
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
    getDefaultValue: (params) => params.defaultExpandedNodes,
  },
};

const DEFAULT_EXPANDED_NODES: string[] = [];

useTreeViewExpansion.getDefaultizedParams = (params) => ({
  ...params,
  defaultExpandedNodes: params.defaultExpandedNodes ?? DEFAULT_EXPANDED_NODES,
});

useTreeViewExpansion.params = {
  expandedNodes: true,
  defaultExpandedNodes: true,
  onExpandedNodesChange: true,
  onNodeExpansionToggle: true,
};
