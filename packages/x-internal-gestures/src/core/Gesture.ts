/**
 * Base Gesture module that provides common functionality for all gesture implementations
 */

import { ActiveGesturesRegistry } from './ActiveGesturesRegistry';
import { KeyboardKey, KeyboardManager } from './KeyboardManager';
import { PointerData, PointerManager } from './PointerManager';
import { CustomEventListener } from './types/CustomEventListener';
import { TargetElement } from './types/TargetElement';
import { eventList } from './utils/eventList';

/**
 * The possible phases of a gesture during its lifecycle.
 *
 * - 'start': The gesture has been recognized and is beginning
 * - 'ongoing': The gesture is in progress (e.g., a finger is moving)
 * - 'end': The gesture has completed successfully
 * - 'cancel': The gesture was interrupted or terminated abnormally
 */
export type GesturePhase = 'start' | 'ongoing' | 'end' | 'cancel';

/**
 * Core data structure passed to gesture event handlers.
 * Contains all relevant information about a gesture event.
 */
export type GestureEventData<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  {
    /** The name of the gesture */
    gestureName: string;
    /** The centroid of all active pointers involved in the gesture */
    centroid: { x: number; y: number };
    /** The target element of the original event */
    target: EventTarget | null;
    /** The original event that triggered this gesture */
    srcEvent: Event;
    /** The current phase of the gesture */
    phase: GesturePhase;
    /** Array of all active pointers involved in the gesture */
    pointers: PointerData[];
    /** The time at which the gesture event occurred */
    timeStamp: number;
    /** List of all currently active gestures */
    activeGestures: Record<string, boolean>;
    /** User-mutable data object for sharing state between gesture events */
    customData: CustomData;
  };

/**
 * Defines the types of pointers that can trigger a gesture.
 */
export type PointerMode = 'mouse' | 'touch' | 'pen';

/**
 * Base configuration options that can be overridden per pointer mode.
 */
export type BaseGestureOptions = {
  /**
   * Array of keyboard keys that must be pressed for the gesture to be recognized.
   * If not provided or empty, no keyboard key requirement is applied.
   *
   * A special identifier `ControlOrMeta` can be used to match either Control or Meta keys,
   * which is useful for cross-platform compatibility.
   *
   * @example ['Shift', 'Alt']
   * @default [] (no key requirement)
   */
  requiredKeys?: KeyboardKey[];
};

/**
 * Configuration options for creating a gesture instance.
 */
export type GestureOptions<
  GestureName extends string,
  FineGrainedGestureOptions extends BaseGestureOptions = BaseGestureOptions,
> = {
  /** Unique name identifying this gesture type */
  name: GestureName;
  /** Whether to prevent default browser action for gesture events */
  preventDefault?: boolean;
  /** Whether to stop propagation of gesture events */
  stopPropagation?: boolean;
  // Hard to correctly type this, so we just use string[]
  /**
   * List of gesture names that should prevent this gesture from activating when they are active.
   * If any of these gestures are active, this gesture will not be recognized.
   *
   * This only works when the gestures in the array have phases. Because `TurnWheel` and `Tap`
   * gestures are single-phase, they will not be able to prevent other gestures.
   *
   * Phased events are those that have multiple phases, usually denoted by `<event>Start`
   * and `<event>End`, like `pan` and `pinch` events.
   *
   * @example ['pan', 'pinch']
   * @default [] (no prevented gestures)
   */
  preventIf?: string[];
  /**
   * List of pointer types that can trigger this gesture.
   * If provided, only the specified pointer types will be able to activate the gesture.
   *
   * @example ['mouse', 'touch']
   * @default [] (all pointer types allowed)
   */
  pointerMode?: PointerMode[];
} & FineGrainedGestureOptions & {
    /**
     * Pointer mode-specific configuration overrides.
     * Options defined here will override any option defined in the base root options.
     *
     * @example
     * ```typescript
     * {
     *   pointerOptions: {
     *     mouse: { requiredKeys: ['ControlOrMeta'] },
     *     touch: { requiredKeys: [] },
     *   },
     * }
     * ```
     */
    pointerOptions?: Partial<Record<PointerMode, FineGrainedGestureOptions>>;
  };

// eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
declare const _privateKey: unique symbol;

/**
 * Type for the state of a gesture recognizer.
 */
export type GestureState = {
  [_privateKey]?: undefined;
};

/**
 * Base abstract class for all gestures. This class provides the fundamental structure
 * and functionality for handling gestures, including registering and unregistering
 * gesture handlers, creating emitters, and managing gesture state.
 *
 * Gesture is designed as an extensible base for implementing specific gesture recognizers.
 * Concrete gesture implementations should extend this class or one of its subclasses.
 *
 * To implement:
 * - Non-pointer gestures (like wheel events): extend this Gesture class directly
 * - Pointer-based gestures: extend the PointerGesture class instead
 *
 * @example
 * ```ts
 * import { Gesture } from './Gesture';
 *
 * class CustomGesture extends Gesture {
 *   constructor(options) {
 *     super(options);
 *   }
 *
 *   clone(overrides) {
 *     return new CustomGesture({
 *       name: this.name,
 *       // ... other options
 *       ...overrides,
 *     });
 *   }
 * }
 * ```
 */
