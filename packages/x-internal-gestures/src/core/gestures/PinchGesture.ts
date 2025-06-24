/**
 * PinchGesture - Detects pinch (zoom) movements with two or more pointers
 *
 * This gesture tracks when multiple pointers move toward or away from each other, firing events when:
 * - Two or more pointers begin moving (start)
 * - The pointers continue changing distance (ongoing)
 * - One or more pointers are released or lifted (end)
 *
 * This gesture is commonly used to implement zoom functionality in touch interfaces.
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import {
  calculateAverageDistance,
  calculateCentroid,
  createEventName,
  getPinchDirection,
} from '../utils';

/**
 * Configuration options for the PinchGesture
 * Uses the same options as the base PointerGesture
 */
export type PinchGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName> & {
  /**
   * Minimum number of pointers required to activate the gesture.
   * The gesture will not start until at least this many pointers are active.
   *
   * @default 2
   */
  minPointers?: number;

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
 * Event data specific to pinch gesture events
 * Contains information about scale, distance, and velocity
 */
export type PinchGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** Relative scale factor comparing current distance to initial distance (1.0 = no change) */
  scale: number;
  /** Change in scale since the last event */
  deltaScale: number;
  /** Total accumulated scale factor across all pinch operations */
  totalScale: number;
  /** Current distance between pointers in pixels */
  distance: number;
  /** Speed of the pinch movement in pixels per second */
  velocity: number;
  /** Direction of the pinch: 1 for spreading/zooming in, -1 for pinching/zooming out, 0 for no change */
  direction: -1 | 0 | 1;
};

/**
 * Type definition for the CustomEvent created by PinchGesture
 */
export type PinchEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<PinchGestureEventData<CustomData>>;

/**
 * State tracking for the PinchGesture
 */
export type PinchGestureState = GestureState & {
  /** The initial distance between pointers when the gesture began */
  startDistance: number;
  /** The most recent distance between pointers during the gesture */
  lastDistance: number;
  /** The most recent scale value (ratio of current to initial distance) */
  lastScale: number;
  /** Timestamp of the last pinch event, used for velocity calculation */
  lastTime: number;
  /** Current velocity of the pinch movement in pixels per second */
  velocity: number;
  /** Total accumulated scale factor across all pinch operations */
  totalScale: number;
  /** Change in scale since the last event */
  deltaScale: number;
};

/**
 * PinchGesture class for handling pinch/zoom interactions
 *
 * This gesture detects when users move multiple pointers toward or away from each other,
 * and dispatches scale-related events with distance and velocity information.
 */
export class PinchGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: PinchGestureState = {
    startDistance: 0,
    lastDistance: 0,
    lastScale: 1,
    lastTime: 0,
    velocity: 0,
    totalScale: 1,
    deltaScale: 0,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: PinchEvent;

  protected readonly optionsType!: PinchGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    'startDistance' | 'lastDistance' | 'lastScale' | 'lastTime' | 'velocity'
  >;

  /**
   * Movement threshold in pixels that must be exceeded before the gesture activates.
   * Higher values reduce false positive gesture detection for small movements.
   */
  protected threshold: number;

  constructor(options: PinchGestureOptions<GestureName>) {
    super({
      ...options,
      minPointers: options.minPointers ?? 2,
    });

    this.threshold = options.threshold ?? 0;
  }

  public clone(overrides?: Record<string, unknown>): PinchGesture<GestureName> {
    return new PinchGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      threshold: this.threshold,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
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
  }

  protected resetState(): void {
    this.isActive = false;
    this.state = {
      ...this.state,
      startDistance: 0,
      lastDistance: 0,
      lastScale: 1,
      lastTime: 0,
      velocity: 0,
      deltaScale: 0,
    };
  }

  /**
   * Handle pointer events for the pinch gesture
   */
  protected handlePointerEvent(pointers: Map<number, PointerData>, event: PointerEvent): void {
    const pointersArray = Array.from(pointers.values());

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);
    if (!targetElement) {
      return;
    }

