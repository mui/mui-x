/**
 * PanGesture - Detects panning (dragging) movements
 *
 * This gesture tracks pointer dragging movements across elements, firing events when:
 * - The drag movement begins and passes the threshold distance (start)
 * - The drag movement continues (ongoing)
 * - The drag movement ends (end)
 *
 * The gesture can be configured to recognize movement only in specific directions.
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { calculateCentroid, createEventName, getDirection, isDirectionAllowed } from '../utils';

/**
 * The direction of movement for the pan gesture
 * This type defines the detected directions based on the vertical and horizontal components
 * The values can be 'up', 'down', 'left', 'right' or null if not applicable.
 *
 * The null values indicate that the gesture is not moving in that direction.
 */
export type Direction = {
  vertical: 'up' | 'down' | null;
  horizontal: 'left' | 'right' | null;
  mainAxis: 'horizontal' | 'vertical' | 'diagonal' | null;
};

/**
 * Configuration options for PanGesture
 * Extends PointerGestureOptions with direction constraints
 */
export type PanGestureOptions<GestureName extends string> = PointerGestureOptions<GestureName> & {
  /**
   * Optional array of allowed directions for the pan gesture
   * If not specified, all directions are allowed
   */
  direction?: Array<'up' | 'down' | 'left' | 'right'>;

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
 * Event data specific to pan gesture events
 * Contains information about movement distance, direction, and velocity
 */
export type PanGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** The centroid position at the start of the gesture */
  initialCentroid: { x: number; y: number };
  /** Horizontal distance moved in pixels from last event */
  deltaX: number;
  /** Vertical distance moved in pixels from last event */
  deltaY: number;
  /** Total accumulated horizontal movement in pixels */
  totalDeltaX: number;
  /** Total accumulated vertical movement in pixels */
  totalDeltaY: number;
  /** Horizontal distance moved in pixels from the start of the current gesture */
  activeDeltaX: number;
  /** Vertical distance moved in pixels from the start of the current gesture */
  activeDeltaY: number;
  /** The direction of movement with vertical and horizontal components */
  direction: Direction;
  /** Horizontal velocity in pixels per second */
  velocityX: number;
  /** Vertical velocity in pixels per second */
  velocityY: number;
  /** Total velocity magnitude in pixels per second */
  velocity: number;
};

/**
 * Type definition for the CustomEvent created by PanGesture
 */
export type PanEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<PanGestureEventData<CustomData>>;

/**
 * State tracking for the PanGesture
 */
export type PanGestureState = GestureState & {
  /** The initial centroid position when the gesture began */
  startCentroid: { x: number; y: number } | null;
  /** The most recent centroid position during the gesture */
  lastCentroid: { x: number; y: number } | null;
  /** Whether the movement threshold has been reached to activate the gesture */
  movementThresholdReached: boolean;
  /** Total accumulated horizontal delta since gesture tracking began */
  totalDeltaX: number;
  /** Total accumulated vertical delta since gesture tracking began */
  totalDeltaY: number;
  /** Active horizontal delta since the start of the current gesture */
  activeDeltaX: number;
  /** Active vertical delta since the start of the current gesture */
  activeDeltaY: number;
  /** Map of pointers that initiated the gesture, used for tracking state */
  startPointers: Map<number, PointerData>;
  /** The last direction of movement detected */
  lastDirection: Direction;
  /** The last delta movement in pixels since the last event */
  lastDeltas: { x: number; y: number } | null;
};

/**
 * PanGesture class for handling panning/dragging interactions
 *
 * This gesture detects when users drag across elements with one or more pointers,
 * and dispatches directional movement events with delta and velocity information.
 */
export class PanGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: PanGestureState = {
    startPointers: new Map(),
    startCentroid: null,
    lastCentroid: null,
    movementThresholdReached: false,
    totalDeltaX: 0,
    totalDeltaY: 0,
    activeDeltaX: 0,
    activeDeltaY: 0,
    lastDirection: {
      vertical: null,
      horizontal: null,
      mainAxis: null,
    },
    lastDeltas: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: PanEvent;

  protected readonly optionsType!: PanGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    | 'startPointers'
    | 'startCentroid'
    | 'lastCentroid'
    | 'movementThresholdReached'
    | 'lastDirection'
  >;

  /**
   * Movement threshold in pixels that must be exceeded before the gesture activates.
   * Higher values reduce false positive gesture detection for small movements.
   */
  protected threshold: number;

  /**
   * Allowed directions for the pan gesture
   * Default allows all directions
   */
  private direction: Array<'up' | 'down' | 'left' | 'right'>;

  constructor(options: PanGestureOptions<GestureName>) {
    super(options);
    this.direction = options.direction || ['up', 'down', 'left', 'right'];
    this.threshold = options.threshold || 0;
  }

  public clone(overrides?: Record<string, unknown>): PanGesture<GestureName> {
    return new PanGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      threshold: this.threshold,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      direction: [...this.direction],
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

    this.direction = options.direction || this.direction;
  }

  protected resetState(): void {
    this.isActive = false;
    this.state = {
      ...this.state,
      startPointers: new Map(),
      startCentroid: null,
      lastCentroid: null,
      lastDeltas: null,
      activeDeltaX: 0,
      activeDeltaY: 0,
      movementThresholdReached: false,
      lastDirection: {
        vertical: null,
        horizontal: null,
        mainAxis: null,
      },
    };
  }

  /**
   * Handle pointer events for the pan gesture
   */
  protected handlePointerEvent(pointers: Map<number, PointerData>, event: PointerEvent): void {
    const pointersArray = Array.from(pointers.values());

    // Check for our forceCancel event to handle interrupted gestures (from contextmenu, blur)
    if (event.type === 'forceCancel') {
      // Reset all active pan gestures when we get a force reset event
      this.cancel(event.target as null, pointersArray, event);
      return;
    }

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);

