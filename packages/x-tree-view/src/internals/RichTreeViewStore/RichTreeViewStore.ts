import { TreeViewValidItem } from '../../models';
import {} from '../plugins/useTreeViewLabel';
import { TreeViewParametersToStateMapper, TreeViewStore } from '../TreeViewStore';
import { RichTreeViewParameters, RichTreeViewState } from './RichTreeViewStore.types';
import { TreeViewLabelEditingManager } from './TreeViewLabelEditingManager';

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
};

export class ExtandableRichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends RichTreeViewState<R, Multiple>,
  Parameters extends RichTreeViewParameters<R, Multiple>,
> extends TreeViewStore<R, Multiple, State, Parameters> {
  private labelEditingManager = new TreeViewLabelEditingManager<this>(this);

  /**
   * Mapper of the RichTreeViewStore.
   * Can be used by classes extending the RichTreeViewStore to create their own mapper.
   */
  public static rawMapper = mapper;

  /**
   * Set which item is currently being edited.
   * You can pass `null` to exit editing mode.
   * @param {TreeViewItemId | null} itemId The id of the item to edit, or `null` to exit editing mode.
   */
  protected setEditedItem = this.labelEditingManager.setEditedItem;

  /**
   * Used to update the label of an item.
   * @param {TreeViewItemId} itemId The id of the item to update the label of.
   * @param {string} newLabel The new label of the item.
   */
  protected updateItemLabel = this.labelEditingManager.updateItemLabel;
}

export class RichTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
> extends ExtandableRichTreeViewStore<
  R,
  Multiple,
  RichTreeViewState<R, Multiple>,
  RichTreeViewParameters<R, Multiple>
> {
  public constructor(parameters: RichTreeViewParameters<R, Multiple>, isRtl: boolean) {
    super(parameters, 'RichTreeView', isRtl, mapper);
  }
}
