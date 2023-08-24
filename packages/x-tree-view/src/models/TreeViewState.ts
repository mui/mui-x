import type { UseTreeViewFocusState } from '../useTreeView/useTreeViewFocus';

export interface TreeViewState extends UseTreeViewFocusState {
  /**
   * @private
   */
  $$modelsIfNotControlled: { [modelName: string]: any };
}
