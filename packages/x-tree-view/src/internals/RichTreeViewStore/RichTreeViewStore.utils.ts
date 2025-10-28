import { TreeViewParametersToStateMapper } from '../MinimalTreeViewStore';
import { RichTreeViewStoreParameters, RichTreeViewState } from './RichTreeViewStore.types';

const deriveStateFromParameters = (parameters: RichTreeViewStoreParameters<any, any>) => ({
  isItemEditable: parameters.isItemEditable ?? false,
});

export const parametersToStateMapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewState<any, any>,
  RichTreeViewStoreParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...schedulerInitialState,
    ...deriveStateFromParameters(parameters),
    editedItemId: null,
    lazyLoadedItems: null,
  }),
  updateStateFromParameters: (newSharedState, parameters) => {
    const newState: Partial<RichTreeViewState<any, any>> = {
      ...newSharedState,
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: () => false,
};