    if (!targetElement) {
      return;
    }

    // Check if this gesture should be prevented by active gestures
    if (this.shouldPreventGesture(targetElement)) {
      // If the gesture was active but now should be prevented, cancel it gracefully
      this.cancel(targetElement, pointersArray, event);
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    // Check if we have enough pointers and not too many
    if (relevantPointers.length < this.minPointers || relevantPointers.length > this.maxPointers) {
      // Cancel or end the gesture if it was active
      this.cancel(targetElement, relevantPointers, event);
      return;
    }

    switch (event.type) {
      case 'pointerdown':
        if (!this.isActive && !this.state.startCentroid) {
          // Store initial pointers
          relevantPointers.forEach((pointer) => {
            this.state.startPointers.set(pointer.pointerId, pointer);
          });

          // Store the original target element
          this.originalTarget = targetElement;

          // Calculate and store the starting centroid
          this.state.startCentroid = calculateCentroid(relevantPointers);
          this.state.lastCentroid = { ...this.state.startCentroid };
        }
        break;

      case 'pointermove':
        if (this.state.startCentroid && relevantPointers.length >= this.minPointers) {
          // Calculate current centroid
          const currentCentroid = calculateCentroid(relevantPointers);

          // Calculate delta from start
          const distanceDeltaX = currentCentroid.x - this.state.startCentroid.x;
          const distanceDeltaY = currentCentroid.y - this.state.startCentroid.y;

          // Calculate movement distance
          const distance = Math.sqrt(
            distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY,
          );

          // Determine movement direction
          const moveDirection = getDirection(
            this.state.lastCentroid ?? this.state.startCentroid,
            currentCentroid,
          );

          // Calculate change in position since last move
          const lastDeltaX = this.state.lastCentroid
            ? currentCentroid.x - this.state.lastCentroid.x
            : 0;
          const lastDeltaY = this.state.lastCentroid
            ? currentCentroid.y - this.state.lastCentroid.y
            : 0;

          // Check if movement passes the threshold and is in an allowed direction
          if (
            !this.state.movementThresholdReached &&
            distance >= this.threshold &&
            isDirectionAllowed(moveDirection, this.direction)
          ) {
            this.state.movementThresholdReached = true;
            this.isActive = true;

            // Update total accumulated delta
            this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
            this.state.totalDeltaX += lastDeltaX;
            this.state.totalDeltaY += lastDeltaY;
            this.state.activeDeltaX += lastDeltaX;
            this.state.activeDeltaY += lastDeltaY;

            // Emit start event
            this.emitPanEvent(targetElement, 'start', relevantPointers, event, currentCentroid);
            this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
          }
          // If we've already crossed the threshold, continue tracking
          else if (this.state.movementThresholdReached && this.isActive) {
            // Update total accumulated delta
            this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
            this.state.totalDeltaX += lastDeltaX;
            this.state.totalDeltaY += lastDeltaY;
            this.state.activeDeltaX += lastDeltaX;
            this.state.activeDeltaY += lastDeltaY;

            // Emit ongoing event
            this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event, currentCentroid);
          }

          // Update last centroid
          this.state.lastCentroid = currentCentroid;
          this.state.lastDirection = moveDirection;
        }
        break;

      case 'pointerup':
      case 'pointercancel':
      case 'forceCancel':
        // If the gesture was active (threshold was reached), emit end event
        if (this.isActive && this.state.movementThresholdReached) {
          // If we have less than the minimum required pointers, end the gesture
          if (
            relevantPointers.filter((p) => p.type !== 'pointerup' && p.type !== 'pointercancel')
              .length < this.minPointers
          ) {
            // End the gesture
            const currentCentroid = this.state.lastCentroid || this.state.startCentroid!;
            if (event.type === 'pointercancel') {
              this.emitPanEvent(targetElement, 'cancel', relevantPointers, event, currentCentroid);
            }
            this.emitPanEvent(targetElement, 'end', relevantPointers, event, currentCentroid);
            this.resetState();
          }
        } else {
          this.resetState();
        }
        break;

      default:
        break;
    }
  }

  /**
   * Emit pan-specific events with additional data
   */
  private emitPanEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
    currentCentroid: { x: number; y: number },
  ): void {
    if (!this.state.startCentroid) {
      return;
    }

    const deltaX = this.state.lastDeltas?.x ?? 0;
    const deltaY = this.state.lastDeltas?.y ?? 0;

    // Calculate velocity - time difference in seconds
    const firstPointer = this.state.startPointers.values().next().value;
    const timeElapsed = firstPointer ? (event.timeStamp - firstPointer.timeStamp) / 1000 : 0;
    const velocityX = timeElapsed > 0 ? deltaX / timeElapsed : 0;
    const velocityY = timeElapsed > 0 ? deltaY / timeElapsed : 0;
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data
    const customEventData: PanGestureEventData = {
      gestureName: this.name,
      initialCentroid: this.state.startCentroid,
      centroid: currentCentroid,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      deltaX,
      deltaY,
      direction: this.state.lastDirection,
      velocityX,
      velocityY,
      velocity,
      totalDeltaX: this.state.totalDeltaX,
      totalDeltaY: this.state.totalDeltaY,
      activeDeltaX: this.state.activeDeltaX,
      activeDeltaY: this.state.activeDeltaY,
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
   * Cancel the current gesture
   */
  private cancel(
    element: TargetElement | null,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (this.isActive) {
      const el = element ?? this.element;
      this.emitPanEvent(el, 'cancel', pointers, event, this.state.lastCentroid!);
      this.emitPanEvent(el, 'end', pointers, event, this.state.lastCentroid!);
    }
    this.resetState();
  }
}
