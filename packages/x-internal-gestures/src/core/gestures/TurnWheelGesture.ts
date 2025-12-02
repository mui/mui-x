/**
 * TurnWheelGesture - Detects wheel events on an element
 *
 * This gesture tracks mouse wheel or touchpad scroll events on elements, firing events when:
 * - The user scrolls/wheels on the element (ongoing)
 *
 * Unlike other gestures which may have start/ongoing/end states,
 * wheel gestures are always considered "ongoing" since they are discrete events.
 */

import { ActiveGesturesRegistry } from '../ActiveGesturesRegistry';
import { Gesture, GestureEventData, GestureOptions, GestureState } from '../Gesture';
import type { KeyboardManager } from '../KeyboardManager';
import { PointerData, PointerManager } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, createEventName } from '../utils';

/**
 * Configuration options for the TurnWheelGesture
 * Uses the base gesture options with additional wheel-specific options
 */
export type TurnWheelGestureOptions<GestureName extends string> = GestureOptions<GestureName> & {
  /**
   * Sensitivity of the wheel gesture
   * Values > 1 increase sensitivity, values < 1 decrease sensitivity
   * @default 1
   */
  sensitivity?: number;

  /**
   * Maximum value for totalDelta values
   * Limits how large the accumulated wheel deltas can be
   * Applied to totalDeltaX, totalDeltaY, and totalDeltaZ individually
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: number;

  /**
   * Minimum value for totalDelta values
   * Sets a lower bound for accumulated wheel deltas
   * Applied to totalDeltaX, totalDeltaY, and totalDeltaZ individually
   * @default Number.MIN_SAFE_INTEGER
   */
  min?: number;

  /**
   * Initial value for totalDelta values
   * Sets the starting value for accumulated wheel deltas
   * Applied to totalDeltaX, totalDeltaY, and totalDeltaZ individually
   * @default 0
   */
  initialDelta?: number;

  /**
   * Invert the direction of delta changes
   * When true, reverses the sign of deltaX, deltaY, and deltaZ values
   * @default false
   */
  invert?: boolean;

  /**
   * Wheel events happen on mouse mode only.
   */
  pointerMode?: never;

  /**
   * Wheel events happen on mouse mode only.
   */
  pointerOptions?: never;
};

/**
 * Event data specific to wheel gesture events
 * Contains information about scroll delta amounts and mode
 */
export type TurnWheelGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = GestureEventData<CustomData> & {
  /** Horizontal scroll amount */
  deltaX: number;
  /** Vertical scroll amount */
  deltaY: number;
  /** Z-axis scroll amount (depth) */
  deltaZ: number;
  /** Total accumulated horizontal delta since tracking began */
  totalDeltaX: number;
  /** Total accumulated vertical delta since tracking began */
  totalDeltaY: number;
  /** Total accumulated Z-axis delta since tracking began */
  totalDeltaZ: number;
  /**
   * The unit of measurement for the delta values
   * 0: Pixels, 1: Lines, 2: Pages
   */
  deltaMode: number;
  /** The original DOM wheel event that triggered this gesture event */
  srcEvent: WheelEvent;
};

/**
 * Type definition for the CustomEvent created by TurnWheelGesture
 */
export type TurnWheelEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<TurnWheelGestureEventData<CustomData>>;

/**
 * State tracking for the TurnWheelGesture
 */
export type TurnWheelGestureState = GestureState & {
  /** Total accumulated horizontal delta since tracking began */
  totalDeltaX: number;
  /** Total accumulated vertical delta since tracking began */
  totalDeltaY: number;
  /** Total accumulated Z-axis delta since tracking began */
  totalDeltaZ: number;
};

/**
 * TurnWheelGesture class for handling wheel/scroll interactions
 *
 * This gesture detects when users scroll or use the mouse wheel on elements,
 * and dispatches corresponding scroll events with delta information.
 * Unlike most gestures, it extends directly from Gesture rather than PointerGesture.
 */
export class TurnWheelGesture<GestureName extends string> extends Gesture<GestureName> {
  protected state: TurnWheelGestureState = {
    totalDeltaX: 0,
    totalDeltaY: 0,
    totalDeltaZ: 0,
  };

  protected readonly isSinglePhase!: true;

  protected readonly eventType!: TurnWheelEvent;

  protected readonly optionsType!: TurnWheelGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<
    typeof this.optionsType,
    'name' | 'pointerMode' | 'pointerOptions'
  >;

  protected readonly mutableStateType!: Partial<typeof this.state>;

  /**
   * Scaling factor for delta values
   * Values > 1 increase sensitivity, values < 1 decrease sensitivity
   */
  private sensitivity: number;

  /**
   * Maximum value for totalDelta values
   * Limits how large the accumulated wheel deltas can be
   */
  private max: number;

  /**
   * Minimum value for totalDelta values
   * Sets a lower bound for accumulated wheel deltas
   */
  private min: number;

  /**
   * Initial value for totalDelta values
   * Sets the starting value for delta trackers
   */
  private initialDelta: number;

  /**
   * Whether to invert the direction of delta changes
   * When true, reverses the sign of deltaX, deltaY, and deltaZ values
   */
  private invert: boolean;

