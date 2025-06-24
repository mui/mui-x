/**
 * PressGesture - Detects press and hold interactions
 *
 * This gesture tracks when users press and hold on an element for a specified duration, firing events when:
 * - The press begins and passes the holding threshold time (start, ongoing)
 * - The press ends (end)
 * - The press is canceled by movement beyond threshold (cancel)
 *
 * This gesture is commonly used for contextual menus, revealing additional options, or alternate actions.
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, createEventName } from '../utils';

/**
 * Configuration options for PressGesture
 * Extends PointerGestureOptions with press-specific options
 */
export type PressGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName> & {
  /**
   * Duration in milliseconds required to hold before the press gesture is recognized
   * @default 500
   */
  duration?: number;

  /**
   * Maximum distance in pixels that a pointer can move while pressing and still be considered a press
   * @default 10
   */
  maxDistance?: number;
};

/**
 * Event data specific to press gesture events
 * Contains information about the press location and duration
 */
export type PressGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** The x-coordinate of the press */
  x: number;
  /** The y-coordinate of the press */
  y: number;
  /** The duration of the press in milliseconds */
  duration: number;
};

/**
 * Type definition for the CustomEvent created by PressGesture
 */
export type PressEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<PressGestureEventData<CustomData>>;

/**
 * State tracking for the PressGesture
 */
export type PressGestureState = GestureState & {
  /** The initial centroid position when the gesture began */
  startCentroid: { x: number; y: number } | null;
  /** The most recent position during the gesture */
  lastPosition: { x: number; y: number } | null;
  /** ID of the timer used to track press duration */
  timerId: ReturnType<typeof setTimeout> | null;
  /** Start time of the press (used to calculate duration) */
  startTime: number;
  /** Whether the press threshold duration has been reached */
  pressThresholdReached: boolean;
};

/**
 * PressGesture class for handling press/hold interactions
 *
 * This gesture detects when users press and hold on an element for a specified duration,
 * and dispatches press-related events when the user holds long enough.
 *
 * The `start` and `ongoing` events are dispatched at the same time once the press threshold is reached.
 * If the press is canceled (event.g., by moving too far), a `cancel` event is dispatched before the `end` event.
 */
export class PressGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: PressGestureState = {
    startCentroid: null,
    lastPosition: null,
    timerId: null,
    startTime: 0,
    pressThresholdReached: false,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: PressEvent;

  protected readonly optionsType!: PressGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    'startCentroid' | 'lastPosition' | 'timerId' | 'startTime' | 'pressThresholdReached'
  >;

  /**
   * Duration in milliseconds required to hold before the press gesture is recognized
   */
  private duration: number;

  /**
   * Maximum distance a pointer can move for a gesture to still be considered a press
   */
  private maxDistance: number;

  constructor(options: PressGestureOptions<GestureName>) {
    super(options);
    this.duration = options.duration ?? 500;
    this.maxDistance = options.maxDistance ?? 10;
  }

