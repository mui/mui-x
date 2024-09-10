import * as React from 'react';
import { MuiCancellableEvent } from '../internals/models/MuiCancellableEvent';
import { useTreeViewContext } from '../internals/TreeViewProvider';
import { UseTreeViewSelectionSignature } from '../internals/plugins/useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../internals/plugins/useTreeViewExpansion';
import { UseTreeViewFocusSignature } from '../internals/plugins/useTreeViewFocus';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';
import { UseTreeViewLabelSignature, useTreeViewLabel } from '../internals/plugins/useTreeViewLabel';
import { hasPlugin } from '../internals/utils/plugins';
import { useSelector } from '../internals/hooks/useSelector';
import { selectorIsItemExpanded } from '../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import { selectorIsItemFocused } from '../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors';
import { selectorIsItemDisabled } from '../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { selectorIsItemSelected } from '../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors';

type UseTreeItemStateMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewFocusSignature,
  UseTreeViewItemsSignature,
];

type UseTreeItemStateOptionalPlugins = readonly [UseTreeViewLabelSignature];

export function useTreeItemState(itemId: string) {
  const {
    instance,
    store,
    items: { onItemClick },
    selection: { multiSelect, checkboxSelection, disableSelection },
    expansion: { expansionTrigger },
  } = useTreeViewContext<UseTreeItemStateMinimalPlugins, UseTreeItemStateOptionalPlugins>();

  const isExpanded = useSelector(store, selectorIsItemExpanded, itemId);
  const isFocused = useSelector(store, selectorIsItemFocused, itemId);
  const isSelected = useSelector(store, selectorIsItemSelected, itemId);
  const isDisabled = useSelector(store, selectorIsItemDisabled, itemId);

  const expandable = instance.isItemExpandable(itemId);
  const editing = instance?.isItemBeingEdited ? instance?.isItemBeingEdited(itemId) : false;
  const editable = instance.isItemEditable ? instance.isItemEditable(itemId) : false;

  const handleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isDisabled) {
      if (!isFocused) {
        instance.focusItem(event, itemId);
      }

      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

      // If already expanded and trying to toggle selection don't close
      if (expandable && !(multiple && instance.isItemExpanded(itemId))) {
        instance.toggleItemExpansion(event, itemId);
      }
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (!isDisabled) {
      if (!isFocused) {
        instance.focusItem(event, itemId);
      }

      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);
      if (multiple) {
        if (event.shiftKey) {
          instance.expandSelectionRange(event, itemId);
        } else {
          instance.selectItem({ event, itemId, keepExistingSelection: true });
        }
      } else {
        instance.selectItem({ event, itemId, shouldBeSelected: true });
      }
    }
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disableSelection || isDisabled) {
      return;
    }

    const hasShift = (event.nativeEvent as PointerEvent).shiftKey;
    if (multiSelect && hasShift) {
      instance.expandSelectionRange(event, itemId);
    } else {
      instance.selectItem({
        event,
        itemId,
        keepExistingSelection: multiSelect,
        shouldBeSelected: event.target.checked,
      });
    }
  };

  const preventSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || isDisabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  const toggleItemEditing = () => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }
    if (instance.isItemEditable(itemId)) {
      if (instance.isItemBeingEdited(itemId)) {
        instance.setEditedItemId(null);
      } else {
        instance.setEditedItemId(itemId);
      }
    }
  };

  const handleSaveItemLabel = (
    event: React.SyntheticEvent & MuiCancellableEvent,
    label: string,
  ) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    // As a side effect of `instance.focusItem` called here and in `handleCancelItemLabelEditing` the `labelInput` is blurred
    // The `onBlur` event is triggered, which calls `handleSaveItemLabel` again.
    // To avoid creating an unwanted behavior we need to check if the item is being edited before calling `updateItemLabel`
    // using `instance.isItemBeingEditedRef` instead of `instance.isItemBeingEdited` since the state is not yet updated in this point
    if (instance.isItemBeingEditedRef(itemId)) {
      instance.updateItemLabel(itemId, label);
      toggleItemEditing();
      instance.focusItem(event, itemId);
    }
  };

  const handleCancelItemLabelEditing = (event: React.SyntheticEvent) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    if (instance.isItemBeingEditedRef(itemId)) {
      toggleItemEditing();
      instance.focusItem(event, itemId);
    }
  };

  return {
    disabled: isDisabled,
    expanded: isExpanded,
    selected: isSelected,
    focused: isFocused,
    editable,
    editing,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    handleContentClick: onItemClick,
    preventSelection,
    expansionTrigger,
    toggleItemEditing,
    handleSaveItemLabel,
    handleCancelItemLabelEditing,
  };
}
