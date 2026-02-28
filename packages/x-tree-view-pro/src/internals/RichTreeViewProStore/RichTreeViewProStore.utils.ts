import {
  ExtendableRichTreeViewStore,
  TreeViewParametersToStateMapper,
} from '@mui/x-tree-view/internals';
import { RichTreeViewProStoreParameters, RichTreeViewProState } from './RichTreeViewProStore.types';
import { TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE } from '../plugins/lazyLoading';

const DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED = () => true;
const DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED = () => false;
const DEFAULT_ITEM_HEIGHT_WITH_VIRTUALIZATION = 32;

const deriveStateFromParameters = (parameters: RichTreeViewProStoreParameters<any, any>) => ({
  lazyLoadedItems: parameters.dataSource ? TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE : null,
  currentReorder: null,
  isItemReorderable: parameters.itemsReordering
    ? (parameters.isItemReorderable ?? DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED)
    : DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED,
  domStructure: parameters.domStructure ?? (parameters.virtualization ? 'flat' : 'nested'),
  virtualization: parameters.virtualization ?? false,
  itemHeight:
    parameters.itemHeight ??
    (parameters.virtualization ? DEFAULT_ITEM_HEIGHT_WITH_VIRTUALIZATION : null),
});

export const parametersToStateMapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewProState<any, any>,
  RichTreeViewProStoreParameters<any, any>
> = {
  getInitialState: (minimalInitialState, parameters) => ({
    ...ExtendableRichTreeViewStore.rawMapper.getInitialState(minimalInitialState, parameters),
    ...deriveStateFromParameters(parameters),
  }),
  updateStateFromParameters: (newMinimalState, parameters, updateModel) => {
    const newState: Partial<RichTreeViewProState<any, any>> = {
      ...ExtendableRichTreeViewStore.rawMapper.updateStateFromParameters(
        newMinimalState,
        parameters,
        updateModel,
      ),
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: (parameters) => !!parameters.dataSource,
};
