import { Store } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import {
  TreeViewModelUpdater,
  TreeViewParameters,
  TreeViewParametersToStateMapper,
  TreeViewSelectionValue,
  TreeViewState,
} from './TreeViewStore.types';
import {
  BuildItemsLookupConfig,
  buildItemsLookups,
  buildItemsState,
  TREE_VIEW_ROOT_PARENT_ID,
} from '../plugins/useTreeViewItems/useTreeViewItems.utils';
import { TreeViewItemId, TreeViewValidItem } from '../../models';
import { applyModelInitialValue, deriveStateFromParameters } from './TreeViewStore.utils';
import { itemsSelectors } from '../plugins/useTreeViewItems';
import {
  createTreeViewDefaultId,
  generateTreeItemIdAttribute,
} from '../corePlugins/useTreeViewId/useTreeViewId.utils';
import { idSelectors } from '../corePlugins/useTreeViewId';
import { expansionSelectors } from '../plugins/useTreeViewExpansion';
import { TreeViewSelectionManager } from './TreeViewSelectionManager';
import { focusSelectors } from '../plugins/useTreeViewFocus';

export class TreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends TreeViewState<R, Multiple>,
  Parameters extends TreeViewParameters<R, Multiple>,
> extends Store<State> {
  public parameters: Parameters;

  private initialParameters: Parameters | null = null;

  public instanceName: string;

  private mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>;

  private selectionManager = new TreeViewSelectionManager<R, Multiple, this>(this);

  public constructor(
    parameters: Parameters,
    instanceName: string,
    mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>,
  ) {
    const sharedInitialState: TreeViewState<R, Multiple> = {
      treeId: undefined,
      focusedItemId: null,
      ...deriveStateFromParameters(parameters),
      ...buildItemsState({
        items: parameters.items,
        config: {
          isItemDisabled: parameters.isItemDisabled,
          getItemId: parameters.getItemId,
          getItemLabel: parameters.getItemLabel,
          getItemChildren: parameters.getItemChildren,
        },
      }),
      expandedItems: applyModelInitialValue(
        parameters.expandedItems,
        parameters.defaultExpandedItems,
        [],
      ),
      selectedItems: applyModelInitialValue(
        parameters.selectedItems,
        parameters.defaultSelectedItems,
        (parameters.multiSelect ? EMPTY_OBJECT : null) as TreeViewSelectionValue<Multiple>,
      ),
    };

    const initialState = mapper.getInitialState(sharedInitialState, parameters);

    super(initialState);
    this.parameters = parameters;
    this.instanceName = instanceName;
    this.mapper = mapper;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  private setExpandedItems = (event: React.SyntheticEvent | null, value: TreeViewItemId[]) => {
    if (this.parameters.expandedItems === undefined) {
      this.set('expandedItems', value);
    }
    this.parameters.onExpandedItemsChange?.(event, value);
  };

  /**
   * Updates the state of the tTree View based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: Parameters) => {
    const updateModel: TreeViewModelUpdater<State, Parameters> = (
      mutableNewState,
      controlledProp,
      defaultProp,
    ) => {
      if (parameters[controlledProp] !== undefined) {
        mutableNewState[controlledProp] = parameters[controlledProp] as any;
      }

      if (process.env.NODE_ENV !== 'production') {
        const defaultValue = parameters[defaultProp];
        const isControlled = parameters[controlledProp] !== undefined;
        const initialDefaultValue = this.initialParameters?.[defaultProp];
        const initialIsControlled = this.initialParameters?.[controlledProp] !== undefined;

        if (initialIsControlled !== isControlled) {
          warnOnce([
            `Tree View: A component is changing the ${
              initialIsControlled ? '' : 'un'
            }controlled ${controlledProp} state of ${this.instanceName} to be ${initialIsControlled ? 'un' : ''}controlled.`,
            'Elements should not switch from uncontrolled to controlled (or vice versa).',
            `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
            "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
            'More info: https://fb.me/react-controlled-components',
          ]);
        } else if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warnOnce([
            `Tree View: A component is changing the default ${controlledProp} state of an uncontrolled ${this.instanceName} after being initialized. `,
            `To suppress this warning opt to use a controlled ${this.instanceName}.`,
          ]);
        }
      }

      const newSchedulerState = deriveStateFromParameters(parameters) as Partial<State>;

      updateModel(newSchedulerState, 'expandedItems', 'defaultExpandedItems');

      const newState = this.mapper.updateStateFromParameters(
        newSchedulerState,
        parameters,
        updateModel,
      );

      if (this.state.providedTreeId !== parameters.id || this.state.treeId === undefined) {
        newSchedulerState.treeId = createTreeViewDefaultId();
      }

      this.update(newState);
      this.parameters = parameters;
    };
  };

  protected getItemDOMElement = (itemId: string) => {
    const itemMeta = itemsSelectors.itemMeta(this.state, itemId);
    if (itemMeta == null) {
      return null;
    }

    const idAttribute = generateTreeItemIdAttribute({
      treeId: idSelectors.treeId(this.state),
      itemId,
      id: itemMeta.idAttribute,
    });
    return document.getElementById(idAttribute);
  };

  /**
   * Add an array of items to the tree.
   * @param {SetItemChildrenParameters<R>} args The items to add to the tree and information about their ancestors.
   */
  protected setItemChildren = ({
    items,
    parentId,
    getChildrenCount,
  }: {
    items: readonly R[];
    parentId: TreeViewItemId | null;
    getChildrenCount: (item: R) => number;
  }) => {
    const parentIdWithDefault = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    const parentDepth = parentId == null ? -1 : itemsSelectors.itemDepth(this.state, parentId);

    const itemsConfig: BuildItemsLookupConfig = {
      isItemDisabled: this.parameters.isItemDisabled,
      getItemLabel: this.parameters.getItemLabel,
      getItemChildren: this.parameters.getItemChildren,
      getItemId: this.parameters.getItemId,
    };

    const { metaLookup, modelLookup, orderedChildrenIds, childrenIndexes } = buildItemsLookups({
      config: itemsConfig,
      items,
      parentId,
      depth: parentDepth + 1,
      isItemExpandable: getChildrenCount ? (item) => getChildrenCount(item) > 0 : () => false,
      otherItemsMetaLookup: itemsSelectors.itemMetaLookup(this.state),
    });

    this.update({
      itemModelLookup: { ...this.state.itemModelLookup, ...modelLookup },
      itemMetaLookup: { ...this.state.itemMetaLookup, ...metaLookup },
      itemOrderedChildrenIdsLookup: {
        ...this.state.itemOrderedChildrenIdsLookup,
        [parentIdWithDefault]: orderedChildrenIds,
      },
      itemChildrenIndexesLookup: {
        ...this.state.itemChildrenIndexesLookup,
        [parentIdWithDefault]: childrenIndexes,
      },
    } as Partial<State>);
  };

  /**
   * Remove the children of an item.
   * @param {TreeViewItemId | null} parentId The id of the item to remove the children of.
   */
  protected removeChildren = (parentId: string | null) => {
    const newMetaMap = Object.keys(this.state.itemMetaLookup).reduce((acc, key) => {
      const item = this.state.itemMetaLookup[key];
      if (item.parentId === parentId) {
        return acc;
      }
      return { ...acc, [item.id]: item };
    }, {});

    const newItemOrderedChildrenIdsLookup = { ...this.state.itemOrderedChildrenIdsLookup };
    const newItemChildrenIndexesLookup = { ...this.state.itemChildrenIndexesLookup };
    const cleanId = parentId ?? TREE_VIEW_ROOT_PARENT_ID;
    delete newItemChildrenIndexesLookup[cleanId];
    delete newItemOrderedChildrenIdsLookup[cleanId];

    this.update({
      itemMetaLookup: newMetaMap,
      itemOrderedChildrenIdsLookup: newItemOrderedChildrenIdsLookup,
      itemChildrenIndexesLookup: newItemChildrenIndexesLookup,
    } as Partial<State>);
  };

  /**
   * Mark a list of items as expandable.
   * @param {TreeViewItemId[]} items The ids of the items to mark as expandable.
   */
  protected addExpandableItems = (items: TreeViewItemId[]) => {
    const newItemMetaLookup = { ...this.state.itemMetaLookup };
    for (const itemId of items) {
      newItemMetaLookup[itemId] = { ...newItemMetaLookup[itemId], expandable: true };
    }
    this.set('itemMetaLookup', newItemMetaLookup);
  };

  /**
   * Event handler to fire when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item being clicked.
   */
  protected handleItemClick = (event: React.MouseEvent, itemId: TreeViewItemId) => {
    if (this.parameters.onItemClick) {
      this.parameters.onItemClick(event, itemId);
    }
  };

  /**
   * Change the expansion status of a given item.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed. If not defined, the item's expansion status will be the toggled.
   */
  protected setItemExpansion = ({ itemId, event = null, shouldBeExpanded }) => {
    const isExpandedBefore = expansionSelectors.isItemExpanded(this.state, itemId);
    const cleanShouldBeExpanded = shouldBeExpanded ?? !isExpandedBefore;
    if (isExpandedBefore === cleanShouldBeExpanded) {
      return;
    }

    const eventParameters = {
      isExpansionPrevented: false,
      shouldBeExpanded: cleanShouldBeExpanded,
      event,
      itemId,
    };
    publishTreeViewEvent(instance, 'beforeItemToggleExpansion', eventParameters);
    if (eventParameters.isExpansionPrevented) {
      return;
    }

    this.applyItemExpansion({ itemId, event, shouldBeExpanded: cleanShouldBeExpanded });
  };

  /**
   * Apply the new expansion status of a given item.
   * Is used by the `setItemExpansion` method and by the `useTreeViewLazyLoading` plugin.
   * Unlike `setItemExpansion`, this method does not trigger the lazy loading.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent | null} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed.
   */
  protected applyItemExpansion = ({
    itemId,
    event,
    shouldBeExpanded,
  }: {
    itemId: string;
    event: React.SyntheticEvent | null;
    shouldBeExpanded: boolean;
  }) => {
    const oldExpanded = expansionSelectors.expandedItemsRaw(this.state);
    let newExpanded: string[];
    if (shouldBeExpanded) {
      newExpanded = [itemId].concat(oldExpanded);
    } else {
      newExpanded = oldExpanded.filter((id) => id !== itemId);
    }

    this.parameters.onItemExpansionToggle?.(event, itemId, shouldBeExpanded);
    this.setExpandedItems(event, newExpanded);
  };

  /**
   * Expand all the siblings (i.e.: the items that have the same parent) of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item whose siblings will be expanded.
   */
  protected expandAllSiblings = (event: React.KeyboardEvent, itemId: TreeViewItemId) => {
    const itemMeta = itemsSelectors.itemMeta(this.state, itemId);
    if (itemMeta == null) {
      return;
    }

    const siblings = itemsSelectors.itemOrderedChildrenIds(this.state, itemMeta.parentId);

    const diff = siblings.filter(
      (child) =>
        expansionSelectors.isItemExpandable(this.state, child) &&
        !expansionSelectors.isItemExpanded(this.state, child),
    );

    const newExpanded = expansionSelectors.expandedItemsRaw(this.state).concat(diff);

    if (diff.length > 0) {
      if (this.parameters.onItemExpansionToggle) {
        diff.forEach((newlyExpandedItemId) => {
          this.parameters.onItemExpansionToggle!(event, newlyExpandedItemId, true);
        });
      }

      this.setExpandedItems(event, newExpanded);
    }
  };

  protected setItemSelection = this.selectionManager.setItemSelection;

  protected selectAllNavigableItems = this.selectionManager.selectAllNavigableItems;

  protected expandSelectionRange = this.selectionManager.expandSelectionRange;

  protected selectRangeFromStartToItem = this.selectionManager.selectRangeFromStartToItem;

  protected selectRangeFromItemToEnd = this.selectionManager.selectRangeFromItemToEnd;

  protected selectItemFromArrowNavigation = this.selectionManager.selectItemFromArrowNavigation;

  private setFocusedItemId = (itemId: string | null) => {
    const focusedItemId = focusSelectors.focusedItemId(this.state);
    if (focusedItemId === itemId) {
      return;
    }

    this.set('focusedItemId', itemId);
  };

  // TODO: Rename
  private innerFocusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    const itemElement = this.getItemDOMElement(itemId);
    if (itemElement) {
      itemElement.focus();
    }

    this.setFocusedItemId(itemId);
    this.parameters.onItemFocus?.(event, itemId);
  };

  protected focusItem = (event: React.SyntheticEvent | null, itemId: string) => {
    // If we receive an itemId, and it is visible, the focus will be set to it
    const itemMeta = itemsSelectors.itemMeta(this.state, itemId);
    const isItemVisible =
      itemMeta &&
      (itemMeta.parentId == null ||
        expansionSelectors.isItemExpanded(this.state, itemMeta.parentId));

    if (isItemVisible) {
      this.innerFocusItem(event, itemId);
    }
  };

  protected removeFocusedItem = () => {
    const focusedItemId = focusSelectors.focusedItemId(this.state);
    if (focusedItemId == null) {
      return;
    }

    const itemMeta = itemsSelectors.itemMeta(this.state, focusedItemId);
    if (itemMeta) {
      const itemElement = this.getItemDOMElement(focusedItemId);
      if (itemElement) {
        itemElement.blur();
      }
    }

    this.setFocusedItemId(null);
  };
}
