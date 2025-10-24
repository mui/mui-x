import { Store } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { EMPTY_OBJECT } from '@base-ui-components/utils/empty';
import { EventManager } from '@mui/x-internals/EventManager';
import {
  MinimalTreeViewPublicAPI,
  TreeViewModelUpdater,
  MinimalTreeViewParameters,
  TreeViewParametersToStateMapper,
  TreeViewSelectionValue,
  MinimalTreeViewState,
} from './MinimalTreeViewStore.types';
import { buildItemsState } from '../plugins/items/utils';
import { TreeViewValidItem } from '../../models';
import { applyModelInitialValue, deriveStateFromParameters } from './MinimalTreeViewStore.utils';
import { createTreeViewDefaultId } from '../corePlugins/useTreeViewId/useTreeViewId.utils';
import { TimeoutManager } from './TimeoutManager';
import { TreeViewKeyboardNavigationPlugin } from '../plugins/keyboardNavigation';
import { TreeViewFocusPlugin } from '../plugins/focus/TreeViewFocusPlugin';
import { TreeViewItemsPlugin } from '../plugins/items/TreeViewItemsPlugin';
import { TreeViewSelectionPlugin } from '../plugins/selection/TreeViewSelectionPlugin';
import { TreeViewExpansionPlugin } from '../plugins/expansion';
import { TreeViewItemPluginManager } from './TreeViewItemPluginManager';
import { TreeViewEventListener, TreeViewEventLookup, TreeViewEvents } from '../models/events';

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

  private eventManager = new EventManager();

  // TODO: Move to state if needed in some selectors.
  public isRtl: boolean;

  public timeoutManager = new TimeoutManager();

  public itemPluginManager = new TreeViewItemPluginManager<this>();

  public items = new TreeViewItemsPlugin<R>(this);

  public focus = new TreeViewFocusPlugin(this);

  public expansion = new TreeViewExpansionPlugin(this);

  public selection = new TreeViewSelectionPlugin<Multiple>(this);

  public keyboardNavigation = new TreeViewKeyboardNavigationPlugin(this);

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
      focusItem: this.focus.focusItem,
      getItem: this.items.getItem,
      getItemDOMElement: this.items.getItemDOMElement,
      getItemOrderedChildrenIds: this.items.getItemOrderedChildrenIds,
      getItemTree: this.items.getItemTree,
      getParentId: this.items.getParentId,
      setIsItemDisabled: this.items.setIsItemDisabled,
      isItemExpanded: this.expansion.isItemExpanded,
      setItemExpansion: this.expansion.setItemExpansion,
      setItemSelection: this.selection.setItemSelection,
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
    return () => {
      this.timeoutManager.clearAll();
      this.eventManager.removeAllListeners();
    };
  };

  /**
   * Wheter updates based on `props.items` changes should be ignored.
   */
  public shouldIgnoreItemsStateUpdate = () => {
    return this.mapper.shouldIgnoreItemsStateUpdate(this.parameters);
  };

  public registerStoreEffect = <Value>(
    selector: (state: State) => Value,
    effect: (previous: Value, next: Value) => void,
  ) => {
    let previousValue = selector(this.state);

    this.subscribe((state) => {
      const nextValue = selector(state);
      effect(previousValue, nextValue);
      previousValue = nextValue;
    });
  };

  public publishEvent = <E extends TreeViewEvents>(
    name: E,
    params: TreeViewEventLookup[E] extends { params: any }
      ? TreeViewEventLookup[E]['params']
      : undefined,
    event: TreeViewEventLookup[E] extends { event: any } ? TreeViewEventLookup[E]['event'] : null,
  ) => {
    event.defaultMuiPrevented = false;

    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }

    this.eventManager.emit(name, params, event);
  };

  public subscribeEvent = <E extends TreeViewEvents>(
    eventName: E,
    handler: TreeViewEventListener<E>,
  ) => {
    const enhancedHandler: TreeViewEventListener<E> = (params, event) => {
      if (!event.defaultMuiPrevented) {
        handler(params, event);
      }
    };

    this.eventManager.on(eventName, enhancedHandler);
    return () => {
      this.eventManager.removeListener(eventName, enhancedHandler);
    };
  };
}

function isSyntheticEvent(event: any): event is React.SyntheticEvent {
  return event.isPropagationStopped !== undefined;
}
