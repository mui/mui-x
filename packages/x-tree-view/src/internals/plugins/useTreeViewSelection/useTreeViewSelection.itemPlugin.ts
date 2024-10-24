import * as React from 'react';
import {
  TreeViewItemId,
  TreeViewSelectionPropagation,
  TreeViewCancellableEvent,
} from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewInstance, TreeViewItemPlugin } from '../../models';
import {
  UseTreeItemCheckboxSlotPropsFromSelection,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import { UseTreeViewItemsSignature } from '../useTreeViewItems';

function getCheckboxStatus({
  itemId,
  instance,
  selectionPropagation,
  selected,
}: {
  itemId: TreeViewItemId;
  instance: TreeViewInstance<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>;
  selectionPropagation: TreeViewSelectionPropagation;
  selected: boolean;
}) {
  if (selected) {
    return {
      indeterminate: false,
      checked: true,
    };
  }

  const children = instance.getItemOrderedChildrenIds(itemId);
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
      if (instance.isItemSelected(itemToTraverseId)) {
        hasSelectedDescendant = true;
      } else {
        hasUnSelectedDescendant = true;
      }
    }

    instance.getItemOrderedChildrenIds(itemToTraverseId).forEach(traverseDescendants);
  };

  traverseDescendants(itemId);

  return {
    indeterminate:
      (hasSelectedDescendant && hasUnSelectedDescendant) || (!hasUnSelectedDescendant && !selected),
    checked: selectionPropagation.parents ? hasSelectedDescendant : selected,
  };
}

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const {
    instance,
    selection: { disableSelection, checkboxSelection, selectionPropagation },
  } = useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();
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

        const checkboxStatus = getCheckboxStatus({
          instance,
          itemId,
          selectionPropagation,
          selected: status.selected,
        });

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
