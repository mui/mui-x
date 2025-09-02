'use client';
import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { TreeViewCancellableEvent } from '../../models';
import { useTreeViewContext } from '../../internals/TreeViewProvider';
import type { UseTreeViewLazyLoadingSignature } from '../../internals/plugins/useTreeViewLazyLoading';
import type { UseTreeViewSelectionSignature } from '../../internals/plugins/useTreeViewSelection';
import type { UseTreeViewExpansionSignature } from '../../internals/plugins/useTreeViewExpansion';
import type { UseTreeViewItemsSignature } from '../../internals/plugins/useTreeViewItems';
import type { UseTreeViewFocusSignature } from '../../internals/plugins/useTreeViewFocus';
import {
  UseTreeViewLabelSignature,
  useTreeViewLabel,
} from '../../internals/plugins/useTreeViewLabel';
import type { UseTreeItemStatus } from '../../useTreeItem';
import { hasPlugin } from '../../internals/utils/plugins';
import { TreeViewPublicAPI } from '../../internals/models';
import { expansionSelectors } from '../../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import { focusSelectors } from '../../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors';
import { itemsSelectors } from '../../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { selectionSelectors } from '../../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors';
import { lazyLoadingSelectors } from '../../internals/plugins/useTreeViewLazyLoading/useTreeViewLazyLoading.selectors';
import { labelSelectors } from '../../internals/plugins/useTreeViewLabel/useTreeViewLabel.selectors';

export interface UseTreeItemInteractions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleItemEditing: () => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
}

/**
 * Plugins that need to be present in the Tree View in order for `useTreeItemUtils` to work correctly.
 */
type UseTreeItemUtilsMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
];

/**
 * Plugins that `useTreeItemUtils` can use if they are present, but are not required.
 */

export type UseTreeItemUtilsOptionalPlugins = readonly [
  UseTreeViewLabelSignature,
  UseTreeViewLazyLoadingSignature,
];

interface UseTreeItemUtilsReturnValue<
  TSignatures extends UseTreeItemUtilsMinimalPlugins,
  TOptionalSignatures extends UseTreeItemUtilsOptionalPlugins,
> {
  interactions: UseTreeItemInteractions;
  status: UseTreeItemStatus;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
}

export const itemHasChildren = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(itemHasChildren);
  }
  return Boolean(reactChildren);
};

export const useTreeItemUtils = <
  TSignatures extends UseTreeItemUtilsMinimalPlugins = UseTreeItemUtilsMinimalPlugins,
  TOptionalSignatures extends UseTreeItemUtilsOptionalPlugins = UseTreeItemUtilsOptionalPlugins,
>({
  itemId,
  children,
}: {
  itemId: string;
  children?: React.ReactNode;
}): UseTreeItemUtilsReturnValue<TSignatures, TOptionalSignatures> => {
  const { instance, store, publicAPI } = useTreeViewContext<TSignatures, TOptionalSignatures>();

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
      instance.focusItem(event, itemId);
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
      instance.setItemExpansion({ event, itemId });
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused && !status.editing) {
      instance.focusItem(event, itemId);
    }

    const multiple =
      selectionSelectors.isMultiSelectEnabled(store.state) &&
      (event.shiftKey || event.ctrlKey || event.metaKey);

    if (multiple) {
      if (event.shiftKey) {
        instance.expandSelectionRange(event, itemId);
      } else {
        instance.setItemSelection({ event, itemId, keepExistingSelection: true });
      }
    } else {
      instance.setItemSelection({ event, itemId, shouldBeSelected: true });
    }
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasShift = (event.nativeEvent as PointerEvent).shiftKey;
    const isMultiSelectEnabled = selectionSelectors.isMultiSelectEnabled(store.state);
    if (isMultiSelectEnabled && hasShift) {
      instance.expandSelectionRange(event, itemId);
    } else {
      instance.setItemSelection({
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
      instance.focusItem(event, itemId);
    }
  };

  const handleCancelItemLabelEditing = (event: React.SyntheticEvent) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    if (labelSelectors.isItemBeingEdited(store.state, itemId)) {
      toggleItemEditing();
      instance.focusItem(event, itemId);
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
