import * as React from 'react';
import { useAssertModelConsistency } from '@mui/x-internals/useAssertModelConsistency';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { TreeViewPlugin } from '../../models';
import {
  UseTreeViewExpansionInstance,
  UseTreeViewExpansionPublicAPI,
  UseTreeViewExpansionSignature,
} from './useTreeViewExpansion.types';
import { TreeViewItemId } from '../../../models';
import { expansionSelectors } from './useTreeViewExpansion.selectors';
import { getExpansionTrigger } from './useTreeViewExpansion.utils';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { publishTreeViewEvent } from '../../utils/publishTreeViewEvent';

export const useTreeViewExpansion: TreeViewPlugin<UseTreeViewExpansionSignature> = ({
  instance,
  store,
  params,
}) => {
  useAssertModelConsistency({
    componentName: 'Tree View',
    propName: 'expandedItems',
    controlled: params.expandedItems,
    defaultValue: params.defaultExpandedItems,
  });

  useEnhancedEffect(() => {
    const newExpansionTrigger = getExpansionTrigger({
      isItemEditable: params.isItemEditable,
      expansionTrigger: params.expansionTrigger,
    });
    if (store.state.expansion.expansionTrigger === newExpansionTrigger) {
      return;
    }

    store.set('expansion', {
      ...store.state.expansion,
      expansionTrigger: newExpansionTrigger,
    });
  }, [store, params.isItemEditable, params.expansionTrigger]);

  const setExpandedItems = (event: React.SyntheticEvent | null, value: TreeViewItemId[]) => {
    if (params.expandedItems === undefined) {
      store.set('expansion', {
        ...store.state.expansion,
        expandedItems: value,
      });
    }
    params.onExpandedItemsChange?.(event, value);
  };

  const resetItemExpansion = useEventCallback(() => {
    setExpandedItems(null, []);
  });

  const applyItemExpansion: UseTreeViewExpansionInstance['applyItemExpansion'] = useEventCallback(
    ({ itemId, event, shouldBeExpanded }) => {
      const oldExpanded = expansionSelectors.expandedItemsRaw(store.state);
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
      const isExpandedBefore = expansionSelectors.isItemExpanded(store.state, itemId);
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

  const isItemExpanded: UseTreeViewExpansionPublicAPI['isItemExpanded'] = useEventCallback(
    (itemId) => {
      return expansionSelectors.isItemExpandable(store.state, itemId);
    },
  );

  const expandAllSiblings = (event: React.KeyboardEvent, itemId: TreeViewItemId) => {
    const itemMeta = itemsSelectors.itemMeta(store.state, itemId);
    if (itemMeta == null) {
      return;
    }

    const siblings = itemsSelectors.itemOrderedChildrenIds(store.state, itemMeta.parentId);

    const diff = siblings.filter(
      (child) =>
        expansionSelectors.isItemExpandable(store.state, child) &&
        !expansionSelectors.isItemExpanded(store.state, child),
    );

    const newExpanded = expansionSelectors.expandedItemsRaw(store.state).concat(diff);

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
      store.set('expansion', { ...store.state.expansion, expandedItems });
    }
  }, [store, params.expandedItems]);

  return {
    publicAPI: {
      setItemExpansion,
      isItemExpanded,
    },
    instance: {
      setItemExpansion,
      applyItemExpansion,
      expandAllSiblings,
      resetItemExpansion,
    },
  };
};

const DEFAULT_EXPANDED_ITEMS: string[] = [];

useTreeViewExpansion.applyDefaultValuesToParams = ({ params }) => ({
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