    // Check if this gesture should be prevented by active gestures
    if (this.shouldPreventGesture(targetElement)) {
      if (this.isActive) {
        // If the gesture was active but now should be prevented, end it gracefully
        this.emitPinchEvent(targetElement, 'cancel', pointersArray, event);
        this.resetState();
      }
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    switch (event.type) {
      case 'pointerdown':
        if (relevantPointers.length >= 2 && !this.isActive) {
          // Calculate and store the starting distance between pointers
          const initialDistance = calculateAverageDistance(relevantPointers);
          this.state.startDistance = initialDistance;
          this.state.lastDistance = initialDistance;
          this.state.lastTime = event.timeStamp;

          // Store the original target element
          this.originalTarget = targetElement;
        }
        break;

      case 'pointermove':
        if (this.state.startDistance && relevantPointers.length >= this.minPointers) {
          // Calculate current distance between pointers
          const currentDistance = calculateAverageDistance(relevantPointers);

          // Calculate absolute distance change
          const distanceChange = Math.abs(currentDistance - this.state.lastDistance);

          // Only proceed if the distance between pointers has changed enough
          if (distanceChange !== 0 && distanceChange >= this.threshold) {
            // Calculate scale relative to starting distance
            const scale = this.state.startDistance ? currentDistance / this.state.startDistance : 1;

            // Calculate the relative scale change since last event
            const scaleChange = scale / this.state.lastScale;
            // Apply this change to the total accumulated scale
            this.state.totalScale *= scaleChange;
            // Calculate velocity (change in scale over time)
            const deltaTime = (event.timeStamp - this.state.lastTime) / 1000; // convert to seconds
            if (this.state.lastDistance) {
              const deltaDistance = currentDistance - this.state.lastDistance;
              const result = deltaDistance / deltaTime;
              this.state.velocity = Number.isNaN(result) ? 0 : result;
            }

            // Update state
            this.state.lastDistance = currentDistance;
            this.state.deltaScale = scale - this.state.lastScale;
            this.state.lastScale = scale;
            this.state.lastTime = event.timeStamp;

            if (!this.isActive) {
              // Mark gesture as active
              this.isActive = true;

              // Emit start event
              this.emitPinchEvent(targetElement, 'start', relevantPointers, event);
              this.emitPinchEvent(targetElement, 'ongoing', relevantPointers, event);
            } else {
              // Emit ongoing event
              this.emitPinchEvent(targetElement, 'ongoing', relevantPointers, event);
            }
          }
        }
        break;

      case 'pointerup':
      case 'pointercancel':
      case 'forceCancel':
        if (this.isActive) {
          const remainingPointers = relevantPointers.filter(
            (p) => p.type !== 'pointerup' && p.type !== 'pointercancel',
          );

          // If we have less than the minimum required pointers, end the gesture
          if (remainingPointers.length < this.minPointers) {
            if (event.type === 'pointercancel') {
              this.emitPinchEvent(targetElement, 'cancel', relevantPointers, event);
            }
            this.emitPinchEvent(targetElement, 'end', relevantPointers, event);

            // Reset state
            this.resetState();
          } else if (remainingPointers.length >= 2) {
            // If we still have enough pointers, update the start distance
            // to prevent jumping when a finger is lifted
            const newDistance = calculateAverageDistance(remainingPointers);
            this.state.startDistance = newDistance / this.state.lastScale;
          }
        }
        break;

      default:
        break;
    }
  }

  /**
   * Emit pinch-specific events with additional data
   */
  private emitPinchEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    // Calculate current centroid
    const centroid = calculateCentroid(pointers);

    // Create custom event data
    const distance = this.state.lastDistance;
    const scale = this.state.lastScale;

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    const customEventData: PinchGestureEventData = {
      gestureName: this.name,
      centroid,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      scale,
      deltaScale: this.state.deltaScale,
      totalScale: this.state.totalScale,
      distance,
      velocity: this.state.velocity,
      activeGestures,
      direction: getPinchDirection(this.state.velocity),
      customData: this.customData,
    };

    // Handle default event behavior
    if (this.preventDefault) {
      event.preventDefault();
    }

    if (this.stopPropagation) {
      event.stopPropagation();
    }

    // Event names to trigger
    const eventName = createEventName(this.name, phase);

    // Dispatch custom events on the element
    const domEvent = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: customEventData,
    });

    element.dispatchEvent(domEvent);
  }
}