export abstract class Gesture<GestureName extends string> {
  /** Unique name identifying this gesture type */
  public readonly name: GestureName;

  /** Whether to prevent default browser action for gesture events */
  protected preventDefault: boolean;

  /** Whether to stop propagation of gesture events */
  protected stopPropagation: boolean;

  /**
   * List of gesture names that should prevent this gesture from activating when they are active.
   */
  protected preventIf: string[];

  /**
   * Array of keyboard keys that must be pressed for the gesture to be recognized.
   */
  protected requiredKeys: KeyboardKey[];

  /**
   * KeyboardManager instance for tracking key presses
   */
  protected keyboardManager!: KeyboardManager;

  /**
   * List of pointer types that can trigger this gesture.
   * If undefined, all pointer types are allowed.
   */
  protected pointerMode: PointerMode[];

  /**
   * Pointer mode-specific configuration overrides.
   */
  protected pointerOptions: Partial<Record<PointerMode, BaseGestureOptions>>;

  /**
   * User-mutable data object for sharing state between gesture events
   * This object is included in all events emitted by this gesture
   */
  protected customData: Record<string, unknown> = {};

  /** Reference to the singleton PointerManager instance */
  protected pointerManager!: PointerManager;

  /** Reference to the singleton ActiveGesturesRegistry instance */
  protected gesturesRegistry!: ActiveGesturesRegistry<GestureName>;

  /** The DOM element this gesture is attached to */
  protected element!: TargetElement;

  /** Stores the active gesture state */
  protected abstract state: GestureState;

  /** @internal For types. If false enables phases (xStart, x, xEnd) */
  protected abstract readonly isSinglePhase: boolean;

  /** @internal For types. The event type this gesture is associated with */
  protected abstract readonly eventType: CustomEvent;

  /** @internal For types. The options type for this gesture */
  protected abstract readonly optionsType: GestureOptions<GestureName>;

  /** @internal For types. The options that can be changed at runtime */
  protected abstract readonly mutableOptionsType: Omit<typeof this.optionsType, 'name'>;

  /** @internal For types. The state that can be changed at runtime */
  protected abstract readonly mutableStateType: Partial<typeof this.state>;

  /**
   * Create a new gesture instance with the specified options
   *
   * @param options - Configuration options for this gesture
   */
  constructor(options: GestureOptions<GestureName>) {
    if (!options || !options.name) {
      throw new Error('Gesture must be initialized with a valid name.');
    }
    if (options.name in eventList) {
      throw new Error(
        `Gesture can't be created with a native event name. Tried to use "${options.name}". Please use a custom name instead.`,
      );
    }

    this.name = options.name;
    this.preventDefault = options.preventDefault ?? false;
    this.stopPropagation = options.stopPropagation ?? false;
    this.preventIf = options.preventIf ?? [];
    this.requiredKeys = options.requiredKeys ?? [];
    this.pointerMode = options.pointerMode ?? [];
    this.pointerOptions = options.pointerOptions ?? {};
  }

  /**
   * Initialize the gesture by acquiring the pointer manager and gestures registry
   * Must be called before the gesture can be used
   */
  public init(
    element: TargetElement,
    pointerManager: PointerManager,
    gestureRegistry: ActiveGesturesRegistry<GestureName>,
    keyboardManager: KeyboardManager,
  ): void {
    this.element = element;
    this.pointerManager = pointerManager;
    this.gesturesRegistry = gestureRegistry;
    this.keyboardManager = keyboardManager;

    const changeOptionsEventName = `${this.name}ChangeOptions`;
    (this.element as CustomEventListener).addEventListener(
      changeOptionsEventName,
      this.handleOptionsChange,
    );

    const changeStateEventName = `${this.name}ChangeState`;
    (this.element as CustomEventListener).addEventListener(
      changeStateEventName,
      this.handleStateChange,
    );
  }

  /**
   * Handle option change events
   * @param event Custom event with new options in the detail property
   */
  private handleOptionsChange = (event: CustomEvent<typeof this.mutableOptionsType>): void => {
    if (event && event.detail) {
      this.updateOptions(event.detail);
    }
  };

  /**
   * Update the gesture options with new values
   * @param options Object containing properties to update
   */
  protected updateOptions(options: typeof this.mutableOptionsType): void {
    // Update common options
    this.preventDefault = options.preventDefault ?? this.preventDefault;
    this.stopPropagation = options.stopPropagation ?? this.stopPropagation;
    this.preventIf = options.preventIf ?? this.preventIf;
    this.requiredKeys = options.requiredKeys ?? this.requiredKeys;
    this.pointerMode = options.pointerMode ?? this.pointerMode;
    this.pointerOptions = options.pointerOptions ?? this.pointerOptions;
  }

