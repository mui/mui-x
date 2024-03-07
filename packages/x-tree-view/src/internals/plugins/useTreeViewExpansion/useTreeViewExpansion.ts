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
  const setExpandedItems = (event: React.SyntheticEvent, value: string[]) => {
    params.onExpandedItemsChange?.(event, value);
    models.expandedItems.setControlledValue(value);
  };

  const isNodeExpanded = React.useCallback(
    (nodeId: string) => {
      return Array.isArray(models.expandedItems.value)
        ? models.expandedItems.value.indexOf(nodeId) !== -1
        : false;
    },
    [models.expandedItems.value],
  );

  const isNodeExpandable = React.useCallback(
    (nodeId: string) => !!instance.getNode(nodeId)?.expandable,
    [instance],
  );

  const toggleNodeExpansion = useEventCallback(
    (event: React.SyntheticEvent, itemId: string | null) => {
      if (itemId == null) {
        return;
      }

      const isExpandedBefore = models.expandedItems.value.indexOf(itemId!) !== -1;

      let newExpanded: string[];
      if (isExpandedBefore) {
        newExpanded = models.expandedItems.value.filter((id) => id !== itemId);
      } else {
        newExpanded = [itemId].concat(models.expandedItems.value);
      }

      if (params.onItemExpansionToggle) {
        params.onItemExpansionToggle(event, itemId, !isExpandedBefore);
      }

      setExpandedItems(event, newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent<HTMLUListElement>, nodeId: string) => {
    const node = instance.getNode(nodeId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) => instance.isNodeExpandable(child) && !instance.isNodeExpanded(child),
    );

    const newExpanded = models.expandedItems.value.concat(diff);

    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedNodeId) => {
          params.onItemExpansionToggle!(event, newlyExpandedNodeId, true);
        });
      }

      setExpandedItems(event, newExpanded);
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
  expandedItems: {
    getDefaultValue: (params) => params.defaultExpandedItems,
  },
};

const DEFAULT_EXPANDED_NODES: string[] = [];

useTreeViewExpansion.getDefaultizedParams = (params) => ({
  ...params,
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_NODES,
});

useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
};
