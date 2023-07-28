import * as React from 'react';
import { TreeViewContext } from '../TreeView/TreeViewContext';

export function useTreeItem(nodeId: string) {
  const {
    focus,
    isExpanded,
    isExpandable,
    isFocused,
    isDisabled,
    isSelected,
    multiSelect,
    selectNode,
    selectRange,
    toggleExpansion,
  } = React.useContext(TreeViewContext);

  const expandable = isExpandable ? isExpandable(nodeId) : false;
  const expanded = isExpanded ? isExpanded(nodeId) : false;
  const focused = isFocused ? isFocused(nodeId) : false;
  const disabled = isDisabled ? isDisabled(nodeId) : false;
  const selected = isSelected ? isSelected(nodeId) : false;

  const handleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (!focused) {
        focus(event, nodeId);
      }

      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

      // If already expanded and trying to toggle selection don't close
      if (expandable && !(multiple && isExpanded(nodeId))) {
        toggleExpansion(event, nodeId);
      }
    }
  };

  const handleSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      if (!focused) {
        focus(event, nodeId);
      }

      const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

      if (multiple) {
        if (event.shiftKey) {
          selectRange(event, { end: nodeId });
        } else {
          selectNode(event, nodeId, true);
        }
      } else {
        selectNode(event, nodeId);
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
    disabled,
    expanded,
    selected,
    focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  };
}
