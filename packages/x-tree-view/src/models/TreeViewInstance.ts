import type { TreeViewNode } from '../TreeView/TreeView.types';
import type { UseTreeViewFocusInstance } from '../useTreeView/useTreeViewFocus';
import type { UseTreeViewExpansionInstance } from '../useTreeView/useTreeViewExpansion';
import type { UseTreeViewNodesInstance } from '../useTreeView/useTreeViewNodes';
import type { UseTreeViewSelectionInstance } from '../useTreeView/useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationInstance } from '../useTreeView/useTreeViewKeyboardNavigation';

export interface TreeViewInstance
  extends UseTreeViewNodesInstance,
    UseTreeViewFocusInstance,
    UseTreeViewExpansionInstance,
    UseTreeViewSelectionInstance,
    UseTreeViewKeyboardNavigationInstance {
  nodeMap: { [nodeId: string]: TreeViewNode };
}
