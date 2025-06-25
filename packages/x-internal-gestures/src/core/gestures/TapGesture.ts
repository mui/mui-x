/**
 * TapGesture - Detects tap (quick touch without movement) gestures
 *
 * This gesture tracks simple tap interactions on elements, firing a single event when:
 * - A complete tap is detected (pointerup after brief touch without excessive movement)
 * - The tap is canceled (event.g., moved too far or held too long)
 */

import { GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, createEventName } from '../utils';

/**
 * Configuration options for TapGesture
 * Extends PointerGestureOptions with tap-specific settings
 */
export type TapGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName> & {
  /**
   * Maximum distance in pixels a pointer can move for the gesture to still be considered a tap
   * @default 10
   */
  maxDistance?: number;

  /**
   * Number of consecutive taps to detect (for double-tap, triple-tap)
   * @default 1
   */
  taps?: number;
};

/**
 * Event data specific to tap gesture events
 * Contains information about the tap location and counts
 */
export type TapGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** X coordinate of the tap */
  x: number;
  /** Y coordinate of the tap */
  y: number;
  /** Current count of taps in a sequence */
  tapCount: number;
};

/**
 * Type definition for the CustomEvent created by TapGesture
 */
export type TapEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<TapGestureEventData<CustomData>>;

/**
 * State tracking for the TapGesture
 */
export type TapGestureState = GestureState & {
  /** The initial centroid position when the gesture began */
  startCentroid: { x: number; y: number } | null;
  /** Current count of consecutive taps */
  currentTapCount: number;
  /** Timestamp of the last tap */
  lastTapTime: number;
  /** The most recent centroid position during the gesture */
  lastPosition: { x: number; y: number } | null;
};

/**
 * TapGesture class for handling tap interactions
 *
 * This gesture detects when users tap on elements without significant movement,
 * and can recognize single taps, double taps, or other multi-tap sequences.
 */
export class TapGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: TapGestureState = {
    startCentroid: null,
    currentTapCount: 0,
    lastTapTime: 0,
    lastPosition: null,
  };

  protected readonly isSinglePhase!: true;

  protected readonly eventType!: TapEvent;

  protected readonly optionsType!: TapGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: never;

  /**
   * Maximum distance a pointer can move for a gesture to still be considered a tap
   */
  private maxDistance: number;

  /**
   * Number of consecutive taps to detect
   */
  private taps: number;

  constructor(options: TapGestureOptions<GestureName>) {
    super(options);
    this.maxDistance = options.maxDistance ?? 10;
    this.taps = options.taps ?? 1;
  }

  public clone(overrides?: Record<string, unknown>): TapGesture<GestureName> {
    return new TapGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      maxDistance: this.maxDistance,
      taps: this.taps,
      preventIf: [...this.preventIf],
      // Apply any overrides passed to the method
      ...overrides,
    });
  }

  public destroy(): void {
    this.resetState();
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.maxDistance = options.maxDistance ?? this.maxDistance;
    this.taps = options.taps ?? this.taps;
  }

  protected resetState(): void {
    this.isActive = false;
    this.state = {
      startCentroid: null,
      currentTapCount: 0,
      lastTapTime: 0,
      lastPosition: null,
    };
  }

  /**
   * Handle pointer events for the tap gesture
   */
  protected handlePointerEvent(pointers: Map<number, PointerData>, event: PointerEvent): void {
    const pointersArray = Array.from(pointers.values());

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);
    if (!targetElement) {
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    // Check if we have enough pointers and not too many
    if (
      this.shouldPreventGesture(targetElement) ||
      relevantPointers.length < this.minPointers ||
      relevantPointers.length > this.maxPointers
    ) {
      if (this.isActive) {
        // Cancel the gesture if it was active
        this.cancelTap(targetElement, relevantPointers, event);
      }
      return;
    }

    switch (event.type) {
      case 'pointerdown':
        if (!this.isActive) {
          // Calculate and store the starting centroid
          this.state.startCentroid = calculateCentroid(relevantPointers);
          this.state.lastPosition = { ...this.state.startCentroid };
          this.isActive = true;

          // Store the original target element
          this.originalTarget = targetElement;
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

          // If moved too far, cancel the tap gesture
          if (distance > this.maxDistance) {
            this.cancelTap(targetElement, relevantPointers, event);
          }
        }
        break;

      case 'pointerup':
        if (this.isActive) {
          // For valid tap: increment tap count
          this.state.currentTapCount += 1;

          // Make sure we have a valid position before firing the tap event
          const position = this.state.lastPosition || this.state.startCentroid;
          if (!position) {
            this.cancelTap(targetElement, relevantPointers, event);
            return;
          }

          // Check if we've reached the desired number of taps
          if (this.state.currentTapCount >= this.taps) {
            // The complete tap sequence has been detected - fire the tap event
            this.fireTapEvent(targetElement, relevantPointers, event, position);

            // Reset state after successful tap
            this.resetState();
          } else {
            // Store the time of this tap for multi-tap detection
            this.state.lastTapTime = event.timeStamp;

            // Reset active state but keep the tap count for multi-tap detection
            this.isActive = false;

            // For multi-tap detection: keep track of the last tap position
            // but clear the start centroid to prepare for next tap
            this.state.startCentroid = null;

            // Start a timeout to reset the tap count if the next tap doesn't come soon enough
            setTimeout(() => {
              if (
                this.state &&
                this.state.currentTapCount > 0 &&
                this.state.currentTapCount < this.taps
              ) {
                this.state.currentTapCount = 0;
              }
            }, 300); // 300ms is a typical double-tap detection window
          }
        }
        break;

      case 'pointercancel':
      case 'forceCancel':
        // Cancel the gesture
        this.cancelTap(targetElement, relevantPointers, event);
        break;

      default:
        break;
    }
  }

  /**
   * Fire the main tap event when a valid tap is detected
   */
  private fireTapEvent(
    element: TargetElement,
    pointers: PointerData[],
    event: PointerEvent,
    position: { x: number; y: number },
  ): void {
    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data for the tap event
    const customEventData: TapGestureEventData = {
      gestureName: this.name,
      centroid: position,
      target: event.target,
      srcEvent: event,
      phase: 'end', // The tap is complete, so we use 'end' state for the event data
      pointers,
      timeStamp: event.timeStamp,
      x: position.x,
      y: position.y,
      tapCount: this.state.currentTapCount,
      activeGestures,
      customData: this.customData,
    };

    // Dispatch a single 'tap' event (not 'tapStart', 'tapEnd', etc.)
    const domEvent = new CustomEvent(this.name, {
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
   * Cancel the current tap gesture
   */
  private cancelTap(element: TargetElement, pointers: PointerData[], event: PointerEvent): void {
    if (this.state.startCentroid || this.state.lastPosition) {
      const position = this.state.lastPosition || this.state.startCentroid;

      // Get list of active gestures
      const activeGestures = this.gesturesRegistry.getActiveGestures(element);

      // Create custom event data for the cancel event
      const customEventData: TapGestureEventData = {
        gestureName: this.name,
        centroid: position!,
        target: event.target,
        srcEvent: event,
        phase: 'cancel',
        pointers,
        timeStamp: event.timeStamp,
        x: position!.x,
        y: position!.y,
        tapCount: this.state.currentTapCount,
        activeGestures,
        customData: this.customData,
      };

      // Dispatch a 'tapCancel' event
      const eventName = createEventName(this.name, 'cancel');
      const domEvent = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail: customEventData,
      });

      element.dispatchEvent(domEvent);
    }

    this.resetState();
  }
}
