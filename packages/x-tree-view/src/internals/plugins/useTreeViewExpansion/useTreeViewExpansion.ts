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

  const isItemExpanded = React.useCallback(
    (itemId: string) => {
      return Array.isArray(models.expandedItems.value)
        ? models.expandedItems.value.indexOf(itemId) !== -1
        : false;
    },
    [models.expandedItems.value],
  );

  const isItemExpandable = React.useCallback(
    (itemId: string) => !!instance.getNode(itemId)?.expandable,
    [instance],
  );

  const toggleItemExpansion = useEventCallback(
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

  const expandAllSiblings = (event: React.KeyboardEvent, itemId: string) => {
    const node = instance.getNode(itemId);
    const siblings = instance.getChildrenIds(node.parentId);

    const diff = siblings.filter(
      (child) => instance.isItemExpandable(child) && !instance.isItemExpanded(child),
    );

    const newExpanded = models.expandedItems.value.concat(diff);

    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onItemExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      setExpandedItems(event, newExpanded);
    }
  };

  populateInstance<UseTreeViewExpansionSignature>(instance, {
    isItemExpanded,
    isItemExpandable,
    toggleItemExpansion,
    expandAllSiblings,
  });
};

useTreeViewExpansion.models = {
  expandedItems: {
    getDefaultValue: (params) => params.defaultExpandedItems,
  },
};

const DEFAULT_EXPANDED_ITEMS: string[] = [];

useTreeViewExpansion.getDefaultizedParams = (params) => ({
  ...params,
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS,
});

useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
};
