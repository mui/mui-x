import * as React from 'react';
import { createSelector, useStore } from '@mui/x-internals/store';
import { TreeViewItemId, TreeViewCancellableEvent } from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin, TreeViewState } from '../../models';
import {
  UseTreeItemCheckboxSlotPropsFromSelection,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { itemsSelectors } from '../useTreeViewItems/useTreeViewItems.selectors';
import { selectionSelectors } from './useTreeViewSelection.selectors';

const selectorCheckboxSelectionStatus = createSelector(
  (
    state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>,
    itemId: TreeViewItemId,
  ) => {
    if (selectionSelectors.isItemSelected(state, itemId)) {
      return 'checked';
    }

    let hasSelectedDescendant = false;
    let hasUnSelectedDescendant = false;

    const traverseDescendants = (itemToTraverseId: TreeViewItemId) => {
      if (itemToTraverseId !== itemId) {
        if (selectionSelectors.isItemSelected(state, itemToTraverseId)) {
          hasSelectedDescendant = true;
        } else {
          hasUnSelectedDescendant = true;
        }
      }

      itemsSelectors.itemOrderedChildrenIds(state, itemToTraverseId).forEach(traverseDescendants);
    };

    traverseDescendants(itemId);

    if (hasSelectedDescendant && hasUnSelectedDescendant) {
      return 'indeterminate';
    }

    const shouldSelectBasedOnDescendants = selectionSelectors.propagationRules(state).parents;
    return shouldSelectBasedOnDescendants && hasSelectedDescendant && !hasUnSelectedDescendant
      ? 'checked'
      : 'empty';
  },
);

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const { store } =
    useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();

  const isCheckboxSelectionEnabled = useStore(store, selectionSelectors.isCheckboxSelectionEnabled);
  const isItemSelectionEnabled = useStore(store, selectionSelectors.canItemBeSelected, itemId);
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

          if (!selectionSelectors.canItemBeSelected(store.state, itemId)) {
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
