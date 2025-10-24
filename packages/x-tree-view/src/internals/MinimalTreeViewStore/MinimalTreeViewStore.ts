import { Store } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import {
  MinimalTreeViewPublicAPI,
  TreeViewModelUpdater,
  MinimalTreeViewParameters,
  TreeViewParametersToStateMapper,
  TreeViewSelectionValue,
  MinimalTreeViewState,
} from './MinimalTreeViewStore.types';
import { buildItemsState } from '../plugins/useTreeViewItems/useTreeViewItems.utils';
import { TreeViewValidItem } from '../../models';
import { applyModelInitialValue, deriveStateFromParameters } from './MinimalTreeViewStore.utils';
import { createTreeViewDefaultId } from '../corePlugins/useTreeViewId/useTreeViewId.utils';
import { TreeViewSelectionManager } from './TreeViewSelectionManager';
import { TreeViewExpansionPlugin } from '../plugins/TreeViewExpansionPlugin/TreeViewExpansionPlugin';
import { TimeoutManager } from './TimeoutManager';
import { TreeViewKeyboardNavigationManager } from './TreeViewKeyboardNavigationManager';
import { TreeViewInternalsManager } from './TreeViewInternalsManager';
import { TreeViewFocusManager } from './TreeViewFocusManager';
import { TreeViewItemsManager } from './TreeViewItemsManager';
import { TreeViewItemPluginManager } from './TreeViewItemPluginManager';

export class MinimalTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends MinimalTreeViewState<R, Multiple>,
  Parameters extends MinimalTreeViewParameters<R, Multiple>,
