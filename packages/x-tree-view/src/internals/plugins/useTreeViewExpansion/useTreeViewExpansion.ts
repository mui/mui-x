import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewExpansionInstance,
  UseTreeViewExpansionSignature,
} from './useTreeViewExpansion.types';
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
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';
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

  const setExpandedItems = (event: React.SyntheticEvent | null, value: TreeViewItemId[]) => {
    if (params.expandedItems === undefined) {
      store.update((prevState) => ({
        ...prevState,
        expansion: { ...prevState.expansion, expandedItems: value },
      }));
    }
    params.onExpandedItemsChange?.(event, value);
  };

  const applyItemExpansion: UseTreeViewExpansionInstance['applyItemExpansion'] = useEventCallback(
    ({ itemId, event, shouldBeExpanded }) => {
      const oldExpanded = selectorExpandedItems(store.value);
      let newExpanded: string[];
      if (shouldBeExpanded) {
        newExpanded = [itemId].concat(oldExpanded);
      } else {
        newExpanded = oldExpanded.filter((id) => id !== itemId);
      }

      if (params.onItemExpansionToggle) {
        params.onItemExpansionToggle(event, itemId, shouldBeExpanded);
      }

      setExpandedItems(event, newExpanded);
    },
  );

  const setItemExpansion: UseTreeViewExpansionInstance['setItemExpansion'] = useEventCallback(
    ({ itemId, event = null, shouldBeExpanded }) => {
      const isExpandedBefore = selectorIsItemExpanded(store.value, itemId);
      const cleanShouldBeExpanded = shouldBeExpanded ?? !isExpandedBefore;
      if (isExpandedBefore === cleanShouldBeExpanded) {
        return;
      }

      const eventParameters = {
        isExpansionPrevented: false,
        shouldBeExpanded: cleanShouldBeExpanded,
        event,
        itemId,
      };
      publishTreeViewEvent(instance, 'beforeItemToggleExpansion', eventParameters);
      if (eventParameters.isExpansionPrevented) {
        return;
      }

      instance.applyItemExpansion({ itemId, event, shouldBeExpanded: cleanShouldBeExpanded });
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

    const newExpanded = selectorExpandedItems(store.value).concat(diff);

    if (diff.length > 0) {
      if (params.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          params.onItemExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      setExpandedItems(event, newExpanded);
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
        expansion: { ...prevState.expansion, expandedItems },
      }));
    }
  }, [store, params.expandedItems]);

  return {
    publicAPI: {
      setItemExpansion,
    },
    instance: {
      setItemExpansion,
      applyItemExpansion,
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
