import type { UseTreeViewSelectionState } from '../useTreeView/useTreeViewSelection';
import type { UseTreeViewFocusState } from '../useTreeView/useTreeViewFocus';

export interface TreeViewState extends UseTreeViewSelectionState, UseTreeViewFocusState {
  focusedNodeId: string | null;
}