> extends Store<State> {
  public parameters: Parameters;

  private initialParameters: Parameters | null = null;

  public instanceName: string;

  private mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>;

  // TODO: Move to state if needed in some selectors.
  public isRtl: boolean;

  public timeoutManager = new TimeoutManager();

  public itemPluginManager = new TreeViewItemPluginManager<this>();

  public $ = new TreeViewInternalsManager<State>(this);

  private itemsManager = new TreeViewItemsManager<R>(this);

  private focusManager = new TreeViewFocusManager(this);

  private expansionPlugin = new TreeViewExpansionPlugin(this);

  private selectionManager = new TreeViewSelectionManager<Multiple>(this);

  private keyboardNavigationManager = new TreeViewKeyboardNavigationManager(this);

  public constructor(
    parameters: Parameters,
    instanceName: string,
    isRtl: boolean,
    mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>,
  ) {
    const sharedInitialState: MinimalTreeViewState<R, Multiple> = {
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
    this.isRtl = isRtl;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Builds an object containing the method that should be exposed publicly by the Tree View components.
   */
  public buildPublicAPI(): MinimalTreeViewPublicAPI<R, Multiple> {
    return {
      focusItem: this.focusItem,
      getItem: this.getItem,
      getItemDOMElement: this.getItemDOMElement,
      getItemOrderedChildrenIds: this.getItemOrderedChildrenIds,
      getItemTree: this.getItemTree,
      getParentId: this.getParentId,
      isItemExpanded: this.isItemExpanded,
      setIsItemDisabled: this.setIsItemDisabled,
      setItemExpansion: this.setItemExpansion,
      setItemSelection: this.setItemSelection,
    };
  }

  /**
   * Updates the state of the tTree View based on the new parameters provided to the root component.
   */
  public updateStateFromParameters(parameters: Parameters, isRtl: boolean) {
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
    };

    const newSchedulerState = deriveStateFromParameters(parameters) as Partial<State>;

    updateModel(newSchedulerState, 'expandedItems', 'defaultExpandedItems');
    updateModel(newSchedulerState, 'selectedItems', 'defaultSelectedItems');

    const newState = this.mapper.updateStateFromParameters(
      newSchedulerState,
      parameters,
      updateModel,
    );

    if (this.state.providedTreeId !== parameters.id || this.state.treeId === undefined) {
      newSchedulerState.treeId = createTreeViewDefaultId();
    }

    const shouldUpdateItemsState =
      !this.mapper.shouldIgnoreItemsStateUpdate(parameters) &&
      (parameters.items !== this.parameters.items ||
        parameters.isItemDisabled !== this.parameters.isItemDisabled ||
        parameters.getItemId !== this.parameters.getItemId ||
        parameters.getItemLabel !== this.parameters.getItemLabel ||
        parameters.getItemChildren !== this.parameters.getItemChildren);

    if (shouldUpdateItemsState) {
      Object.assign(
        newSchedulerState,
        buildItemsState({
          items: parameters.items,
          config: {
            isItemDisabled: parameters.isItemDisabled,
            getItemId: parameters.getItemId,
            getItemLabel: parameters.getItemLabel,
            getItemChildren: parameters.getItemChildren,
          },
        }),
      );
    }

    this.update(newState);
    this.isRtl = isRtl;
    this.parameters = parameters;
  }

  public disposeEffect = () => {
    return this.timeoutManager.clearAll;
  };

  /**
   * Wheter updates based on `props.items` changes should be ignored.
   */
  public shouldIgnoreItemsStateUpdate = () => {
    return this.mapper.shouldIgnoreItemsStateUpdate(this.parameters);
  };

  /**
   * Get all the items in the same format as provided by `props.items`.
   * @returns {TreeViewBaseItem[]} The items in the tree.
   */
  public getItemTree = this.itemsManager.getItemTree;

  /**
   * Get the item with the given id.
   * When used in the Simple Tree View, it returns an object with the `id` and `label` properties.
   * @param {TreeViewItemId} itemId The id of the item to retrieve.
   * @returns {R} The item with the given id.
   */
  public getItem = this.itemsManager.getItem;

  /** * Get the id of the parent item.
   * @param {TreeViewItemId} itemId The id of the item to whose parentId we want to retrieve.
   * @returns {TreeViewItemId | null} The id of the parent item.
   */
  public getParentId = this.itemsManager.getParentId;

  /**
   * Get the ids of a given item's children.
   * Those ids are returned in the order they should be rendered.
   * To get the root items, pass `null` as the `itemId`.
   * @param {TreeViewItemId | null} itemId The id of the item to get the children of.
   * @returns {TreeViewItemId[]} The ids of the item's children.
   */
  public getItemOrderedChildrenIds = this.itemsManager.getItemOrderedChildrenIds;

  /**
   * Get the DOM element of the item with the given id.
   * @param {TreeViewItemId} itemId The id of the item to get the DOM element of.
   * @returns {HTMLElement | null} The DOM element of the item with the given id.
   */
  public getItemDOMElement = this.itemsManager.getItemDOMElement;

  /**
   * Add an array of items to the tree.
   * @param {SetItemChildrenParameters<R>} args The items to add to the tree and information about their ancestors.
   */
  public setItemChildren = this.itemsManager.setItemChildren;

  /**
   * Remove the children of an item.
   * @param {TreeViewItemId | null} parentId The id of the item to remove the children of.
   */
  public removeChildren = this.itemsManager.removeChildren;

  /**
   * Toggle the disabled state of the item with the given id.
   * @param {object} parameters The params of the method.
   * @param {TreeViewItemId } parameters.itemId The id of the item to get the children of.
   * @param {boolean } parameters.shouldBeDisabled true if the item should be disabled.
   */
  public setIsItemDisabled = this.itemsManager.setIsItemDisabled;

  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item being clicked.
   */
  public handleItemClick = this.itemsManager.handleItemClick;

  /**
   * Focus the item with the given id.
   *
   * If the item is the child of a collapsed item, then this method will do nothing.
   * Make sure to expand the ancestors of the item before calling this method if needed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to focus.
   */
  public focusItem = this.focusManager.focusItem;

  /**
   * Remove the focus from the currently focused item (both from the internal state and the DOM).
   */
  public removeFocusedItem = this.focusManager.removeFocusedItem;

  /**
   * Event handler to fire when the `root` slot of the Tree View is focused.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   */
  public handleRootFocus = this.focusManager.handleRootFocus;

  /**
   * Event handler to fire when the `root` slot of the Tree View is blurred.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   */
  public handleRootBlur = this.focusManager.handleRootBlur;

  /**
   * Mark a list of items as expandable.
   * @param {TreeViewItemId[]} items The ids of the items to mark as expandable.
   */
  public addExpandableItems = this.expansionPlugin.addExpandableItems;

  /**
   * Check if an item is expanded.
   * @param {TreeViewItemId} itemId The id of the item to check.
   * @returns {boolean} `true` if the item is expanded, `false` otherwise.
   */
  public isItemExpanded = this.expansionPlugin.isItemExpanded;

  /**
   * Change the expansion status of a given item.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed. If not defined, the item's expansion status will be the toggled.
   */
  public setItemExpansion = this.expansionPlugin.setItemExpansion;

  /**
   * Apply the new expansion status of a given item.
   * Is used by the `setItemExpansion` method and by the `useTreeViewLazyLoading` plugin.
   * Unlike `setItemExpansion`, this method does not trigger the lazy loading.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent | null} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed.
   */
  public applyItemExpansion = this.expansionPlugin.applyItemExpansion;

  /**
   * Expand all the siblings (i.e.: the items that have the same parent) of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item whose siblings will be expanded.
   */
  public expandAllSiblings = this.expansionPlugin.expandAllSiblings;

  /**
   * Select or deselect an item.
   * @param {object} parameters The parameters of the method.
   * @param {TreeViewItemId} parameters.itemId The id of the item to select or deselect.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.keepExistingSelection If `true`, the other already selected items will remain selected, otherwise, they will be deselected. This parameter is only relevant when `multiSelect` is `true`
   * @param {boolean | undefined} parameters.shouldBeSelected If `true` the item will be selected. If `false` the item will be deselected. If not defined, the item's selection status will be toggled.
   */
  public setItemSelection = this.selectionManager.setItemSelection;

  /**
   * Select all the navigable items in the tree.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   */
  public selectAllNavigableItems = this.selectionManager.selectAllNavigableItems;

  /**
   * Expand the current selection range up to the given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to expand the selection to.
   */
  public expandSelectionRange = this.selectionManager.expandSelectionRange;

  /**
   * Expand the current selection range from the first navigable item to the given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item up to which the selection range should be expanded.
   */
  public selectRangeFromStartToItem = this.selectionManager.selectRangeFromStartToItem;

  /**
   * Expand the current selection range from the given item to the last navigable item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item from which the selection range should be expanded.
   */
  public selectRangeFromItemToEnd = this.selectionManager.selectRangeFromItemToEnd;

  /**
   * Update the selection when navigating with ArrowUp / ArrowDown keys.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} currentItemId The id of the active item before the keyboard navigation.
   * @param {TreeViewItemId} nextItemId The id of the active item after the keyboard navigation.
   */
  public selectItemFromArrowNavigation = this.selectionManager.selectItemFromArrowNavigation;

  /**
   * Callback fired when a key is pressed on an item.
   * Handles all the keyboard navigation logic.
   * @param {React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent} event The keyboard event that triggered the callback.
   * @param {TreeViewItemId} itemId The id of the item that the event was triggered on.
   */
  public handleItemKeyDown = this.keyboardNavigationManager.handleItemKeyDown;

  /**
   * Updates the `labelMap` to add/remove the first character of some item's labels.
   * This map is used to navigate the tree using type-ahead search.
   * This method is only used by the `useTreeViewJSXItems` plugin, otherwise the updates are handled internally.
   * @param {(map: TreeViewLabelMap) => TreeViewLabelMap} updater The function to update the map.
   */
  protected updateLabelMap = this.keyboardNavigationManager.updateLabelMap;
}