  constructor(options: TurnWheelGestureOptions<GestureName>) {
    super(options);
    this.sensitivity = options.sensitivity ?? 1;
    this.max = options.max ?? Number.MAX_SAFE_INTEGER;
    this.min = options.min ?? Number.MIN_SAFE_INTEGER;
    this.initialDelta = options.initialDelta ?? 0;
    this.invert = options.invert ?? false;

    this.state.totalDeltaX = this.initialDelta;
    this.state.totalDeltaY = this.initialDelta;
    this.state.totalDeltaZ = this.initialDelta;
  }

  public clone(overrides?: Record<string, unknown>): TurnWheelGesture<GestureName> {
    return new TurnWheelGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      sensitivity: this.sensitivity,
      max: this.max,
      min: this.min,
      initialDelta: this.initialDelta,
      invert: this.invert,
      requiredKeys: [...this.requiredKeys],
      preventIf: [...this.preventIf],
      // Apply any overrides passed to the method
      ...overrides,
    });
  }

  public init(
    element: TargetElement,
    pointerManager: PointerManager,
    gestureRegistry: ActiveGesturesRegistry<GestureName>,
    keyboardManager: KeyboardManager,
  ): void {
    super.init(element, pointerManager, gestureRegistry, keyboardManager);

    // Add event listener directly to the element
    // @ts-expect-error, WheelEvent is correct.
    this.element.addEventListener('wheel', this.handleWheelEvent);
  }

  public destroy(): void {
    // Remove the element-specific event listener
    // @ts-expect-error, WheelEvent is correct.
    this.element.removeEventListener('wheel', this.handleWheelEvent);
    this.resetState();
    super.destroy();
  }

  protected resetState(): void {
    this.isActive = false;
    this.state = {
      totalDeltaX: 0,
      totalDeltaY: 0,
      totalDeltaZ: 0,
    };
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.sensitivity = options.sensitivity ?? this.sensitivity;
    this.max = options.max ?? this.max;
    this.min = options.min ?? this.min;
    this.initialDelta = options.initialDelta ?? this.initialDelta;
    this.invert = options.invert ?? this.invert;
  }

  /**
   * Handle wheel events for a specific element
   * @param element The element that received the wheel event
   * @param event The original wheel event
   */
  private handleWheelEvent = (event: WheelEvent): void => {
    // Check if this gesture should be prevented by active gestures
    if (this.shouldPreventGesture(this.element, 'mouse')) {
      return;
    }

    // Get pointers from the PointerManager to use for centroid calculation
    const pointers = this.pointerManager.getPointers() || new Map();
    const pointersArray = Array.from(pointers.values());

    // Update total deltas with scaled values
    this.state.totalDeltaX += event.deltaX * this.sensitivity * (this.invert ? -1 : 1);
    this.state.totalDeltaY += event.deltaY * this.sensitivity * (this.invert ? -1 : 1);
    this.state.totalDeltaZ += event.deltaZ * this.sensitivity * (this.invert ? -1 : 1);

    // Apply proper min/max clamping for each axis
    // Ensure values stay between min and max bounds
    (['totalDeltaX', 'totalDeltaY', 'totalDeltaZ'] as const).forEach((axis) => {
      // First clamp at the minimum bound
      if (this.state[axis] < this.min) {
        this.state[axis] = this.min;
      }

      // Then clamp at the maximum bound
      if (this.state[axis] > this.max) {
        this.state[axis] = this.max;
      }
    });

    // Emit the wheel event
    this.emitWheelEvent(pointersArray, event);
  };

  /**
   * Emit wheel-specific events
   * @param pointers The current pointers on the element
   * @param event The original wheel event
   */
  private emitWheelEvent(pointers: PointerData[], event: WheelEvent): void {
    // Calculate centroid - either from existing pointers or from the wheel event position
    const centroid =
      pointers.length > 0 ? calculateCentroid(pointers) : { x: event.clientX, y: event.clientY };

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(this.element);

    // Create custom event data
    const customEventData: TurnWheelGestureEventData = {
      gestureName: this.name,
      centroid,
      target: event.target,
      srcEvent: event,
      phase: 'ongoing', // Wheel events are always in "ongoing" state
      pointers,
      timeStamp: event.timeStamp,
      deltaX: event.deltaX * this.sensitivity * (this.invert ? -1 : 1),
      deltaY: event.deltaY * this.sensitivity * (this.invert ? -1 : 1),
      deltaZ: event.deltaZ * this.sensitivity * (this.invert ? -1 : 1),
      deltaMode: event.deltaMode,
      totalDeltaX: this.state.totalDeltaX,
      totalDeltaY: this.state.totalDeltaY,
      totalDeltaZ: this.state.totalDeltaZ,
      activeGestures,
      customData: this.customData,
    };

    // Apply default event behavior if configured
    if (this.preventDefault) {
      event.preventDefault();
    }

    if (this.stopPropagation) {
      event.stopPropagation();
    }

    // Event names to trigger
    const eventName = createEventName(this.name, 'ongoing');

    // Dispatch custom events on the element
    const domEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: customEventData,
    });

    this.element.dispatchEvent(domEvent);
  }
}
