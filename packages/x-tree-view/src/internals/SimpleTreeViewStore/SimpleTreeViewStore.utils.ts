import { TreeViewParametersToStateMapper } from '../MinimalTreeViewStore';
import { InnerSimpleTreeViewParameters, SimpleTreeViewState } from './SimpleTreeViewStore.types';

export const parametersToStateMapper: TreeViewParametersToStateMapper<
  any,
  any,
  SimpleTreeViewState<any>,
  InnerSimpleTreeViewParameters<any>
> = {
  getInitialState: (minimalInitialState) => minimalInitialState,
  updateStateFromParameters: (newMinimalState) => newMinimalState,
  shouldIgnoreItemsStateUpdate: () => true,
};
