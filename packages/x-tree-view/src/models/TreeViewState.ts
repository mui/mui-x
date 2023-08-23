import type { UseTreeViewSelectionState } from '../useTreeView/useTreeViewSelection';
import type { UseTreeViewFocusState } from '../useTreeView/useTreeViewFocus';
import type { UseTreeViewExpansionState } from '../useTreeView/useTreeViewExpansion';

export interface TreeViewState
  extends UseTreeViewSelectionState,
    UseTreeViewFocusState,
    UseTreeViewExpansionState {}
