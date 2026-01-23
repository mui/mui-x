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
  getInitialState: (minimalInitialState, parameters) => ({
    ...minimalInitialState,
    ...deriveStateFromParameters(parameters),
    editedItemId: null,
    lazyLoadedItems: null,
    domStructure: parameters.domStructure ?? 'nested',
  }),
  updateStateFromParameters: (newMinimalState, parameters) => {
    const newState: Partial<RichTreeViewState<any, any>> = {
      ...newMinimalState,
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: () => false,
};
