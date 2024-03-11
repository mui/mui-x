import * as React from 'react';
import { useTreeViewContext } from '../../internals/TreeViewProvider/useTreeViewContext';
import { DefaultTreeViewPlugins } from '../../internals/plugins';
import type { UseTreeItem2Status } from '../../useTreeItem2';

interface UseTreeItem2Interactions {
  handleExpansion: (event: React.MouseEvent) => void;
  handleSelection: (event: React.MouseEvent) => void;
}

interface UseTreeItem2UtilsReturnValue {
  interactions: UseTreeItem2Interactions;
  status: UseTreeItem2Status;
}

export const useTreeItem2Utils = ({
  nodeId,
  children,
}: {
  nodeId: string;
  children: React.ReactNode;
}): UseTreeItem2UtilsReturnValue => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const status: UseTreeItem2Status = {
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

  const interactions: UseTreeItem2Interactions = { handleExpansion, handleSelection };

  return { interactions, status };
};
