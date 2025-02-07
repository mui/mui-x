import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import { UseTreeViewExpansionSignature } from './useTreeViewExpansion.types';
import { TreeViewItemId } from '../../../models';
import {
  selectorExpandedItems,
  selectorIsItemExpandable,
  selectorIsItemExpanded,
} from './useTreeViewExpansion.selectors';
import { getExpansionTrigger } from './useTreeViewExpansion.utils';
import {
  selectorItemMeta,
  selectorItemOrderedChildrenIds,
} from '../useTreeViewItems/useTreeViewItems.selectors';
import { useAssertModelConsistency } from '../../utils/models';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  instance,
  store,
  params,
}) => {
  useAssertModelConsistency({
    state: 'expandedItems',
    controlled: params.expandedItems,
    defaultValue: params.defaultExpandedItems,
  });

  useEnhancedEffect(() => {
    store.update((prevState) => {
      const newExpansionTrigger = getExpansionTrigger({
        isItemEditable: params.isItemEditable,
        expansionTrigger: params.expansionTrigger,
      });
      if (prevState.expansion.expansionTrigger === newExpansionTrigger) {
        return prevState;
      }

      return {
        ...prevState,
        expansion: {
          ...prevState.expansion,
          expansionTrigger: newExpansionTrigger,
        },
      };
    });
  }, [store, params.isItemEditable, params.expansionTrigger]);

  const setExpandedItems = (event: React.SyntheticEvent, value: TreeViewItemId[]) => {
    if (params.expandedItems === undefined) {
      store.update((prevState) => ({
        ...prevState,
        expansion: { ...prevState.expansion, expandedItems: value },
      }));
    }
    params.onExpandedItemsChange?.(event, value);
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

      const oldModel = selectorExpandedItems(store.value);
      let newModel: string[];
      if (isExpanded) {
        newModel = [itemId].concat(oldModel);
      } else {
        newModel = oldModel.filter((id) => id !== itemId);
      }

      if (params.onItemExpansionToggle) {
        params.onItemExpansionToggle(event, itemId, isExpanded);
      }

      setExpandedItems(event, newModel);
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
    const newModel = selectorExpandedItems(store.value).concat(diff);

    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onItemExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      setExpandedItems(event, newModel);
    }
  };

  /**
   * Update the controlled model when the `expandedItems` prop changes.
   */
  useEnhancedEffect(() => {
    const expandedItems = params.expandedItems;
    if (expandedItems !== undefined) {
      store.update((prevState) => ({
        ...prevState,
        selection: { ...prevState.expansion, expandedItems },
      }));
    }
  }, [store, params.expandedItems]);

  return {
    publicAPI: {
      setItemExpansion,
    },
    instance: {
      setItemExpansion,
      toggleItemExpansion,
      expandAllSiblings,
    },
  };
};

const DEFAULT_EXPANDED_ITEMS: string[] = [];

useTreeViewExpansion.getDefaultizedParams = ({ params }) => ({
  ...params,
  defaultExpandedItems: params.defaultExpandedItems ?? DEFAULT_EXPANDED_ITEMS,
});

useTreeViewExpansion.getInitialState = (params) => ({
  expansion: {
    expandedItems:
      params.expandedItems === undefined ? params.defaultExpandedItems : params.expandedItems,
    expansionTrigger: getExpansionTrigger(params),
  },
});

useTreeViewExpansion.params = {
  expandedItems: true,
  defaultExpandedItems: true,
  onExpandedItemsChange: true,
  onItemExpansionToggle: true,
  expansionTrigger: true,
};
