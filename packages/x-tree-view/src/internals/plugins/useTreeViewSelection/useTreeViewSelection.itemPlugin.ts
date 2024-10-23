import * as React from 'react';
import type { TreeItem2Props } from '../../../TreeItem2';
import type { TreeItemProps } from '../../../TreeItem';
import {
  TreeViewItemId,
  TreeViewSelectionPropagation,
  TreeViewCancellableEvent,
} from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewItemPlugin } from '../../models';
import {
  UseTreeItem2CheckboxSlotPropsFromSelection,
  UseTreeViewSelectionSignature,
} from './useTreeViewSelection.types';
import { selectorItemOrderedChildrenIds, UseTreeViewItemsSignature } from '../useTreeViewItems';
import { selectorIsItemSelected } from './useTreeViewSelection.selectors';
import { TreeViewStore } from '../../utils/TreeViewStore';

function getCheckboxStatus({
  itemId,
  store,
  selectionPropagation,
  selected,
}: {
  itemId: TreeViewItemId;
  store: TreeViewStore<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>;
  selectionPropagation: TreeViewSelectionPropagation;
  selected: boolean;
}) {
  if (selected) {
    return {
      indeterminate: false,
      checked: true,
    };
  }

  const children = selectorItemOrderedChildrenIds(store.value, itemId);
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
      if (selectorIsItemSelected(store.value, itemToTraverseId)) {
        hasSelectedDescendant = true;
      } else {
        hasUnSelectedDescendant = true;
      }
    }

    selectorItemOrderedChildrenIds(store.value, itemToTraverseId).forEach(traverseDescendants);
  };

  traverseDescendants(itemId);

  return {
    indeterminate:
      (hasSelectedDescendant && hasUnSelectedDescendant) || (!hasUnSelectedDescendant && !selected),
    checked: selectionPropagation.parents ? hasSelectedDescendant : selected,
  };
}

export const useTreeViewSelectionItemPlugin: TreeViewItemPlugin<TreeItemProps | TreeItem2Props> = ({
  props,
}) => {
  const { itemId } = props;

  const {
    store,
    selection: { disableSelection, checkboxSelection, selectionPropagation },
  } = useTreeViewContext<[UseTreeViewItemsSignature, UseTreeViewSelectionSignature]>();
  return {
    propsEnhancers: {
      checkbox: ({
        externalEventHandlers,
        interactions,
        status,
      }): UseTreeItem2CheckboxSlotPropsFromSelection => {
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
          store,
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
