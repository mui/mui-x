'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewCancellableEvent } from '../../models';
import { useTreeViewContext } from '../../internals/TreeViewProvider';
import { useTreeViewLabel } from '../../internals/plugins/useTreeViewLabel';
import type { UseTreeItemStatus } from '../../useTreeItem';
import { hasPlugin } from '../../internals/utils/plugins';
import { TreeViewPublicAPI, TreeViewStore } from '../../internals/models';
import { expansionSelectors } from '../../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import { focusSelectors } from '../../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors';
import { itemsSelectors } from '../../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { selectionSelectors } from '../../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors';
import { lazyLoadingSelectors } from '../../internals/plugins/useTreeViewLazyLoading/useTreeViewLazyLoading.selectors';
import { labelSelectors } from '../../internals/plugins/useTreeViewLabel/useTreeViewLabel.selectors';
import { MinimalTreeViewStore } from '../../internals/MinimalTreeViewStore';

export interface UseTreeItemInteractions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleItemEditing: () => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
}

interface UseTreeItemUtilsReturnValue<TStore extends TreeViewStore<any, any>> {
  interactions: UseTreeItemInteractions;
  status: UseTreeItemStatus;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TStore>;
}

export const itemHasChildren = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(itemHasChildren);
  }
  return Boolean(reactChildren);
};

export const useTreeItemUtils = <
  TStore extends TreeViewStore<any, any> = MinimalTreeViewStore<any, any, any, any>,
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
      store.focusItem(event, itemId);
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
      store.setItemExpansion({ event, itemId });
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused && !status.editing) {
      store.focusItem(event, itemId);
    }

    const multiple =
      selectionSelectors.isMultiSelectEnabled(store.state) &&
      (event.shiftKey || event.ctrlKey || event.metaKey);

    if (multiple) {
      if (event.shiftKey) {
        store.expandSelectionRange(event, itemId);
      } else {
        store.setItemSelection({ event, itemId, keepExistingSelection: true });
      }
    } else {
      store.setItemSelection({ event, itemId, shouldBeSelected: true });
    }
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasShift = (event.nativeEvent as PointerEvent).shiftKey;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(store.state);
    if (isMultiSelectEnabled && hasShift) {
      store.expandSelectionRange(event, itemId);
    } else {
      store.setItemSelection({
        event,
        itemId,
        keepExistingSelection: isMultiSelectEnabled,
        shouldBeSelected: event.target.checked,
      });
    }
  };

  const toggleItemEditing = () => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    if (isEditing) {
      instance.setEditedItem(null);
    } else {
      instance.setEditedItem(itemId);
    }
  };

  const handleSaveItemLabel = (
    event: React.SyntheticEvent & TreeViewCancellableEvent,
    newLabel: string,
  ) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    // As a side effect of `instance.focusItem` called here and in `handleCancelItemLabelEditing` the `labelInput` is blurred
    // The `onBlur` event is triggered, which calls `handleSaveItemLabel` again.
    // To avoid creating an unwanted behavior we need to check if the item is being edited before calling `updateItemLabel`
    if (labelSelectors.isItemBeingEdited(store.state, itemId)) {
      instance.updateItemLabel(itemId, newLabel);
      toggleItemEditing();
      store.focusItem(event, itemId);
    }
  };

  const handleCancelItemLabelEditing = (event: React.SyntheticEvent) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    if (labelSelectors.isItemBeingEdited(store.state, itemId)) {
      toggleItemEditing();
      store.focusItem(event, itemId);
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
