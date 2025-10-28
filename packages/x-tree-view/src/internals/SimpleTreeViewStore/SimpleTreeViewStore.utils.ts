import { TreeViewParametersToStateMapper } from '../MinimalTreeViewStore';
import { InnerSimpleTreeViewParameters, SimpleTreeViewState } from './SimpleTreeViewStore.types';

export const parametersToStateMapper: TreeViewParametersToStateMapper<
  any,
  any,
  SimpleTreeViewState<any>,
  InnerSimpleTreeViewParameters<any>
> = {
  getInitialState: (schedulerInitialState) => ({
    ...schedulerInitialState,
  }),
  updateStateFromParameters: (newSharedState) => {
    const newState: Partial<SimpleTreeViewState<any>> = {
      ...newSharedState,
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: () => true,
};
