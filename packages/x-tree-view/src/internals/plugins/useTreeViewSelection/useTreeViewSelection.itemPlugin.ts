import * as React from 'react';
// We need to import the shim because React 17 does not support the `useSyncExternalStore` API.
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/shim/with-selector';
import { createSelector, useStore } from '@base-ui-components/utils/store';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { TreeViewItemId, TreeViewCancellableEvent } from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin, TreeViewState, TreeViewStore } from '../../models';
import {
  UseTreeItemCheckboxSlotPropsFromSelection,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { selectorItemOrderedChildrenIds } from '../useTreeViewItems/useTreeViewItems.selectors';
import {
  selectorIsCheckboxSelectionEnabled,
  selectorIsItemSelected,
  selectorIsItemSelectionEnabled,
  selectorSelectionPropagationRules,
} from './useTreeViewSelection.selectors';

function selectorItemCheckboxStatus(
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>,
  itemId: TreeViewItemId,
) {
  const isCheckboxSelectionEnabled = selectorIsCheckboxSelectionEnabled(state);
  const isSelectionEnabledForItem = selectorIsItemSelectionEnabled(state, itemId);

  if (selectorIsItemSelected(state, itemId)) {
    return {
      disabled: !isSelectionEnabledForItem,
      visible: isCheckboxSelectionEnabled,
      indeterminate: false,
      checked: true,
    };
  }

  const children = selectorItemOrderedChildrenIds(state, itemId);
  if (children.length === 0) {
    return {
      disabled: !isSelectionEnabledForItem,
      visible: isCheckboxSelectionEnabled,
      indeterminate: false,
      checked: false,
    };
  }

  let hasSelectedDescendant = false;
  let hasUnSelectedDescendant = false;

  const traverseDescendants = (itemToTraverseId: TreeViewItemId) => {
    if (itemToTraverseId !== itemId) {
      if (selectorIsItemSelected(state, itemToTraverseId)) {
        hasSelectedDescendant = true;
      } else {
        hasUnSelectedDescendant = true;
      }
    }

    selectorItemOrderedChildrenIds(state, itemToTraverseId).forEach(traverseDescendants);
  };

  traverseDescendants(itemId);

  return {
    disabled: !isSelectionEnabledForItem,
    visible: isCheckboxSelectionEnabled,
    indeterminate: hasSelectedDescendant && hasUnSelectedDescendant,
    checked: selectorSelectionPropagationRules(state).parents
      ? hasSelectedDescendant && !hasUnSelectedDescendant
      : false,
  };
}

export function useItemCheckboxStatus(
  store: TreeViewStore<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>,
  itemId: TreeViewItemId,
): unknown {
  return useSyncExternalStoreWithSelector(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
    (state: typeof store.state) => selectorItemCheckboxStatus(state, itemId),
    fastObjectShallowCompare,
  );
}

const selectorCheckboxSelectionStatus = createSelector(
  (
    state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>,
    itemId: TreeViewItemId,
  ) => {
    if (selectorIsItemSelected(state, itemId)) {
      return 'checked';
    }

    let hasSelectedDescendant = false;
    let hasUnSelectedDescendant = false;

    const traverseDescendants = (itemToTraverseId: TreeViewItemId) => {
      if (itemToTraverseId !== itemId) {
        if (selectorIsItemSelected(state, itemToTraverseId)) {
          hasSelectedDescendant = true;
        } else {
          hasUnSelectedDescendant = true;
        }
      }

      selectorItemOrderedChildrenIds(state, itemToTraverseId).forEach(traverseDescendants);
    };

    traverseDescendants(itemId);

    if (hasSelectedDescendant && hasUnSelectedDescendant) {
      return 'indeterminate';
    }

    const shouldSelectBasedOnDescendants = selectorSelectionPropagationRules(state).parents;
    return shouldSelectBasedOnDescendants && hasSelectedDescendant && !hasUnSelectedDescendant
      ? 'checked'
      : 'empty';
  },
);

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const { store } =
    useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();

  const isCheckboxSelectionEnabled = useStore(store, selectorIsCheckboxSelectionEnabled);
  const isItemSelectionEnabled = useStore(store, selectorIsItemSelectionEnabled, itemId);
  const checkboxSelectionStatus = useStore(store, selectorCheckboxSelectionStatus, itemId);

  return {
    propsEnhancers: {
      checkbox: ({
        externalEventHandlers,
        interactions,
      }): UseTreeItemCheckboxSlotPropsFromSelection => {
        const handleChange = (
          event: React.ChangeEvent<HTMLInputElement> & TreeViewCancellableEvent,
        ) => {
          externalEventHandlers.onChange?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          if (!selectorIsItemSelectionEnabled(store.state, itemId)) {
            return;
          }

          interactions.handleCheckboxSelection(event);
        };

        return {
          tabIndex: -1,
          onChange: handleChange,
          visible: isCheckboxSelectionEnabled,
          disabled: !isItemSelectionEnabled,
          checked: checkboxSelectionStatus === 'checked',
          indeterminate: checkboxSelectionStatus === 'indeterminate',
        };
      },
    },
  };
};
