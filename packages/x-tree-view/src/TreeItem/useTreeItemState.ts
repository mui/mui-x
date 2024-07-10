import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { UseTreeViewSelectionSignature } from '../internals/plugins/useTreeViewSelection';
import { UseTreeViewExpansionSignature } from '../internals/plugins/useTreeViewExpansion';
import { UseTreeViewFocusSignature } from '../internals/plugins/useTreeViewFocus';
import { UseTreeViewItemsSignature } from '../internals/plugins/useTreeViewItems';

type UseTreeItemStateMinimalPlugins = readonly [
  UseTreeViewSelectionSignature,
  UseTreeViewExpansionSignature,
  UseTreeViewFocusSignature,
  UseTreeViewItemsSignature,
];

type UseTreeItemStateOptionalPlugins = readonly [];

export function useTreeItemState(itemId: string) {
  const {
    instance,
    selection: { multiSelect, checkboxSelection, disableSelection },
    expansion: { expansionTrigger },
  } = useTreeViewContext<UseTreeItemStateMinimalPlugins, UseTreeItemStateOptionalPlugins>();

  const expandable = instance.isItemExpandable(itemId);
  const expanded = instance.isItemExpanded(itemId);
  const focused = instance.isItemFocused(itemId);
  const selected = instance.isItemSelected(itemId);
  const disabled = instance.isItemDisabled(itemId);

  const handleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (!focused) {
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
    if (!disabled) {
      if (!focused) {
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
    if (disableSelection || disabled) {
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
    if (event.shiftKey || event.ctrlKey || event.metaKey || disabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  return {
    disabled,
    expanded,
    selected,
    focused,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    handleCheckboxSelection,
    preventSelection,
    expansionTrigger,
  };
}
