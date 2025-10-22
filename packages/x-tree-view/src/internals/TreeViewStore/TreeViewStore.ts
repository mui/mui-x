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
import { buildItemsState } from '../plugins/useTreeViewItems/useTreeViewItems.utils';
import { TreeViewItemId, TreeViewValidItem } from '../../models';
import { applyModelInitialValue, deriveStateFromParameters } from './TreeViewStore.utils';
import { createTreeViewDefaultId } from '../corePlugins/useTreeViewId/useTreeViewId.utils';
import { TreeViewSelectionManager } from './TreeViewSelectionManager';
import { TreeViewExpansionManager } from './TreeViewExpansionManager';
import { TimeoutManager } from './TimeoutManager';
import { TreeViewKeyboardNavigationManager } from './TreeViewKeyboardNavigationManager';
import { TreeViewStoreEffectManager } from './TreeViewStoreEffectManager';
import { TreeViewFocusManager } from './TreeViewFocusManager';
import { TreeViewItemsManager } from './TreeViewItemsManager';

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

  // TODO: Move to state if needed in some selectors.
  public isRtl: boolean;

  public timeoutManager = new TimeoutManager();

  private storeEffectManager = new TreeViewStoreEffectManager<State, this>(this);

  private itemsManager = new TreeViewItemsManager<R, this>(this);

  private focusManager = new TreeViewFocusManager<this>(this);

  private expansionManager = new TreeViewExpansionManager<this>(this);

  private selectionManager = new TreeViewSelectionManager<Multiple, this>(this);

  private keyboardNavigationManager = new TreeViewKeyboardNavigationManager<this>(this);

  private propsBuilder: any[] = [];

  public constructor(
    parameters: Parameters,
    instanceName: string,
    isRtl: boolean,
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
    this.isRtl = isRtl;

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Updates the state of the tTree View based on the new parameters provided to the root component.
   */
  public updateStateFromParameters = (parameters: Parameters, isRtl: boolean) => {
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
      this.isRtl = isRtl;
      this.parameters = parameters;
    };
  };

  public disposeEffect = () => {
    return this.timeoutManager.clearAll;
  };

  public registerStoreEffect = this.storeEffectManager.registerStoreEffect;

  /**
   * Get the DOM element of the item with the given id.
   * @param {TreeViewItemId} itemId The id of the item to get the DOM element of.
   * @returns {HTMLElement | null} The DOM element of the item with the given id.
   */
  public getItemDOMElement = this.itemsManager.getItemDOMElement;

  /**
   * Remove the children of an item.
   * @param {TreeViewItemId | null} parentId The id of the item to remove the children of.
   */
  public removeChildren = this.itemsManager.removeChildren;

  /**
   * Add an array of items to the tree.
   * @param {SetItemChildrenParameters<R>} args The items to add to the tree and information about their ancestors.
   */
  public setItemChildren = this.itemsManager.setItemChildren;

  /**
   * Focus the item with the given id.
   *
   * If the item is the child of a collapsed item, then this method will do nothing.
   * Make sure to expand the ancestors of the item before calling this method if needed.
   * @param {React.SyntheticEvent | null} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item to focus.
   */
  protected focusItem = this.focusManager.focusItem;

  /**
   * Remove the focus from the currently focused item (both from the internal state and the DOM).
   */
  protected removeFocusedItem = this.focusManager.removeFocusedItem;

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
  protected addExpandableItems = (items: TreeViewItemId[]) => {
    const newItemMetaLookup = { ...this.state.itemMetaLookup };
    for (const itemId of items) {
      newItemMetaLookup[itemId] = { ...newItemMetaLookup[itemId], expandable: true };
    }
    this.set('itemMetaLookup', newItemMetaLookup);
  };

  /**
   * Callback fired when the `content` slot of a given Tree Item is clicked.
   * @param {React.MouseEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item being clicked.
   */
  public handleItemClick = this.itemsManager.handleItemClick;

  /**
   * Change the expansion status of a given item.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed. If not defined, the item's expansion status will be the toggled.
   */
  public setItemExpansion = this.expansionManager.setItemExpansion;

  /**
   * Apply the new expansion status of a given item.
   * Is used by the `setItemExpansion` method and by the `useTreeViewLazyLoading` plugin.
   * Unlike `setItemExpansion`, this method does not trigger the lazy loading.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to expand of collapse.
   * @param {React.SyntheticEvent | null} parameters.event The DOM event that triggered the change.
   * @param {boolean} parameters.shouldBeExpanded If `true` the item will be expanded. If `false` the item will be collapsed.
   */
  protected applyItemExpansion = this.expansionManager.applyItemExpansion;

  /**
   * Expand all the siblings (i.e.: the items that have the same parent) of a given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {TreeViewItemId} itemId The id of the item whose siblings will be expanded.
   */
  public expandAllSiblings = this.expansionManager.expandAllSiblings;

  /**
   * Select or deselect an item.
   * @param {object} parameters The parameters of the method.
   * @param {string} parameters.itemId The id of the item to select or deselect.
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
   * @param {string} itemId The id of the item to expand the selection to.
   */
  public expandSelectionRange = this.selectionManager.expandSelectionRange;

  /**
   * Expand the current selection range from the first navigable item to the given item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the item up to which the selection range should be expanded.
   */
  public selectRangeFromStartToItem = this.selectionManager.selectRangeFromStartToItem;

  /**
   * Expand the current selection range from the given item to the last navigable item.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string} itemId The id of the item from which the selection range should be expanded.
   */
  public selectRangeFromItemToEnd = this.selectionManager.selectRangeFromItemToEnd;

  /**
   * Update the selection when navigating with ArrowUp / ArrowDown keys.
   * @param {React.SyntheticEvent} event The DOM event that triggered the change.
   * @param {string} currentItemId The id of the active item before the keyboard navigation.
   * @param {string} nextItemId The id of the active item after the keyboard navigation.
   */
  public selectItemFromArrowNavigation = this.selectionManager.selectItemFromArrowNavigation;

  /**
   * Callback fired when a key is pressed on an item.
   * Handles all the keyboard navigation logic.
   * @param {React.KeyboardEvent<HTMLElement> & TreeViewCancellableEvent} event The keyboard event that triggered the callback.
   * @param {TreeViewItemId} itemId The id of the item that the event was triggered on.
   */
  protected handleItemKeyDown = this.keyboardNavigationManager.handleItemKeyDown;

  /**
   * Updates the `labelMap` to add/remove the first character of some item's labels.
   * This map is used to navigate the tree using type-ahead search.
   * This method is only used by the `useTreeViewJSXItems` plugin, otherwise the updates are handled internally.
   * @param {(map: TreeViewLabelMap) => TreeViewLabelMap} updater The function to update the map.
   */
  protected updateLabelMap = this.keyboardNavigationManager.updateLabelMap;
}
