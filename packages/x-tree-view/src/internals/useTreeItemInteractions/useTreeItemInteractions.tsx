import * as React from 'react';
import { useTreeViewContext } from '../TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../plugins';
import type { UseTreeItemStatus } from '../useTreeItem';

export const useTreeItemInteractions = ({
  nodeId,
  children,
}: {
  nodeId: string;
  children: React.ReactNode;
}) => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const status: UseTreeItemStatus = {
    expandable: Boolean(Array.isArray(children) ? children.length : children),
    expanded: instance.isNodeExpanded(nodeId),
    focused: instance.isNodeFocused(nodeId),
    selected: instance.isNodeSelected(nodeId),
    disabled: instance.isNodeDisabled(nodeId),
  };

  const handleExpansion = (event: React.MouseEvent) => {
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

  const handleSelection = (event: React.MouseEvent) => {
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

  const preventSelection = (event: React.MouseEvent) => {
    if (event.shiftKey || event.ctrlKey || event.metaKey || status.disabled) {
      // Prevent text selection
      event.preventDefault();
    }
  };

  const interactions = { handleExpansion, handleSelection, preventSelection };

  return { interactions, status };
};
