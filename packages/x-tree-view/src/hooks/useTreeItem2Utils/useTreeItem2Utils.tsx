import * as React from 'react';
import { useTreeViewContext } from '../../internals/TreeViewProvider/useTreeViewContext';
import { UseTreeViewSelectionSignature } from '../../internals/plugins/useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../../internals/plugins/useTreeViewExpansion';
import { UseTreeViewItemsSignature } from '../../internals/plugins/useTreeViewItems';
import { UseTreeViewFocusSignature } from '../../internals/plugins/useTreeViewFocus';
import type { UseTreeItem2Status } from '../../useTreeItem2';

interface UseTreeItem2Interactions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
  handleCheckboxSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseTreeItem2UtilsReturnValue {
  interactions: UseTreeItem2Interactions;
  status: UseTreeItem2Status;
}

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
];

export const useTreeItem2Utils = ({
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}): UseTreeItem2UtilsReturnValue => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<UseTreeItem2UtilsMinimalPlugins>();

  const status: UseTreeItem2Status = {
    expandable: isItemExpandable(children),
    expanded: instance.isItemExpanded(itemId),
    focused: instance.isItemFocused(itemId),
    selected: instance.isItemSelected(itemId),
    disabled: instance.isItemDisabled(itemId),
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
    if (status.expandable && !(multiple && instance.isItemExpanded(itemId))) {
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

  const interactions: UseTreeItem2Interactions = {
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
  };

  return { interactions, status };
};
