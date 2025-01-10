import * as React from 'react';
import {
  TreeViewItemId,
  TreeViewSelectionPropagation,
  TreeViewCancellableEvent,
} from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin, TreeViewState } from '../../models';
import {
  UseTreeItemCheckboxSlotPropsFromSelection,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';
import { selectorItemOrderedChildrenIds } from '../useTreeViewItems/useTreeViewItems.selectors';
import { selectorIsItemSelected } from './useTreeViewSelection.selectors';
import { useSelector } from '../../hooks/useSelector';

function selectorItemCheckboxStatus(
  state: TreeViewState<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>,
  {
    itemId,
    selectionPropagation,
  }: {
    itemId: TreeViewItemId;
    selectionPropagation: TreeViewSelectionPropagation;
  },
) {
  if (selectorIsItemSelected(state, itemId)) {
    return {
      indeterminate: false,
      checked: true,
    };
  }

  const children = selectorItemOrderedChildrenIds(state, itemId);
  if (children.length === 0) {
    return {
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
    indeterminate: (hasSelectedDescendant && hasUnSelectedDescendant) || !hasUnSelectedDescendant,
    checked: selectionPropagation.parents ? hasSelectedDescendant : false,
  };
}

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const {
    store,
    selection: { disableSelection, checkboxSelection, selectionPropagation },
  } = useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();

  const checkboxStatus = useSelector(
    store,
    selectorItemCheckboxStatus,
    {
      itemId,
      selectionPropagation,
    },
    (a, b) => a.checked === b.checked && a.indeterminate === b.indeterminate,
  );

  return {
    propsEnhancers: {
      checkbox: ({
        externalEventHandlers,
        interactions,
        status,
      }): UseTreeItemCheckboxSlotPropsFromSelection => {
        const handleChange = (
          event: React.ChangeEvent<HTMLInputElement> & TreeViewCancellableEvent,
        ) => {
          externalEventHandlers.onChange?.(event);
          if (event.defaultMuiPrevented) {
            return;
          }

          if (disableSelection || status.disabled) {
            return;
          }

          interactions.handleCheckboxSelection(event);
        };

        return {
          visible: checkboxSelection,
          disabled: disableSelection || status.disabled,
          tabIndex: -1,
          onChange: handleChange,
          ...checkboxStatus,
        };
      },
    },
  };
};
