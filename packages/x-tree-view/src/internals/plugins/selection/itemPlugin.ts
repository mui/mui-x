import type * as React from 'react';
import { useStore } from '@base-ui/utils/store';
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
  const isItemSelected = useStore(store, selectionSelectors.isItemSelected, itemId);

  // An item is "inherently not selectable" when disabled or excluded via isItemSelectionDisabled,
  // regardless of the global disableSelection flag. Such items must not have aria-checked.
  const isItemInherentlyNotSelectable = isItemDisabled || !isItemSelectable;

  return {
    propsEnhancers: {
      root: (): UseTreeItemRootSlotPropsFromSelection => {
        // https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
        // `aria-checked` belongs to the tree variant with checkboxes; a tree without
        // checkboxes conveys selection through `aria-selected` instead.
        let value: React.AriaAttributes['aria-checked'];
        if (isItemInherentlyNotSelectable) {
          // - if the tree contains nodes that are not selectable, the attribute is not present on those nodes.
          value = undefined;
        } else if (isCheckboxSelectionEnabled ? selectionStatus === 'selected' : isItemSelected) {
          // - each selected node has the attribute set to true.
          // Without checkboxes, only the selection model (not selection propagated from
          // descendants) decides `aria-selected`, so it stays in sync with the highlight.
          value = true;
        } else if (isCheckboxSelectionEnabled && selectionStatus === 'indeterminate') {
          value = 'mixed';
        } else if (!canItemBeSelected) {
          // disableSelection=true with an unselected item: the attribute is not present.
          value = undefined;
        } else {
          // - all nodes that are selectable but not selected have the attribute set to false.
          value = false;
        }

        return isCheckboxSelectionEnabled
          ? { 'aria-checked': value, 'aria-selected': undefined }
          : // aria-selected has no tri-state value, so an indeterminate item (a parent
            // with some but not all descendants selected) is reported as not selected.
            { 'aria-checked': undefined, 'aria-selected': value === 'mixed' ? false : value };
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
  'aria-selected': React.AriaAttributes['aria-selected'];
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
