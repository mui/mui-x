import * as React from 'react';
import { useTreeViewContext } from '../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../internals/plugins';

export function useTreeItemState(itemId: string) {
  const {
    instance,
    selection: { multiSelect, checkboxSelection, disableSelection },
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const expandable = instance.isNodeExpandable(itemId);
  const expanded = instance.isNodeExpanded(itemId);
  const focused = instance.isNodeFocused(itemId);
  const selected = instance.isNodeSelected(itemId);
  const disabled = instance.isNodeDisabled(itemId);

  const handleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (!focused) {
        instance.focusItem(event, itemId);
      }

      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

      // If already expanded and trying to toggle selection don't close
      if (expandable && !(multiple && instance.isNodeExpanded(itemId))) {
        instance.toggleNodeExpansion(event, itemId);
      }
    }
  };

  const handleSelection = (event: React.ChangeEvent | React.MouseEvent) => {
    if (!disabled) {
      if (!focused) {
        instance.focusItem(event, itemId);
      }

      const nativeEvent = (event.type === 'change'
        ? event.nativeEvent
        : event) as unknown as React.MouseEvent;

      const multiple =
        multiSelect && (nativeEvent.shiftKey || nativeEvent.ctrlKey || nativeEvent.metaKey);

      if (multiple) {
        if (nativeEvent.shiftKey) {
          instance.selectRange(event, { end: itemId });
        } else {
          instance.selectNode(event, itemId, true);
        }
      } else {
        instance.selectNode(event, itemId);
      }
    }
  };

  const preventSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || disabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  return {
    expandable,
    disabled,
    expanded,
    selected,
    focused,
    disableSelection,
    checkboxSelection,
    handleExpansion,
    handleSelection,
    preventSelection,
  };
}
