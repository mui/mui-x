import {
  ExtendableRichTreeViewStore,
  TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE,
  TreeViewParametersToStateMapper,
} from '@mui/x-tree-view/internals';
import { TreeViewValidItem } from '@mui/x-tree-view/models';
import {
  RichTreeViewProParameters,
  RichTreeViewProPublicAPI,
  RichTreeViewProState,
} from './RichTreeViewProStore.types';
import { TreeViewLazyLoadingPlugin } from '../plugins/lazyLoading';
import { TreeViewItemsReorderingPlugin } from '../plugins/itemsReordering';

const DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED = () => true;
const DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED = () => false;

const deriveStateFromParameters = (parameters: RichTreeViewProParameters<any, any>) => ({
  lazyLoadedItems: parameters.dataSource ? TREE_VIEW_LAZY_LOADED_ITEMS_INITIAL_STATE : null,
  currentReorder: null,
  isItemReorderable: parameters.itemsReordering
    ? (parameters.isItemReorderable ?? DEFAULT_IS_ITEM_REORDERABLE_WHEN_ENABLED)
    : DEFAULT_IS_ITEM_REORDERABLE_WHEN_DISABLED,
});

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewProState<any, any>,
  RichTreeViewProParameters<any, any>
> = {
  getInitialState: (schedulerInitialState, parameters) => ({
    ...ExtendableRichTreeViewStore.rawMapper.getInitialState(schedulerInitialState, parameters),
    ...deriveStateFromParameters(parameters),
  }),
  updateStateFromParameters: (newSharedState, parameters, updateModel) => {
    const newState: Partial<RichTreeViewProState<any, any>> = {
      ...ExtendableRichTreeViewStore.rawMapper.updateStateFromParameters(
        newSharedState,
        parameters,
        updateModel,
      ),
      ...deriveStateFromParameters(parameters),
    };

    return newState;
  },
  shouldIgnoreItemsStateUpdate: (parameters) => !!parameters.dataSource,
};

export class RichTreeViewProStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewProState<R, Multiple>,
  RichTreeViewProParameters<R, Multiple>
> {
  public lazyLoading = new TreeViewLazyLoadingPlugin(this);

  public itemsReordering = new TreeViewItemsReorderingPlugin(this);

  public constructor(parameters: RichTreeViewProParameters<R, Multiple>, isRtl: boolean) {
    super(parameters, 'RichTreeViewPro', isRtl, mapper);
  }

  public buildPublicAPI(): RichTreeViewProPublicAPI<R, Multiple> {
    return {
      ...super.buildPublicAPI(),
      updateItemChildren: this.lazyLoading.updateItemChildren,
    };
  }
}
