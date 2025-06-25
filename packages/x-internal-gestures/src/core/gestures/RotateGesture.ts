/**
 * RotateGesture - Detects rotation movements between two or more pointers
 *
 * This gesture tracks when multiple pointers rotate around a common center point, firing events when:
 * - Two or more pointers begin a rotation motion (start)
 * - The pointers continue rotating (ongoing)
 * - One or more pointers are released or lifted (end)
 *
 * This gesture is commonly used for rotation controls in drawing or image manipulation interfaces.
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, calculateRotationAngle, createEventName } from '../utils';

/**
 * Configuration options for the RotateGesture
 * Uses the same options as the base PointerGesture
 */
export type RotateGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName>;

/**
 * Event data specific to rotate gesture events
 * Contains information about rotation angle, delta, and velocity
 */
export type RotateGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** Current absolute rotation in degrees (0-359) */
  rotation: number;
  /** Change in rotation since the last event in degrees */
  delta: number;
  /** Total accumulated rotation in degrees across all gesture interactions */
  totalRotation: number;
  /** Angular velocity in degrees per second */
  velocity: number;
};

/**
 * Type definition for the CustomEvent created by RotateGesture
 */
export type RotateEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<RotateGestureEventData<CustomData>>;

/**
 * State tracking for the RotateGesture
 */
export type RotateGestureState = GestureState & {
  /** The initial angle between pointers when the gesture began */
  startAngle: number;
  /** The most recent angle between pointers during the gesture */
  lastAngle: number;
  /** Accumulated rotation in degrees (can exceed 360° for multiple rotations) */
  totalRotation: number;
  /** Timestamp of the last rotate event, used for velocity calculation */
  lastTime: number;
  /** Current angular velocity in degrees per second */
  velocity: number;
  /** The most recent change in angle since the last event */
  lastDelta: number;
};

/**
 * RotateGesture class for handling rotation interactions
 *
 * This gesture detects when users rotate multiple pointers around a central point,
 * and dispatches rotation-related events with angle and angular velocity information.
 */
export class RotateGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: RotateGestureState = {
    startAngle: 0,
    lastAngle: 0,
    totalRotation: 0,
    lastTime: 0,
    velocity: 0,
    lastDelta: 0,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: RotateEvent;

  protected readonly optionsType!: RotateGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    'startAngle' | 'lastAngle' | 'lastTime' | 'velocity' | 'lastDelta'
  >;

  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(options: RotateGestureOptions<GestureName>) {
    super(options);
  }

  public clone(overrides?: Record<string, unknown>): RotateGesture<GestureName> {
    return new RotateGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
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

  protected resetState() {
    this.isActive = false;
    this.state = {
      ...this.state,
      startAngle: 0,
      lastAngle: 0,
      lastTime: 0,
      velocity: 0,
      lastDelta: 0,
    };
  }

  /**
   * Handle pointer events for the rotate gesture
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
        this.emitRotateEvent(targetElement, 'cancel', pointersArray, event);
        this.resetState();
      }
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    // Check if we have enough pointers for a rotation (at least 2)
    if (relevantPointers.length < this.minPointers || relevantPointers.length > this.maxPointers) {
      if (this.isActive) {
        // End the gesture if it was active
        this.emitRotateEvent(targetElement, 'end', relevantPointers, event);
        this.resetState();
      }
      return;
    }

    switch (event.type) {
      case 'pointerdown':
        if (relevantPointers.length >= 2 && !this.isActive) {
          // Calculate and store the starting angle
          const initialAngle = calculateRotationAngle(relevantPointers);
          this.state.startAngle = initialAngle;
          this.state.lastAngle = initialAngle;
          this.state.lastTime = event.timeStamp;

          // Store the original target element
          this.originalTarget = targetElement;
        }
        break;

      case 'pointermove':
        if (relevantPointers.length >= 2) {
          // Calculate current rotation angle
          const currentAngle = calculateRotationAngle(relevantPointers);

          // Calculate rotation delta (change in angle)
          let delta = currentAngle - this.state.lastAngle;

          // Adjust for angle wrapping (event.g., from 359° to 0°)
          if (delta > 180) {
            delta -= 360;
          }
          if (delta < -180) {
            delta += 360;
          }

          // Store the delta for use in emitRotateEvent
          this.state.lastDelta = delta;

          // Update rotation value (cumulative)
          this.state.totalRotation += delta;

          // Calculate angular velocity (degrees per second)
          const deltaTime = (event.timeStamp - this.state.lastTime) / 1000; // convert to seconds
          if (deltaTime > 0) {
            this.state.velocity = delta / deltaTime;
          }

          // Update state
          this.state.lastAngle = currentAngle;
          this.state.lastTime = event.timeStamp;

          // Emit ongoing event if there's an actual rotation
          // We don't want to emit events for tiny movements that might be just noise
          if (Math.abs(delta) <= 0.1) {
            return;
          }

          if (!this.isActive) {
            this.isActive = true;
            // Emit start event
            this.emitRotateEvent(targetElement, 'start', relevantPointers, event);
            this.emitRotateEvent(targetElement, 'ongoing', relevantPointers, event);
          } else {
            this.emitRotateEvent(targetElement, 'ongoing', relevantPointers, event);
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
              this.emitRotateEvent(targetElement, 'cancel', relevantPointers, event);
            }
            this.emitRotateEvent(targetElement, 'end', relevantPointers, event);

            // Reset state
            this.resetState();
          } else if (remainingPointers.length >= 2) {
            // If we still have enough pointers, update the start angle
            // to prevent jumping when a finger is lifted
            const newAngle = calculateRotationAngle(remainingPointers);
            this.state.startAngle = newAngle - this.state.totalRotation;
            this.state.lastAngle = newAngle;
          }
        }
        break;

      default:
        break;
    }
  }

  /**
   * Emit rotate-specific events with additional data
   */
  private emitRotateEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    // Calculate current centroid
    const centroid = calculateCentroid(pointers);

    // Create custom event data
    const rotation = this.state.totalRotation;

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    const customEventData: RotateGestureEventData = {
      gestureName: this.name,
      centroid,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      rotation,
      delta: this.state.lastDelta,
      totalRotation: this.state.totalRotation,
      velocity: this.state.velocity,
      activeGestures,
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
