import * as React from 'react';
import { createSelector, useStore } from '@mui/x-internals/store';
import {
  TreeViewItemId,
  TreeViewCancellableEvent,
  TreeViewCancellableEventHandler,
} from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import { TreeViewAnyStore, TreeViewItemPlugin } from '../../models';
import { itemsSelectors } from '../items/selectors';
import { selectionSelectors } from './selectors';
import { MinimalTreeViewState } from '../../MinimalTreeViewStore';

const selectorCheckboxSelectionStatus = createSelector(
  (state: MinimalTreeViewState<any, any>, itemId: TreeViewItemId) => {
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

    const shouldSelectBasedOnDescendants = selectionSelectors.propagationRules(state).parents;
    if (shouldSelectBasedOnDescendants) {
      if (hasSelectedDescendant && hasUnSelectedDescendant) {
        return 'indeterminate';
      }
      if (hasSelectedDescendant && !hasUnSelectedDescendant) {
        return 'checked';
      }
      return 'empty';
    }

    if (hasSelectedDescendant) {
      return 'indeterminate';
    }

    return 'empty';
  },
);

export const useSelectionItemPlugin: TreeViewItemPlugin = ({ props }) => {
  const { itemId } = props;

  const { store } = useTreeViewContext<TreeViewAnyStore>();

  const isCheckboxSelectionEnabled = useStore(store, selectionSelectors.isCheckboxSelectionEnabled);
  const isFeatureEnabledForItem = useStore(
    store,
    selectionSelectors.isFeatureEnabledForItem,
    itemId,
  );
  const canItemBeSelected = useStore(store, selectionSelectors.canItemBeSelected, itemId);
  const selectionStatus = useStore(store, selectorCheckboxSelectionStatus, itemId);

  return {
    propsEnhancers: {
      root: (): UseTreeItemRootSlotPropsFromSelection => {
        // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
        let ariaChecked: React.AriaAttributes['aria-checked'];
        if (selectionStatus === 'checked') {
          // - each selected node has aria-checked set to true.
          ariaChecked = true;
        } else if (selectionStatus === 'indeterminate') {
          ariaChecked = 'mixed';
        } else if (!canItemBeSelected) {
          // - if the tree contains nodes that are not selectable, aria-checked is not present on those nodes.
          ariaChecked = undefined;
        } else {
          // - all nodes that are selectable but not selected have aria-checked set to false.
          ariaChecked = false;
        }

        return {
          'aria-checked': ariaChecked,
        };
      },
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
          visible: isCheckboxSelectionEnabled && isFeatureEnabledForItem,
          disabled: !canItemBeSelected,
          checked: selectionStatus === 'checked',
          indeterminate: selectionStatus === 'indeterminate',
        };
      },
    },
  };
};

interface UseTreeItemRootSlotPropsFromSelection {
  'aria-checked': React.AriaAttributes['aria-checked'];
}

interface UseTreeItemCheckboxSlotPropsFromSelection {
  visible?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  tabIndex?: -1;
  onChange?: TreeViewCancellableEventHandler<React.ChangeEvent<HTMLInputElement>>;
}

declare module '@mui/x-tree-view/useTreeItem' {
  interface UseTreeItemRootSlotOwnProps extends UseTreeItemRootSlotPropsFromSelection {}

  interface UseTreeItemCheckboxSlotOwnProps extends UseTreeItemCheckboxSlotPropsFromSelection {}
}
