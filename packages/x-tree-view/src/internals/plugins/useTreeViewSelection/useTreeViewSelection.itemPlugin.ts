import * as React from 'react';
import { fastObjectShallowCompare } from '@mui/x-internals/fastObjectShallowCompare';
import { TreeViewItemId, TreeViewCancellableEvent } from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin, TreeViewState } from '../../models';
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
import { useSelector } from '../../hooks/useSelector';

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
    indeterminate: (hasSelectedDescendant && hasUnSelectedDescendant) || !hasUnSelectedDescendant,
    checked: selectorSelectionPropagationRules(state).parents ? hasSelectedDescendant : false,
  };
}

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const { store } =
    useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();

  const checkboxStatus = useSelector(
    store,
    selectorItemCheckboxStatus,
    itemId,
    fastObjectShallowCompare,
  );

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

          if (!selectorIsItemSelectionEnabled(store.value, itemId)) {
            return;
          }

          interactions.handleCheckboxSelection(event);
        };

        return {
          tabIndex: -1,
          onChange: handleChange,
          ...checkboxStatus,
        };
      },
    },
  };
};
