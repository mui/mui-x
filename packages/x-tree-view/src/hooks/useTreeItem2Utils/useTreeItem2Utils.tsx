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
  itemId,
  children,
}: {
  itemId: string;
  children: React.ReactNode;
}): UseTreeItem2UtilsReturnValue => {
  const {
    instance,
    selection: { multiSelect },
  } = useTreeViewContext<DefaultTreeViewPlugins>();

  const status: UseTreeItem2Status = {
    expandable: Boolean(Array.isArray(children) ? children.length : children),
    expanded: instance.isNodeExpanded(itemId),
    focused: instance.isNodeFocused(itemId),
    selected: instance.isNodeSelected(itemId),
    disabled: instance.isNodeDisabled(itemId),
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
    if (status.expandable && !(multiple && instance.isNodeExpanded(itemId))) {
      instance.toggleNodeExpansion(event, itemId);
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
        instance.selectRange(event, { end: itemId });
      } else {
        instance.selectNode(event, itemId, true);
      }
    } else {
      instance.selectNode(event, itemId);
    }
  };

  const interactions: UseTreeItem2Interactions = { handleExpansion, handleSelection };

  return { interactions, status };
};
