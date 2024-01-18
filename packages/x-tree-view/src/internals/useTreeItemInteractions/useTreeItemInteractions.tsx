import * as React from 'react';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../plugins';
import { UseTreeItemStatus } from '../useTreeItem';

export const useTreeItemInteractions = (nodeId: string, status: UseTreeItemStatus) => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const handleExpansion = (event: React.MouseEvent<HTMLDivElement>) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused) {
      instance.focusNode(event, nodeId);
    }

    const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

    // If already expanded and trying to toggle selection don't close
    if (status.expandable && !(multiple && instance.isNodeExpanded(nodeId))) {
      instance.toggleNodeExpansion(event, nodeId);
    }
  };

  const handleSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (status.disabled) {
      return;
    }

    if (!status.focused) {
      instance.focusNode(event, nodeId);
    }

    const multiple = multiSelect && (event.shiftKey || event.ctrlKey || event.metaKey);

    if (multiple) {
      if (event.shiftKey) {
        instance.selectRange(event, { end: nodeId });
      } else {
        instance.selectNode(event, nodeId, true);
      }
    } else {
      instance.selectNode(event, nodeId);
    }
  };

  const preventSelection = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  return { handleExpansion, handleSelection, preventSelection };
};
