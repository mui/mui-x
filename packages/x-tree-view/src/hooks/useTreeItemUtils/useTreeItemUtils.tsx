'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewCancellableEvent } from '../../models';
import { useTreeViewContext } from '../../internals/TreeViewProvider';
import type { UseTreeItemStatus } from '../../useTreeItem';
import { TreeViewPublicAPI, TreeViewAnyStore } from '../../internals/models';
import { expansionSelectors } from '../../internals/plugins/expansion/selectors';
import { focusSelectors } from '../../internals/plugins/focus/selectors';
import { itemsSelectors } from '../../internals/plugins/items/selectors';
import { selectionSelectors } from '../../internals/plugins/selection/selectors';
import { lazyLoadingSelectors } from '../../internals/plugins/lazyLoading/selectors';
import { labelSelectors } from '../../internals/plugins/labelEditing/selectors';
import { TreeViewLabelEditingPlugin } from '../../internals/plugins/labelEditing';

export interface UseTreeItemInteractions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleItemEditing: () => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
}

interface UseTreeItemUtilsReturnValue<TStore extends TreeViewAnyStore> {
  interactions: UseTreeItemInteractions;
  status: UseTreeItemStatus;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TStore>;
}

type TreeViewStoreWithLabelEditing = TreeViewAnyStore & {
  labelEditing?: TreeViewLabelEditingPlugin;
};

export const itemHasChildren = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(itemHasChildren);
  }
  return Boolean(reactChildren);
};

export const useTreeItemUtils = <
  TStore extends TreeViewStoreWithLabelEditing = TreeViewStoreWithLabelEditing,
>({
  itemId,
  children,
}: {
  itemId: string;
  children?: React.ReactNode;
}): UseTreeItemUtilsReturnValue<TStore> => {
  const { store, publicAPI } = useTreeViewContext<TStore>();

  const isItemExpandable = useStore(store, expansionSelectors.isItemExpandable, itemId);
  const isLoading = useStore(store, lazyLoadingSelectors.isItemLoading, itemId);
  const hasError = useStore(store, lazyLoadingSelectors.itemHasError, itemId);
  const isExpandable = itemHasChildren(children) || isItemExpandable;
  const isExpanded = useStore(store, expansionSelectors.isItemExpanded, itemId);
  const isFocused = useStore(store, focusSelectors.isItemFocused, itemId);
  const isSelected = useStore(store, selectionSelectors.isItemSelected, itemId);
  const isDisabled = useStore(store, itemsSelectors.isItemDisabled, itemId);
  const isEditing = useStore(store, labelSelectors.isItemBeingEdited, itemId);
  const isEditable = useStore(store, labelSelectors.isItemEditable, itemId);

  const status: UseTreeItemStatus = {
    expandable: isExpandable,
    expanded: isExpanded,
    focused: isFocused,
    selected: isSelected,
    disabled: isDisabled,
    editing: isEditing,
    editable: isEditable,
    loading: isLoading,
    error: hasError,
  };

  const handleExpansion = (event: React.MouseEvent) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused) {
      store.focus.focusItem(event, itemId);
    }

    const multiple =
      selectionSelectors.isMultiSelectEnabled(store.state) &&
      (event.shiftKey || event.ctrlKey || event.metaKey);

    // If already expanded and trying to toggle selection don't close
    if (
      status.expandable &&
      !(multiple && expansionSelectors.isItemExpanded(store.state, itemId))
    ) {
      // make sure the children selection is propagated again
      store.expansion.setItemExpansion({ event, itemId });
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (!selectionSelectors.canItemBeSelected(store.state, itemId)) {
      return;
    }

    if (!status.focused && !status.editing) {
      store.focus.focusItem(event, itemId);
    }

    const multiple =
      selectionSelectors.isMultiSelectEnabled(store.state) &&
      (event.shiftKey || event.ctrlKey || event.metaKey);

    if (multiple) {
      if (event.shiftKey) {
        store.selection.expandSelectionRange(event, itemId);
      } else {
        store.selection.setItemSelection({ event, itemId, keepExistingSelection: true });
      }
    } else {
      store.selection.setItemSelection({ event, itemId, shouldBeSelected: true });
    }
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasShift = (event.nativeEvent as PointerEvent).shiftKey;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(store.state);
    if (isMultiSelectEnabled && hasShift) {
      store.selection.expandSelectionRange(event, itemId);
    } else {
      store.selection.setItemSelection({
        event,
        itemId,
        keepExistingSelection: isMultiSelectEnabled,
        shouldBeSelected: event.target.checked,
      });
    }
  };

  const toggleItemEditing = () => {
    // If the store doesn't support label editing, do nothing
    if (!store.labelEditing) {
      return;
    }

    if (isEditing) {
      store.labelEditing.setEditedItem(null);
    } else {
      store.labelEditing.setEditedItem(itemId);
    }
  };

  const handleSaveItemLabel = (
    event: React.SyntheticEvent & TreeViewCancellableEvent,
    newLabel: string,
  ) => {
    // If the store doesn't support label editing, do nothing
    if (!store.labelEditing) {
      return;
    }

    // As a side effect of `instance.focusItem` called here and in `handleCancelItemLabelEditing` the `labelInput` is blurred
    // The `onBlur` event is triggered, which calls `handleSaveItemLabel` again.
    // To avoid creating an unwanted behavior we need to check if the item is being edited before calling `updateItemLabel`
    if (labelSelectors.isItemBeingEdited(store.state, itemId)) {
      store.labelEditing.updateItemLabel(itemId, newLabel);
      toggleItemEditing();
      store.focus.focusItem(event, itemId);
    }
  };

  const handleCancelItemLabelEditing = (event: React.SyntheticEvent) => {
    // If the store doesn't support label editing, do nothing
    if (!store.labelEditing) {
      return;
    }

    if (labelSelectors.isItemBeingEdited(store.state, itemId)) {
      toggleItemEditing();
      store.focus.focusItem(event, itemId);
    }
  };

  const interactions: UseTreeItemInteractions = {
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    toggleItemEditing,
    handleSaveItemLabel,
    handleCancelItemLabelEditing,
  };

  return { interactions, status, publicAPI };
};
