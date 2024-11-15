import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';
import { TreeViewItemId } from '../../../models';
import { selectorIsItemExpandable, selectorIsItemExpanded } from './useTreeViewExpansion.selectors';
import { createExpandedItemsMap } from './useTreeViewExpansion.utils';
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from '../useTreeViewItems/useTreeViewItems.selectors';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  instance,
  store,
  params,
  models,
  experimentalFeatures,
}) => {
  const isTreeViewEditable = Boolean(params.isItemEditable) && !!experimentalFeatures.labelEditing;

  useEnhancedEffect(() => {
    store.update((prevState) => ({
      ...prevState,
      expansion: {
        expandedItemsMap: createExpandedItemsMap(models.expandedItems.value),
      },
    }));
  }, [store, models.expandedItems.value]);

  const setExpandedItems = (event: React.SyntheticEvent, value: TreeViewItemId[]) => {
    params.onExpandedItemsChange?.(event, value);
    models.expandedItems.setControlledValue(value);
  };

  const toggleItemExpansion = useEventCallback(
    (event: React.SyntheticEvent, itemId: TreeViewItemId) => {
      const isExpandedBefore = selectorIsItemExpanded(store.value, itemId);
      instance.setItemExpansion(event, itemId, !isExpandedBefore);
    },
  );

  const setItemExpansion = useEventCallback(
    (event: React.SyntheticEvent, itemId: TreeViewItemId, isExpanded: boolean) => {
      const isExpandedBefore = selectorIsItemExpanded(store.value, itemId);
      if (isExpandedBefore === isExpanded) {
        return;
      }

      let newExpanded: string[];
      if (isExpanded) {
        newExpanded = [itemId].concat(models.expandedItems.value);
      } else {
        newExpanded = models.expandedItems.value.filter((id) => id !== itemId);
      }

      if (params.onItemExpansionToggle) {
        params.onItemExpansionToggle(event, itemId, isExpanded);
      }

      setExpandedItems(event, newExpanded);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent, itemId: TreeViewItemId) => {
    const itemMeta = selectorItemMeta(store.value, itemId);
    if (itemMeta == null) {
      return;
    }

    const siblings = selectorItemOrderedChildrenIds(store.value, itemMeta.parentId);

    const diff = siblings.filter(
      (child) =>
        selectorIsItemExpandable(store.value, child) && !selectorIsItemExpanded(store.value, child),
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

  const expansionTrigger = React.useMemo(() => {
    if (params.expansionTrigger) {
      return params.expansionTrigger;
    }

    if (isTreeViewEditable) {
      return 'iconContainer';
    }

    return 'content';
  }, [params.expansionTrigger, isTreeViewEditable]);

  const pluginContextValue = React.useMemo(
    () => ({
      expansion: {
        expansionTrigger,
      },
    }),
    [expansionTrigger],
  );

  return {
    publicAPI: {
      setItemExpansion,
    },
    instance: {
      setItemExpansion,
      toggleItemExpansion,
      expandAllSiblings,
    },
    contextValue: pluginContextValue,
  };
};

useTreeViewExpansion.models = {
  expandedItems: {
    getDefaultValue: (params) => params.defaultExpandedItems,
  },
};

const DEFAULT_EXPANDED_ITEMS: string[] = [];

useTreeViewExpansion.getDefaultizedParams = ({ params }) => ({
  ...params,
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS,
});

useTreeViewExpansion.getInitialState = (params) => ({
  expansion: {
    expandedItemsMap: createExpandedItemsMap(
      params.expandedItems === undefined ? params.defaultExpandedItems : params.expandedItems,
    ),
  },
});

useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
  expansionTrigger: true,
};
