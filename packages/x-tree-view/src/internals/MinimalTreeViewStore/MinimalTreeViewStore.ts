import { Store } from '@mui/x-internals/store';
import { warnOnce } from '@mui/x-internals/warning';
import { EventManager } from '@mui/x-internals/EventManager';
import {
  TreeViewModelUpdater,
  MinimalTreeViewParameters,
  TreeViewParametersToStateMapper,
  MinimalTreeViewState,
} from './MinimalTreeViewStore.types';
import { TreeViewValidItem } from '../../models';
import {
  createMinimalInitialState,
  createTreeViewDefaultId,
  deriveStateFromParameters,
} from './MinimalTreeViewStore.utils';
import { TimeoutManager } from './TimeoutManager';
import { TreeViewKeyboardNavigationPlugin } from '../plugins/keyboardNavigation';
import { TreeViewFocusPlugin } from '../plugins/focus/TreeViewFocusPlugin';
import { TreeViewItemsPlugin } from '../plugins/items/TreeViewItemsPlugin';
import { TreeViewSelectionPlugin } from '../plugins/selection/TreeViewSelectionPlugin';
import { TreeViewExpansionPlugin } from '../plugins/expansion';
import { TreeViewItemPluginManager } from './TreeViewItemPluginManager';
import {
  TreeViewEventEvent,
  TreeViewEventListener,
  TreeViewEventParameters,
  TreeViewEvents,
} from '../models';

export class MinimalTreeViewStore<
  R extends TreeViewValidItem<R>,
  Multiple extends boolean | undefined,
  State extends MinimalTreeViewState<R, Multiple> = MinimalTreeViewState<R, Multiple>,
  Parameters extends MinimalTreeViewParameters<R, Multiple> = MinimalTreeViewParameters<
    R,
    Multiple
  >,
> extends Store<State> {
  private initialParameters: Parameters | null = null;

  private mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>;

  private eventManager = new EventManager();

  public instanceName: string;

  public parameters: Parameters;

  public timeoutManager = new TimeoutManager();

  public itemPluginManager = new TreeViewItemPluginManager<this>();

  public items: TreeViewItemsPlugin<R>;

  public focus: TreeViewFocusPlugin;

  public expansion: TreeViewExpansionPlugin;

  public selection: TreeViewSelectionPlugin<Multiple>;

  public keyboardNavigation: TreeViewKeyboardNavigationPlugin;

  public constructor(
    parameters: Parameters,
    instanceName: string,
    mapper: TreeViewParametersToStateMapper<R, Multiple, State, Parameters>,
  ) {
    const minimalInitialState = createMinimalInitialState(parameters);
    const initialState = mapper.getInitialState(minimalInitialState, parameters);
    super(initialState);

    this.parameters = parameters;
    this.instanceName = instanceName;
    this.mapper = mapper;

    // We mount the plugins in the constructor to make sure all the methods of the store are available to the plugins during their construction.
    this.items = new TreeViewItemsPlugin<R>(this);
    this.focus = new TreeViewFocusPlugin(this);
    this.expansion = new TreeViewExpansionPlugin(this);
    this.selection = new TreeViewSelectionPlugin<Multiple>(this);
    this.keyboardNavigation = new TreeViewKeyboardNavigationPlugin(this);

    if (process.env.NODE_ENV !== 'production') {
      this.initialParameters = parameters;
    }
  }

  /**
   * Builds an object containing the method that should be exposed publicly by the Tree View components.
   */
  public buildPublicAPI() {
    return {
      ...this.items.buildPublicAPI(),
      ...this.focus.buildPublicAPI(),
      ...this.expansion.buildPublicAPI(),
      ...this.selection.buildPublicAPI(),
    };
  }

  /**
   * Updates the state of the Tree View based on the new parameters provided to the root component.
   */
  public updateStateFromParameters(parameters: Parameters) {
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
          warnOnce(
            [
              `MUI X Tree View: A component is changing the ${
                initialIsControlled ? '' : 'un'
              }controlled ${controlledProp} state of ${this.instanceName} to be ${initialIsControlled ? 'un' : ''}controlled.`,
              'Elements should not switch from uncontrolled to controlled (or vice versa).',
              `Decide between using a controlled or uncontrolled ${controlledProp} element for the lifetime of the component.`,
              "The nature of the state is determined during the first render. It's considered controlled if the value is not `undefined`.",
              'More info: https://fb.me/react-controlled-components',
            ],
            'error',
          );
        } else if (JSON.stringify(initialDefaultValue) !== JSON.stringify(defaultValue)) {
          warnOnce(
            [
              `MUI X Tree View: A component is changing the default ${controlledProp} state of an uncontrolled ${this.instanceName} after being initialized. `,
              `To suppress this warning opt to use a controlled ${this.instanceName}.`,
            ],
            'error',
          );
        }
      }
    };

    const newMinimalState = deriveStateFromParameters(parameters) as Partial<State>;

    updateModel(newMinimalState, 'expandedItems', 'defaultExpandedItems');
    updateModel(newMinimalState, 'selectedItems', 'defaultSelectedItems');

    if (this.state.providedTreeId !== parameters.id || this.state.treeId === undefined) {
      newMinimalState.treeId = createTreeViewDefaultId();
    }

    if (
      !this.mapper.shouldIgnoreItemsStateUpdate(parameters) &&
      TreeViewItemsPlugin.shouldRebuildItemsState(parameters, this.parameters)
    ) {
      Object.assign(newMinimalState, TreeViewItemsPlugin.buildItemsStateIfNeeded(parameters));
    }

    const newState = this.mapper.updateStateFromParameters(
      newMinimalState,
      parameters,
      updateModel,
    );

    this.update(newState);
    this.parameters = parameters;
  }

  /**
   * Returns a cleanup function that need to be called when the store is destroyed.
   */
  public disposeEffect = () => {
    return this.timeoutManager.clearAll;
  };

  /**
   * Whether updates based on `props.items` change should be ignored.
   */
  public shouldIgnoreItemsStateUpdate = () => {
    return this.mapper.shouldIgnoreItemsStateUpdate(this.parameters);
  };

  /**
   * Registers an effect to be run when the value returned by the selector changes.
   */
  public registerStoreEffect = <Value>(
    selector: (state: State) => Value,
    effect: (previous: Value, next: Value) => void,
  ) => {
    let previousValue = selector(this.state);

    this.subscribe((state) => {
      const nextValue = selector(state);
      if (nextValue !== previousValue) {
        effect(previousValue, nextValue);
        previousValue = nextValue;
      }
    });
  };

  /**
   * Publishes an event to all its subscribers.
   */
  public publishEvent = <E extends TreeViewEvents>(
    name: E,
    params: TreeViewEventParameters<E>,
    event: TreeViewEventEvent<E>,
  ) => {
    if (isSyntheticEvent(event) && event.isPropagationStopped()) {
      return;
    }
    this.eventManager.emit(name, params, event);
  };

  /**
   * Subscribe to an event emitted by the store.
   * For now, the subscription is only removed when the store is destroyed.
   */
  public subscribeEvent = <E extends TreeViewEvents>(
    eventName: E,
    handler: TreeViewEventListener<E>,
  ) => {
    this.eventManager.on(eventName, handler);
  };
}

function isSyntheticEvent(event: any): event is React.SyntheticEvent {
  return event?.isPropagationStopped !== undefined;
}
