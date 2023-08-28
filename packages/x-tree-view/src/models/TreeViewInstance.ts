import type { UseTreeViewFocusInstance } from '../internals/useTreeView/useTreeViewFocus';
import type { UseTreeViewExpansionInstance } from '../internals/useTreeView/useTreeViewExpansion';
import type { UseTreeViewNodesInstance } from '../internals/useTreeView/useTreeViewNodes';
import type { UseTreeViewSelectionInstance } from '../internals/useTreeView/useTreeViewSelection';
import type { UseTreeViewKeyboardNavigationInstance } from '../internals/useTreeView/useTreeViewKeyboardNavigation';

export interface TreeViewInstance
  extends UseTreeViewNodesInstance,
    UseTreeViewFocusInstance,
    UseTreeViewExpansionInstance,
    UseTreeViewSelectionInstance,
    UseTreeViewKeyboardNavigationInstance {}