  /**
   * Get the default configuration for the pointer specific options.
   * Change this function in child classes to provide different defaults.
   */
  protected getBaseConfig() {
    return {
      requiredKeys: this.requiredKeys,
    };
  }

  /**
   * Get the effective configuration for a specific pointer mode.
   * This merges the base configuration with pointer mode-specific overrides.
   *
   * @param pointerType - The pointer type to get configuration for
   * @returns The effective configuration object
   */
  protected getEffectiveConfig<T>(pointerType: PointerMode, baseConfig: T): T {
    if (pointerType !== 'mouse' && pointerType !== 'touch' && pointerType !== 'pen') {
      // Unknown pointer type, return base config
      return baseConfig;
    }

    // Apply pointer mode-specific overrides
    const pointerModeOverrides = this.pointerOptions[pointerType];
    if (pointerModeOverrides) {
      return {
        ...baseConfig,
        ...pointerModeOverrides,
      };
    }

    return baseConfig;
  }

  /**
   * Handle state change events
   * @param event Custom event with new state values in the detail property
   */
  private handleStateChange = (event: CustomEvent<typeof this.mutableStateType>): void => {
    if (event && event.detail) {
      this.updateState(event.detail);
    }
  };

  /**
   * Update the gesture state with new values
   * @param stateChanges Object containing state properties to update
   */
  protected updateState(stateChanges: typeof this.mutableStateType): void {
    // This is a base implementation - concrete gesture classes should override
    // to handle specific state updates based on their state structure
    Object.assign(this.state, stateChanges);
  }

  /**
   * Create a deep clone of this gesture for a new element
   *
   * @param overrides - Optional configuration options that override the defaults
   * @returns A new instance of this gesture with the same configuration and any overrides applied
   */
  public abstract clone(overrides?: Record<string, unknown>): Gesture<GestureName>;

  /**
   * Check if the event's target is or is contained within any of our registered elements
   *
   * @param event - The browser event to check
   * @returns The matching element or null if no match is found
   */
  protected getTargetElement(event: Event): TargetElement | null {
    if (
      this.isActive ||
      this.element === event.target ||
      ('contains' in this.element && this.element.contains(event.target as Node)) ||
      ('getRootNode' in this.element &&
        this.element.getRootNode() instanceof ShadowRoot &&
        event.composedPath().includes(this.element))
    ) {
      return this.element;
    }
    return null;
  }

  /** Whether the gesture is currently active */
  set isActive(isActive: boolean) {
    if (isActive) {
      this.gesturesRegistry.registerActiveGesture(this.element, this);
    } else {
      this.gesturesRegistry.unregisterActiveGesture(this.element, this);
    }
  }

  /** Whether the gesture is currently active */
  get isActive(): boolean {
    return this.gesturesRegistry.isGestureActive(this.element, this) ?? false;
  }

  /**
   * Checks if this gesture should be prevented from activating.
   *
   * @param element - The DOM element to check against
   * @param pointerType - The type of pointer triggering the gesture
   * @returns true if the gesture should be prevented, false otherwise
   */
  protected shouldPreventGesture(element: TargetElement, pointerType: string): boolean {
    // Get effective configuration for this pointer type
    const effectiveConfig = this.getEffectiveConfig(
      pointerType as PointerMode,
      this.getBaseConfig(),
    );

    // First check if required keyboard keys are pressed
    if (!this.keyboardManager.areKeysPressed(effectiveConfig.requiredKeys)) {
      return true; // Prevent the gesture if required keys are not pressed
    }

    if (this.preventIf.length === 0) {
      return false; // No prevention rules, allow the gesture
    }

    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Check if any of the gestures that would prevent this one are active
    return this.preventIf.some((gestureName) => activeGestures[gestureName]);
  }

  /**
   * Checks if the given pointer type is allowed for this gesture based on the pointerMode setting.
   *
   * @param pointerType - The type of pointer to check.
   * @returns true if the pointer type is allowed, false otherwise.
   */
  protected isPointerTypeAllowed(pointerType: string): boolean {
    // If no pointer mode is specified, all pointer types are allowed
    if (!this.pointerMode || this.pointerMode.length === 0) {
      return true;
    }

    // Check if the pointer type is in the allowed types list
    return this.pointerMode.includes(pointerType as PointerMode);
  }

  /**
   * Clean up the gesture and unregister any listeners
   * Call this method when the gesture is no longer needed to prevent memory leaks
   */
  public destroy(): void {
    const changeOptionsEventName = `${this.name}ChangeOptions`;
    (this.element as CustomEventListener).removeEventListener(
      changeOptionsEventName,
      this.handleOptionsChange,
    );

    const changeStateEventName = `${this.name}ChangeState`;
    (this.element as CustomEventListener).removeEventListener(
      changeStateEventName,
      this.handleStateChange,
    );
  }

  /**
   * Reset the gesture state to its initial values
   */
  protected abstract resetState(): void;
}