  public clone(overrides?: Record<string, unknown>): PressGesture<GestureName> {
    return new PressGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      duration: this.duration,
      maxDistance: this.maxDistance,
      preventIf: [...this.preventIf],
      // Apply any overrides passed to the method
      ...overrides,
    });
  }

  public destroy(): void {
    this.clearPressTimer();
    this.resetState();
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.duration = options.duration ?? this.duration;
    this.maxDistance = options.maxDistance ?? this.maxDistance;
  }

  protected resetState(): void {
    this.clearPressTimer();
    this.isActive = false;
    this.state = {
      ...this.state,
      startCentroid: null,
      lastPosition: null,
      timerId: null,
      startTime: 0,
      pressThresholdReached: false,
    };
  }

  /**
   * Clear the press timer if it's active
   */
  private clearPressTimer(): void {
    if (this.state.timerId !== null) {
      clearTimeout(this.state.timerId);
      this.state.timerId = null;
    }
  }

  /**
   * Handle pointer events for the press gesture
   */
  protected handlePointerEvent(pointers: Map<number, PointerData>, event: PointerEvent): void {
    const pointersArray = Array.from(pointers.values());

    // Check for our forceCancel event to handle interrupted gestures (from contextmenu, blur)
    if (event.type === 'forceCancel') {
      // Reset all active press gestures when we get a force reset event
      this.cancelPress(event.target as null, pointersArray, event);
      return;
    }

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);
    if (!targetElement) {
      return;
    }

    // Check if this gesture should be prevented by active gestures
    if (this.shouldPreventGesture(targetElement)) {
      if (this.isActive) {
        // If the gesture was active but now should be prevented, cancel it gracefully
        this.cancelPress(targetElement, pointersArray, event);
      }
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    // Check if we have enough pointers and not too many
    if (relevantPointers.length < this.minPointers || relevantPointers.length > this.maxPointers) {
      if (this.isActive) {
        // Cancel or end the gesture if it was active
        this.cancelPress(targetElement, relevantPointers, event);
      }
      return;
    }

    switch (event.type) {
      case 'pointerdown':
        if (!this.isActive && !this.state.startCentroid) {
          // Calculate and store the starting centroid
          this.state.startCentroid = calculateCentroid(relevantPointers);
          this.state.lastPosition = { ...this.state.startCentroid };
          this.state.startTime = event.timeStamp;
          this.isActive = true;

          // Store the original target element
          this.originalTarget = targetElement;

          // Start the timer for press recognition
          this.clearPressTimer(); // Clear any existing timer first
          this.state.timerId = setTimeout(() => {
            if (this.isActive && this.state.startCentroid) {
              this.state.pressThresholdReached = true;
              const lastPosition = this.state.lastPosition;

              // Emit press start event
              this.emitPressEvent(targetElement, 'start', relevantPointers, event, lastPosition!);
              this.emitPressEvent(targetElement, 'ongoing', relevantPointers, event, lastPosition!);
            }
          }, this.duration);
        }
        break;

      case 'pointermove':
        if (this.isActive && this.state.startCentroid) {
          // Calculate current position
          const currentPosition = calculateCentroid(relevantPointers);
          this.state.lastPosition = currentPosition;

          // Calculate distance from start position
          const deltaX = currentPosition.x - this.state.startCentroid.x;
          const deltaY = currentPosition.y - this.state.startCentroid.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          // If moved too far, cancel the press gesture
          if (distance > this.maxDistance) {
            this.cancelPress(targetElement, relevantPointers, event);
          }
        }
        break;

      case 'pointerup':
        if (this.isActive) {
          if (this.state.pressThresholdReached) {
            // Complete the press gesture if we've held long enough
            const position = this.state.lastPosition || this.state.startCentroid!;
            this.emitPressEvent(targetElement, 'end', relevantPointers, event, position);
          }

          // Reset state
          this.resetState();
        }
        break;

      case 'pointercancel':
      case 'forceCancel':
        // Cancel the gesture
        this.cancelPress(targetElement, relevantPointers, event);
        break;

      default:
        break;
    }
  }

  /**
   * Emit press-specific events with additional data
   */
  private emitPressEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
    position: { x: number; y: number },
  ): void {
    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Calculate current duration of the press
    const currentDuration = event.timeStamp - this.state.startTime;

    // Create custom event data
    const customEventData: PressGestureEventData = {
      gestureName: this.name,
      centroid: position,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      x: position.x,
      y: position.y,
      duration: currentDuration,
      activeGestures,
      customData: this.customData,
    };

    // Event names to trigger
    const eventName = createEventName(this.name, phase);

    // Dispatch custom events on the element
    const domEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: customEventData,
    });

    element.dispatchEvent(domEvent);

    // Apply preventDefault/stopPropagation if configured
    if (this.preventDefault) {
      event.preventDefault();
    }

    if (this.stopPropagation) {
      event.stopPropagation();
    }
  }

  /**
   * Cancel the current press gesture
   */
  private cancelPress(
    element: TargetElement | null,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (this.isActive && this.state.pressThresholdReached) {
      const position = this.state.lastPosition || this.state.startCentroid!;

      this.emitPressEvent(element ?? this.element, 'cancel', pointers, event, position);
      this.emitPressEvent(element ?? this.element, 'end', pointers, event, position);
    }

    this.resetState();
  }
}
