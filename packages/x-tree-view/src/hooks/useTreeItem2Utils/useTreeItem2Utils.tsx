import * as React from 'react';
import { TreeViewCancellableEvent } from '../../models';
import { useTreeViewContext } from '../../internals/TreeViewProvider';
import { UseTreeViewSelectionSignature } from '../../internals/plugins/useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../../internals/plugins/useTreeViewExpansion';
import { UseTreeViewItemsSignature } from '../../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../../internals/plugins/useTreeViewFocus';
import {
  UseTreeViewLabelSignature,
  useTreeViewLabel,
} from '../../internals/plugins/useTreeViewLabel';
import type { UseTreeItem2Status } from '../../useTreeItem2';
import { hasPlugin } from '../../internals/utils/plugins';
import { TreeViewPublicAPI } from '../../internals/models';
import { useSelector } from '../../internals/hooks/useSelector';
import { selectorIsItemExpanded } from '../../internals/plugins/useTreeViewExpansion/useTreeViewExpansion.selectors';
import { selectorIsItemFocused } from '../../internals/plugins/useTreeViewFocus/useTreeViewFocus.selectors';
import { selectorIsItemDisabled } from '../../internals/plugins/useTreeViewItems/useTreeViewItems.selectors';
import { selectorIsItemSelected } from '../../internals/plugins/useTreeViewSelection/useTreeViewSelection.selectors';
import {
  selectorIsItemBeingEdited,
  selectorIsItemEditable,
} from '../../internals/plugins/useTreeViewLabel/useTreeViewLabel.selectors';

export interface UseTreeItem2Interactions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleItemEditing: () => void;
  handleSaveItemLabel: (event: React.SyntheticEvent, label: string) => void;
  handleCancelItemLabelEditing: (event: React.SyntheticEvent) => void;
}

/**
 * Plugins that need to be present in the Tree View in order for `useTreeItem2Utils` to work correctly.
 */
type UseTreeItem2UtilsMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
];

/**
 * Plugins that `useTreeItem2Utils` can use if they are present, but are not required.
 */

export type UseTreeItem2UtilsOptionalPlugins = readonly [UseTreeViewLabelSignature];

interface UseTreeItem2UtilsReturnValue<
  TSignatures extends UseTreeItem2UtilsMinimalPlugins,
  TOptionalSignatures extends UseTreeItem2UtilsOptionalPlugins,
> {
  interactions: UseTreeItem2Interactions;
  status: UseTreeItem2Status;
  /**
   * The object the allows Tree View manipulation.
   */
  publicAPI: TreeViewPublicAPI<TSignatures, TOptionalSignatures>;
}

const isItemExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isItemExpandable);
  }
  return Boolean(reactChildren);
};

export const useTreeItem2Utils = <
  TSignatures extends UseTreeItem2UtilsMinimalPlugins = UseTreeItem2UtilsMinimalPlugins,
  TOptionalSignatures extends UseTreeItem2UtilsOptionalPlugins = UseTreeItem2UtilsOptionalPlugins,
>({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}): UseTreeItem2UtilsReturnValue<TSignatures, TOptionalSignatures> => {
  const {
    instance,
    label,
    store,
    selection: { multiSelect },
    publicAPI,
  } = useTreeViewContext<TSignatures, TOptionalSignatures>();

  const isExpanded = useSelector(store, selectorIsItemExpanded, itemId);
  const isFocused = useSelector(store, selectorIsItemFocused, itemId);
  const isSelected = useSelector(store, selectorIsItemSelected, itemId);
  const isDisabled = useSelector(store, selectorIsItemDisabled, itemId);
  const isEditing = useSelector(store, (state) =>
    label == null ? false : selectorIsItemBeingEdited(state, itemId),
  );
  const isEditable = useSelector(store, (state) =>
    label == null
      ? false
      : selectorIsItemEditable(state, { itemId, isItemEditable: label.isItemEditable }),
  );

  const status: UseTreeItem2Status = {
    expandable: isItemExpandable(children),
    expanded: isExpanded,
    focused: isFocused,
    selected: isSelected,
    disabled: isDisabled,
    editing: isEditing,
    editable: isEditable,
  };

  const handleExpansion = (event: React.MouseEvent) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused) {
      instance.focusItem(event, itemId);
    }

    const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

    // If already expanded and trying to toggle selection don't close
    if (status.expandable && !(multiple && selectorIsItemExpanded(store.value, itemId))) {
      instance.toggleItemExpansion(event, itemId);
    }
  };

  const handleSelection = (event: React.MouseEvent) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused) {
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
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const toggleItemEditing = () => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }
    if (isEditable) {
      if (isEditing) {
        instance.setEditedItemId(null);
      } else {
        instance.setEditedItemId(itemId);
      }
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
    // using `instance.isItemBeingEditedRef` instead of `instance.isItemBeingEdited` since the state is not yet updated in this point
    if (selectorIsItemBeingEdited(store.value, itemId)) {
      instance.updateItemLabel(itemId, newLabel);
      toggleItemEditing();
      instance.focusItem(event, itemId);
    }
  };

  const handleCancelItemLabelEditing = (event: React.SyntheticEvent) => {
    if (!hasPlugin(instance, useTreeViewLabel)) {
      return;
    }

    if (selectorIsItemBeingEdited(store.value, itemId)) {
      toggleItemEditing();
      instance.focusItem(event, itemId);
    }
  };

  const interactions: UseTreeItem2Interactions = {
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    toggleItemEditing,
    handleSaveItemLabel,
    handleCancelItemLabelEditing,
  };

  return { interactions, status, publicAPI };
};
