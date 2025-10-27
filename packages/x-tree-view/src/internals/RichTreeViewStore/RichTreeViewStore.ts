import { TreeViewValidItem } from '../../models';
import { TreeViewLabelEditingPlugin } from '../plugins/labelEditing';
import { TreeViewParametersToStateMapper, MinimalTreeViewStore } from '../MinimalTreeViewStore';
import {
  RichTreeViewStoreParameters,
  RichTreeViewPublicAPI,
  RichTreeViewState,
} from './RichTreeViewStore.types';

const deriveStateFromParameters = (parameters: RichTreeViewStoreParameters<any, any>) => ({
  isItemEditable: parameters.isItemEditable ?? false,
});

const mapper: TreeViewParametersToStateMapper<
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

export class ExtendableRichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends RichTreeViewState<R, Multiple> = RichTreeViewState<R, Multiple>,
  Parameters extends RichTreeViewStoreParameters<R, Multiple> = RichTreeViewStoreParameters<
    R,
    Multiple
  >,
> extends MinimalTreeViewStore<R, Multiple, State, Parameters> {
  public labelEditing = new TreeViewLabelEditingPlugin(this);

  /**
   * Mapper of the RichTreeViewStore.
   * Can be used by classes extending the RichTreeViewStore to create their own mapper.
   */
  public static rawMapper = mapper;

  public buildPublicAPI(): RichTreeViewPublicAPI<R, Multiple> {
    return {
      ...super.buildPublicAPI(),
      ...this.labelEditing.buildPublicAPI(),
    };
  }
}

export class RichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewState<R, Multiple>,
  RichTreeViewStoreParameters<R, Multiple>
> {
  public constructor(parameters: RichTreeViewStoreParameters<R, Multiple>) {
    super(parameters, 'RichTreeView', mapper);
  }
}
