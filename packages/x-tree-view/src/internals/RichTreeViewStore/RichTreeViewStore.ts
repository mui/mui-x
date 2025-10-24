import { TreeViewValidItem } from '../../models';
import { TreeViewLabelEditingPlugin } from '../plugins/TreeViewLabelEditingPlugin';
import { TreeViewParametersToStateMapper, MinimalTreeViewStore } from '../MinimalTreeViewStore';
import {
  RichTreeViewParameters,
  RichTreeViewPublicAPI,
  RichTreeViewState,
} from './RichTreeViewStore.types';

const deriveStateFromParameters = (parameters: RichTreeViewParameters<any, any>) => ({
  isItemEditable: parameters.isItemEditable ?? false,
});

const mapper: TreeViewParametersToStateMapper<
  any,
  any,
  RichTreeViewState<any, any>,
  RichTreeViewParameters<any, any>
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
  State extends RichTreeViewState<R, Multiple>,
  Parameters extends RichTreeViewParameters<R, Multiple>,
> extends MinimalTreeViewStore<R, Multiple, State, Parameters> {
  private labelEditingPlugin = new TreeViewLabelEditingPlugin(this);

  /**
   * Mapper of the RichTreeViewStore.
   * Can be used by classes extending the RichTreeViewStore to create their own mapper.
   */
  public static rawMapper = mapper;

  public buildPublicAPI(): RichTreeViewPublicAPI<R, Multiple> {
    return {
      ...super.buildPublicAPI(),
      setEditedItem: this.setEditedItem,
      updateItemLabel: this.updateItemLabel,
    };
  }

  /**
   * Set which item is currently being edited.
   * You can pass `null` to exit editing mode.
   * @param {TreeViewItemId | null} itemId The id of the item to edit, or `null` to exit editing mode.
   */
  public setEditedItem = this.labelEditingPlugin.setEditedItem;

  /**
   * Used to update the label of an item.
   * @param {TreeViewItemId} itemId The id of the item to update the label of.
   * @param {string} newLabel The new label of the item.
   */
  public updateItemLabel = this.labelEditingPlugin.updateItemLabel;
}

export class RichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtendableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewState<R, Multiple>,
  RichTreeViewParameters<R, Multiple>
> {
  public constructor(parameters: RichTreeViewParameters<R, Multiple>, isRtl: boolean) {
    super(parameters, 'RichTreeView', isRtl, mapper);
  }
}
