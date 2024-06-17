import * as React from 'react';
import { useTreeViewContext } from '../../internals/TreeViewProvider/useTreeViewContext';
import { UseTreeViewSelectionSignature } from '../../internals/plugins/useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../../internals/plugins/useTreeViewExpansion';
import { UseTreeViewItemsSignature } from '../../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../../internals/plugins/useTreeViewFocus';
import { UseTreeViewLabelSignature } from '../../internals/plugins/useTreeViewLabel';
import type { UseTreeItem2Status } from '../../useTreeItem2';

interface UseTreeItem2Interactions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  toggleItemEditing: () => void;
  setLabelInputValue: (label: string) => void;
  resetLabelInputValue: () => void;
}

interface UseTreeItem2UtilsReturnValue {
  interactions: UseTreeItem2Interactions;
  status: UseTreeItem2Status;
  label: string;
}

const useTreeItemLabelInput = (inLabel: string) => {
  const initialLabelValue = React.useRef(inLabel);
  const [labelInputValue, setLabelInputValue] = React.useState(inLabel);

  const resetLabelInputValue = () => {
    setLabelInputValue(initialLabelValue.current);
  };

  React.useEffect(() => {
    initialLabelValue.current = inLabel;
    setLabelInputValue(inLabel);
  }, [inLabel]);

  return {
    labelInputValue,
    setLabelInputValue,
    resetLabelInputValue,
  };
};

const isItemExpandable = (reactChildren: React.ReactNode) => {
  if (Array.isArray(reactChildren)) {
    return reactChildren.length > 0 && reactChildren.some(isItemExpandable);
  }
  return Boolean(reactChildren);
};

type UseTreeItem2UtilsMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewItemsSignature,
  UseTreeViewFocusSignature,
  UseTreeViewLabelSignature,
];

export const useTreeItem2Utils = ({
  itemId,
  children,
  label,
}: {
  itemId: string;
  children: React.ReactNode;
  label: string;
}): UseTreeItem2UtilsReturnValue => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<UseTreeItem2UtilsMinimalPlugins>();

  const { labelInputValue, setLabelInputValue, resetLabelInputValue } = useTreeItemLabelInput(
    label as string,
  );

  const status: UseTreeItem2Status = {
    expandable: isItemExpandable(children),
    expanded: instance.isItemExpanded(itemId),
    focused: instance.isItemFocused(itemId),
    selected: instance.isItemSelected(itemId),
    disabled: instance.isItemDisabled(itemId),
    editing: instance.isItemBeingEdited(itemId),
    editable: instance.isItemEditable(itemId),
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
    if (
      status.expandable &&
      !(multiple && instance.isItemExpanded(itemId)) &&
      !instance.isItemBeingEdited(itemId)
    ) {
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
        instance.selectItem(event, itemId, true);
      }
    } else {
      instance.selectItem(event, itemId, false);
    }
  };

  const handleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hasShift = (event.nativeEvent as PointerEvent).shiftKey;
    if (multiSelect && hasShift) {
      instance.expandSelectionRange(event, itemId);
    } else {
      instance.selectItem(event, itemId, multiSelect, event.target.checked);
    }
  };

  const toggleItemEditing = () => {
    if (instance.isItemEditable(itemId)) {
      if (instance.isItemBeingEdited(itemId)) {
        instance.setEditedItemId(null);
      } else {
        instance.setEditedItemId(itemId);
      }
    }
  };

  const interactions: UseTreeItem2Interactions = {
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    toggleItemEditing,
    setLabelInputValue,
    resetLabelInputValue,
  };

  return { interactions, status, label: labelInputValue };
};
