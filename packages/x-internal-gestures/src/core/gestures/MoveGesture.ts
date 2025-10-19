/**
 * MoveGesture - Detects when a pointer enters, moves within, and leaves an element
 *
 * This gesture tracks pointer movements over an element, firing events when:
 * - A pointer enters the element (start)
 * - A pointer moves within the element (ongoing)
 * - A pointer leaves the element (end)
 *
 * Unlike other gestures which often require specific actions to trigger,
 * the move gesture fires automatically when pointers interact with the target element.
 *
 * This gesture only works with mouse pointers, not touch or pen.
 */

import { ActiveGesturesRegistry } from '../ActiveGesturesRegistry';
import { GesturePhase, GestureState } from '../Gesture';
import type { KeyboardManager } from '../KeyboardManager';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData, PointerManager } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, createEventName } from '../utils';

/**
 * Configuration options for the MoveGesture
 * Extends the base PointerGestureOptions
 */
export type MoveGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName> & {
  /**
   * Distance threshold in pixels for gesture activation.
   *
   * The gesture will only be recognized once the pointers have moved this many
   * pixels from their starting positions. Higher values prevent accidental
   * gesture recognition when the user makes small unintentional movements.
   *
   * @default 0 (no threshold)
   */
  threshold?: number;
};

/**
 * Event data specific to move gesture events
 * Includes the source pointer event and standard gesture data
 */
export type MoveGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {};

/**
 * Type definition for the CustomEvent created by MoveGesture
 */
export type MoveEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<MoveGestureEventData<CustomData>>;

/**
 * State tracking for the MoveGesture
 */
export type MoveGestureState = GestureState & {
  /** The last recorded pointer position for this element */
  lastPosition: { x: number; y: number } | null;
};

/**
 * MoveGesture class for handling pointer movement over elements
 *
 * This gesture detects when pointers enter, move within, or leave target elements,
 * and dispatches corresponding custom events.
 *
 * This gesture only works with hovering mouse pointers, not touch.
 */
export class MoveGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: MoveGestureState = {
    lastPosition: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: MoveEvent;

  protected readonly optionsType!: MoveGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: never;

  /**
   * Movement threshold in pixels that must be exceeded before the gesture activates.
   * Higher values reduce false positive gesture detection for small movements.
   */
  protected threshold: number;

  constructor(options: MoveGestureOptions<GestureName>) {
    super(options);
    this.threshold = options.threshold || 0;
  }

  public clone(overrides?: Record<string, unknown>): MoveGesture<GestureName> {
    return new MoveGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      threshold: this.threshold,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      requiredKeys: [...this.requiredKeys],
      pointerMode: [...this.pointerMode],
      preventIf: [...this.preventIf],
      pointerOptions: structuredClone(this.pointerOptions),
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

    // Add event listeners for entering and leaving elements
    // These are different from pointer events handled by PointerManager
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener('pointerenter', this.handleElementEnter);
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener('pointerleave', this.handleElementLeave);
  }

  public destroy(): void {
    // Remove event listeners using the same function references
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener('pointerenter', this.handleElementEnter);
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener('pointerleave', this.handleElementLeave);
    this.resetState();
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    // Call parent method to handle common options
    super.updateOptions(options);
  }

  protected resetState(): void {
    this.isActive = false;
    this.state = {
      lastPosition: null,
    };
  }

  /**
   * Handle pointer enter events for a specific element
   * @param event The original pointer event
   */
  private handleElementEnter = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }

    // Get pointers from the PointerManager
    const pointers = this.pointerManager.getPointers() || new Map();
    const pointersArray = Array.from(pointers.values());

    // Only activate if we're within pointer count constraints
    if (this.isWithinPointerCount(pointersArray, event.pointerType)) {
      this.isActive = true;
      const currentPosition = { x: event.clientX, y: event.clientY };
      this.state.lastPosition = currentPosition;

      // Emit start event
      this.emitMoveEvent(this.element, 'start', pointersArray, event);
      this.emitMoveEvent(this.element, 'ongoing', pointersArray, event);
    }
  };

  /**
   * Handle pointer leave events for a specific element
   * @param event The original pointer event
   */
  private handleElementLeave = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
      return;
    }

    if (!this.isActive) {
      return;
    }

    // Get pointers from the PointerManager
    const pointers = this.pointerManager.getPointers() || new Map();
    const pointersArray = Array.from(pointers.values());

    // Emit end event and reset state
    this.emitMoveEvent(this.element, 'end', pointersArray, event);
    this.resetState();
  };

  /**
   * Handle pointer events for the move gesture (only handles move events now)
   * @param pointers Map of active pointers
   * @param event The original pointer event
   */
  protected handlePointerEvent = (
    pointers: Map<number, PointerData>,
    event: PointerEvent,
  ): void => {
    if (
      event.type !== 'pointermove' ||
      (event.pointerType !== 'mouse' && event.pointerType !== 'pen')
    ) {
      return;
    }

    if (this.preventDefault) {
      event.preventDefault();
    }
    if (this.stopPropagation) {
      event.stopPropagation();
    }

    const pointersArray = Array.from(pointers.values());

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);
    if (!targetElement) {
      return;
    }

    if (!this.isWithinPointerCount(pointersArray, event.pointerType)) {
      return;
    }

    if (this.shouldPreventGesture(targetElement, event.pointerType)) {
      if (!this.isActive) {
        return;
      }
      this.resetState();
      this.emitMoveEvent(targetElement, 'end', pointersArray, event);
      return;
    }

    // Update position
    const currentPosition = { x: event.clientX, y: event.clientY };
    this.state.lastPosition = currentPosition;

    if (!this.isActive) {
      this.isActive = true;
      this.emitMoveEvent(targetElement, 'start', pointersArray, event);
    }
    // Emit ongoing event
    this.emitMoveEvent(targetElement, 'ongoing', pointersArray, event);
  };

  /**
   * Emit move-specific events
   * @param element The DOM element the event is related to
   * @param phase The current phase of the gesture (start, ongoing, end)
   * @param pointers Array of active pointers
   * @param event The original pointer event
   */
  private emitMoveEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    const currentPosition = this.state.lastPosition || calculateCentroid(pointers);

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data
    const customEventData: MoveGestureEventData = {
      gestureName: this.name,
      centroid: currentPosition,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      activeGestures,
      customData: this.customData,
    };

    // Event names to trigger
    const eventName = createEventName(this.name, phase);

    // Dispatch custom events on the element
    const domEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      composed: true,
      detail: customEventData,
    });

    element.dispatchEvent(domEvent);
  }
}
