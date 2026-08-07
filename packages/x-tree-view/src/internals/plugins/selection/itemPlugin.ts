import type * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import type { TreeViewCancellableEvent, TreeViewCancellableEventHandler } from '../../../models';
import { useTreeViewContext } from '../../TreeViewProvider';
import type { TreeViewAnyStore, TreeViewItemPlugin } from '../../models';
import { itemsSelectors } from '../items/selectors';
import { selectionSelectors } from './selectors';

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
  const isItemDisabled = useStore(store, itemsSelectors.isItemDisabled, itemId);
  const isItemSelectable = useStore(store, selectionSelectors.isItemSelectable, itemId);
  const selectionStatus = useStore(store, selectionSelectors.itemSelectionStatus, itemId);

  // An item is "inherently not selectable" when disabled or excluded via isItemSelectionDisabled,
  // regardless of the global disableSelection flag. Such items must not have aria-checked.
  const isItemInherentlyNotSelectable = isItemDisabled || !isItemSelectable;

  return {
    propsEnhancers: {
      root: (): UseTreeItemRootSlotPropsFromSelection => {
        // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
        let ariaChecked: React.AriaAttributes['aria-checked'];
        if (isItemInherentlyNotSelectable) {
          // - if the tree contains nodes that are not selectable, aria-checked is not present on those nodes.
          ariaChecked = undefined;
        } else if (selectionStatus === 'selected') {
          // - each selected node has aria-checked set to true.
          ariaChecked = true;
        } else if (selectionStatus === 'indeterminate') {
          ariaChecked = 'mixed';
        } else if (!canItemBeSelected) {
          // disableSelection=true with an unselected item: aria-checked is not present.
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
          checked: selectionStatus === 'selected',
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
