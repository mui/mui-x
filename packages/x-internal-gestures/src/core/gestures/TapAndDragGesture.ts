/**
 * TapAndDragGesture - Detects tap followed by drag gestures
 *
 * This gesture tracks a two-phase interaction:
 * 1. First, a tap (quick touch without movement) is detected
 * 2. Then, drag movements are tracked on the next pointer down
 *
 * The gesture fires events when:
 * - A tap is completed (tap phase)
 * - Drag movement begins and passes threshold (dragStart)
 * - Drag movement continues (drag)
 * - Drag movement ends (dragEnd)
 * - The gesture is canceled at any point
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { Direction } from '../types/Direction';
import { calculateCentroid, getDirection, isDirectionAllowed } from '../utils';

/**
 * Configuration options for TapAndDragGesture
 * Extends PointerGestureOptions with tap and drag specific settings
 */
export type TapAndDragGestureOptions<GestureName extends string> =
  PointerGestureOptions<GestureName> & {
    /**
     * Maximum distance in pixels a pointer can move during the tap phase for it to still be considered a tap
     * @default 10
     */
    tapMaxDistance?: number;

    /**
     * Maximum time in milliseconds between the tap completion and the start of the drag
     * If exceeded, the gesture will reset and wait for a new tap
     * @default 1000
     */
    dragTimeout?: number;

    /**
     * Distance threshold in pixels for drag activation.
     * The drag will only be recognized once the pointer has moved this many
     * pixels from its starting position in the drag phase.
     * @default 0
     */
    dragThreshold?: number;

    /**
     * Optional array of allowed directions for the drag gesture
     * If not specified, all directions are allowed
     */
    dragDirection?: Array<'up' | 'down' | 'left' | 'right'>;
  };

/**
 * Event data specific to tap and drag gesture events
 * Contains information about the gesture state, position, and movement
 */
export type TapAndDragGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** X coordinate of the tap */
  tapX: number;
  /** Y coordinate of the tap */
  tapY: number;
  /** The initial centroid position when the drag began (null during tap phase) */
  initialDragCentroid: { x: number; y: number } | null;
  /** Horizontal distance moved in pixels from last drag event */
  deltaX: number;
  /** Vertical distance moved in pixels from last drag event */
  deltaY: number;
  /** Total accumulated horizontal movement in pixels during drag */
  totalDeltaX: number;
  /** Total accumulated vertical movement in pixels during drag */
  totalDeltaY: number;
  /** The direction of drag movement with vertical and horizontal components */
  dragDirection: Direction;
  /** Horizontal velocity in pixels per second during drag */
  velocityX: number;
  /** Vertical velocity in pixels per second during drag */
  velocityY: number;
  /** Total velocity magnitude in pixels per second during drag */
  velocity: number;
};

/**
 * Type definition for the CustomEvent created by TapAndDragGesture
 */
export type TapAndDragEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<TapAndDragGestureEventData<CustomData>>;

/**
 * Represents the current phase of the TapAndDrag gesture
 */
export type TapAndDragPhase = 'waitingForTap' | 'tapDetected' | 'waitingForDrag' | 'dragging';

/**
 * State tracking for the TapAndDragGesture
 */
export type TapAndDragGestureState = GestureState & {
  /** Current phase of the tap and drag gesture */
  phase: TapAndDragPhase;
  /** The position where the tap was detected */
  tapPosition: { x: number; y: number } | null;
  /** The initial centroid position when the drag began */
  dragStartCentroid: { x: number; y: number } | null;
  /** The most recent centroid position during the drag */
  lastDragCentroid: { x: number; y: number } | null;
  /** Whether the drag movement threshold has been reached */
  dragThresholdReached: boolean;
  /** Total accumulated horizontal delta during drag */
  totalDeltaX: number;
  /** Total accumulated vertical delta during drag */
  totalDeltaY: number;
  /** Map of pointers that initiated the drag, used for tracking */
  dragStartPointers: Map<number, PointerData>;
  /** The last direction of drag movement detected */
  lastDragDirection: Direction;
  /** The last delta movement in pixels since the last drag event */
  lastDeltas: { x: number; y: number } | null;
  /** Timeout ID for the drag timeout */
  dragTimeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * TapAndDragGesture class for handling tap followed by drag interactions
 *
 * This gesture first detects a tap (quick touch without significant movement),
 * then waits for a subsequent drag interaction and tracks the drag movements.
 */
export class TapAndDragGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: TapAndDragGestureState = {
    phase: 'waitingForTap',
    tapPosition: null,
    dragStartCentroid: null,
    lastDragCentroid: null,
    dragThresholdReached: false,
    totalDeltaX: 0,
    totalDeltaY: 0,
    dragStartPointers: new Map(),
    lastDragDirection: {
      vertical: null,
      horizontal: null,
      mainAxis: null,
    },
    lastDeltas: null,
    dragTimeoutId: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: TapAndDragEvent;

  protected readonly optionsType!: TapAndDragGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    | 'phase'
    | 'tapPosition'
    | 'dragStartCentroid'
    | 'lastDragCentroid'
    | 'dragThresholdReached'
    | 'dragStartPointers'
    | 'lastDragDirection'
    | 'dragTimeoutId'
  >;

  /**
   * Maximum distance a pointer can move during tap for it to still be considered a tap
   */
  private tapMaxDistance: number;

  /**
   * Maximum time between tap completion and drag start
   */
  private dragTimeout: number;

  /**
   * Movement threshold for drag activation
   */
  private dragThreshold: number;

  /**
   * Allowed directions for the drag gesture
   */
  private dragDirection: Array<'up' | 'down' | 'left' | 'right'>;

  constructor(options: TapAndDragGestureOptions<GestureName>) {
    super(options);
    this.tapMaxDistance = options.tapMaxDistance ?? 10;
    this.dragTimeout = options.dragTimeout ?? 1000;
    this.dragThreshold = options.dragThreshold ?? 0;
    this.dragDirection = options.dragDirection || ['up', 'down', 'left', 'right'];
  }

  public clone(overrides?: Record<string, unknown>): TapAndDragGesture<GestureName> {
    return new TapAndDragGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      tapMaxDistance: this.tapMaxDistance,
      dragTimeout: this.dragTimeout,
      dragThreshold: this.dragThreshold,
      dragDirection: [...this.dragDirection],
      requiredKeys: [...this.requiredKeys],
      pointerMode: [...this.pointerMode],
      preventIf: [...this.preventIf],
      pointerOptions: structuredClone(this.pointerOptions),
      // Apply any overrides passed to the method
      ...overrides,
    });
  }

  public destroy(): void {
    if (this.state.dragTimeoutId !== null) {
      clearTimeout(this.state.dragTimeoutId);
    }
    this.resetState();
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.tapMaxDistance = options.tapMaxDistance ?? this.tapMaxDistance;
    this.dragTimeout = options.dragTimeout ?? this.dragTimeout;
    this.dragThreshold = options.dragThreshold ?? this.dragThreshold;
    this.dragDirection = options.dragDirection || this.dragDirection;
  }

  protected resetState(): void {
    if (this.state.dragTimeoutId !== null) {
      clearTimeout(this.state.dragTimeoutId);
    }

    this.isActive = false;
    this.state = {
      phase: 'waitingForTap',
      tapPosition: null,
      dragStartCentroid: null,
      lastDragCentroid: null,
      dragThresholdReached: false,
      totalDeltaX: 0,
      totalDeltaY: 0,
      dragStartPointers: new Map(),
      lastDragDirection: {
        vertical: null,
        horizontal: null,
        mainAxis: null,
      },
      lastDeltas: null,
      dragTimeoutId: null,
    };
  }

  /**
   * Handle pointer events for the tap and drag gesture
   */
  protected handlePointerEvent(pointers: Map<number, PointerData>, event: PointerEvent): void {
    const pointersArray = Array.from(pointers.values());

    // Check for our forceCancel event to handle interrupted gestures
    if (event.type === 'forceCancel') {
      this.cancel(event.target as null, pointersArray, event);
      return;
    }

    // Find which element (if any) is being targeted
    const targetElement = this.getTargetElement(event);
    if (!targetElement) {
      return;
    }

    // Check if this gesture should be prevented by active gestures
    if (this.shouldPreventGesture(targetElement, event.pointerType)) {
      this.cancel(targetElement, pointersArray, event);
      return;
    }

    // Filter pointers to only include those targeting our element or its children
    const relevantPointers = this.getRelevantPointers(pointersArray, targetElement);

    // Check if we have enough pointers and not too many
    if (relevantPointers.length < this.minPointers || relevantPointers.length > this.maxPointers) {
      if (this.isActive) {
        this.cancel(targetElement, relevantPointers, event);
      }
      return;
    }

    switch (event.type) {
      case 'pointerdown':
        this.handlePointerDown(targetElement, relevantPointers, event);
        break;

      case 'pointermove':
        this.handlePointerMove(targetElement, relevantPointers, event);
        break;

      case 'pointerup':
        this.handlePointerUp(targetElement, relevantPointers, event);
        break;

      case 'pointercancel':
      case 'forceCancel':
        this.cancel(targetElement, relevantPointers, event);
        break;

      default:
        break;
    }
  }

  /**
   * Handle pointer down events based on current phase
   */
  private handlePointerDown(
    targetElement: TargetElement,
    relevantPointers: PointerData[],
    _event: PointerEvent,
  ): void {
    switch (this.state.phase) {
      case 'waitingForTap':
        // Start tracking for potential tap
        this.state.tapPosition = calculateCentroid(relevantPointers);
        this.isActive = true;
        this.originalTarget = targetElement;
        break;

      case 'waitingForDrag':
        // Clear the drag timeout since we're starting to drag
        if (this.state.dragTimeoutId !== null) {
          clearTimeout(this.state.dragTimeoutId);
          this.state.dragTimeoutId = null;
        }

        // Start tracking for drag
        this.state.dragStartCentroid = calculateCentroid(relevantPointers);
        this.state.lastDragCentroid = { ...this.state.dragStartCentroid };

        // Store initial pointers for drag tracking
        relevantPointers.forEach((pointer) => {
          this.state.dragStartPointers.set(pointer.pointerId, pointer);
        });

        this.state.phase = 'dragging';
        break;

      case 'tapDetected':
      case 'dragging':
        // Ignore additional pointer downs during these phases
        break;

      default:
        break;
    }
  }

  /**
   * Handle pointer move events based on current phase
   */
  private handlePointerMove(
    targetElement: TargetElement,
    relevantPointers: PointerData[],
    event: PointerEvent,
  ): void {
    switch (this.state.phase) {
      case 'waitingForTap':
        if (this.isActive && this.state.tapPosition) {
          // Check if movement exceeds tap threshold
          const currentPosition = calculateCentroid(relevantPointers);
          const deltaX = currentPosition.x - this.state.tapPosition.x;
          const deltaY = currentPosition.y - this.state.tapPosition.y;
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

          if (distance > this.tapMaxDistance) {
            // Movement too large for a tap - cancel and reset
            this.resetState();
          }
        }
        break;

      case 'dragging':
        if (this.state.dragStartCentroid && relevantPointers.length >= this.minPointers) {
          this.processDragMovement(targetElement, relevantPointers, event);
        }
        break;

      case 'tapDetected':
      case 'waitingForDrag':
        // No movement handling needed in these phases
        break;

      default:
        break;
    }
  }

  /**
   * Handle pointer up events based on current phase
   */
  private handlePointerUp(
    targetElement: TargetElement,
    relevantPointers: PointerData[],
    event: PointerEvent,
  ): void {
    switch (this.state.phase) {
      case 'waitingForTap':
        if (this.isActive && this.state.tapPosition) {
          // Valid tap detected
          this.state.phase = 'tapDetected';
          this.fireTapEvent(targetElement, relevantPointers, event);

          // Set up timeout and transition to waiting for drag
          this.state.phase = 'waitingForDrag';
          this.state.dragTimeoutId = setTimeout(() => {
            // Timeout elapsed, reset the gesture
            this.resetState();
          }, this.dragTimeout);
        }
        break;

      case 'dragging':
        // End the drag
        if (this.state.dragThresholdReached) {
          // If we have fewer pointers than minimum, end the drag
          const activePointers = relevantPointers.filter(
            (p) => p.type !== 'pointerup' && p.type !== 'pointercancel',
          );

          if (activePointers.length < this.minPointers) {
            this.emitDragEvent(targetElement, 'end', relevantPointers, event);
            this.resetState();
          }
        } else {
          // Drag never reached threshold, just reset
          this.resetState();
        }
        break;

      case 'tapDetected':
      case 'waitingForDrag':
        // No action needed for pointer up in these phases
        break;

      default:
        break;
    }
  }

  /**
   * Process drag movement and emit appropriate events
   */
  private processDragMovement(
    targetElement: TargetElement,
    relevantPointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (!this.state.dragStartCentroid || !this.state.lastDragCentroid) {
      return;
    }

    // Calculate current centroid
    const currentCentroid = calculateCentroid(relevantPointers);

    // Calculate delta from drag start
    const distanceDeltaX = currentCentroid.x - this.state.dragStartCentroid.x;
    const distanceDeltaY = currentCentroid.y - this.state.dragStartCentroid.y;

    // Calculate movement distance from drag start
    const distance = Math.sqrt(distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY);

    // Determine movement direction
    const moveDirection = getDirection(this.state.lastDragCentroid, currentCentroid);

    // Calculate change in position since last move
    const lastDeltaX = currentCentroid.x - this.state.lastDragCentroid.x;
    const lastDeltaY = currentCentroid.y - this.state.lastDragCentroid.y;

    // Check if movement passes the threshold and is in an allowed direction
    if (
      !this.state.dragThresholdReached &&
      distance >= this.dragThreshold &&
      isDirectionAllowed(moveDirection, this.dragDirection)
    ) {
      this.state.dragThresholdReached = true;

      // Update delta tracking
      this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
      this.state.totalDeltaX += lastDeltaX;
      this.state.totalDeltaY += lastDeltaY;

      // Emit drag start event
      this.emitDragEvent(targetElement, 'start', relevantPointers, event);
    } else if (this.state.dragThresholdReached) {
      // Continue tracking movement
      this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
      this.state.totalDeltaX += lastDeltaX;
      this.state.totalDeltaY += lastDeltaY;

      // Emit ongoing drag event
      this.emitDragEvent(targetElement, 'ongoing', relevantPointers, event);
    }

    // Update last centroid and direction
    this.state.lastDragCentroid = currentCentroid;
    this.state.lastDragDirection = moveDirection;
  }

  /**
   * Fire the tap event when a valid tap is detected
   */
  private fireTapEvent(element: TargetElement, pointers: PointerData[], event: PointerEvent): void {
    if (!this.state.tapPosition) {
      return;
    }

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data for the tap event
    const customEventData: TapAndDragGestureEventData = {
      gestureName: this.name,
      centroid: this.state.tapPosition,
      target: event.target,
      srcEvent: event,
      phase: 'end', // Tap phase is complete
      pointers,
      timeStamp: event.timeStamp,
      tapX: this.state.tapPosition.x,
      tapY: this.state.tapPosition.y,
      initialDragCentroid: null, // No drag yet
      deltaX: 0,
      deltaY: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      dragDirection: {
        vertical: null,
        horizontal: null,
        mainAxis: null,
      },
      velocityX: 0,
      velocityY: 0,
      velocity: 0,
      activeGestures,
      customData: this.customData,
    };

    // Dispatch tap event
    const tapEventName = `${this.name}Tap`;
    const domEvent = new CustomEvent(tapEventName, {
      bubbles: true,
      cancelable: true,
      composed: true,
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
   * Emit drag-specific events with movement data
   */
  private emitDragEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (!this.state.tapPosition || !this.state.dragStartCentroid || !this.state.lastDragCentroid) {
      return;
    }

    const deltaX = this.state.lastDeltas?.x ?? 0;
    const deltaY = this.state.lastDeltas?.y ?? 0;

    // Calculate velocity - time difference in seconds
    const firstPointer = this.state.dragStartPointers.values().next().value;
    const timeElapsed = firstPointer ? (event.timeStamp - firstPointer.timeStamp) / 1000 : 0;
    const velocityX = timeElapsed > 0 ? deltaX / timeElapsed : 0;
    const velocityY = timeElapsed > 0 ? deltaY / timeElapsed : 0;
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data
    const customEventData: TapAndDragGestureEventData = {
      gestureName: this.name,
      centroid: this.state.lastDragCentroid,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      tapX: this.state.tapPosition.x,
      tapY: this.state.tapPosition.y,
      initialDragCentroid: this.state.dragStartCentroid,
      deltaX,
      deltaY,
      totalDeltaX: this.state.totalDeltaX,
      totalDeltaY: this.state.totalDeltaY,
      dragDirection: this.state.lastDragDirection,
      velocityX,
      velocityY,
      velocity,
      activeGestures,
      customData: this.customData,
    };

    // Event name based on phase (dragStart, drag, dragEnd, dragCancel)
    const phaseName =
      phase === 'ongoing' ? 'drag' : `drag${phase.charAt(0).toUpperCase() + phase.slice(1)}`;
    const dragEventName = `${this.name}${phaseName.charAt(0).toUpperCase() + phaseName.slice(1)}`;

    // Dispatch custom event
    const domEvent = new CustomEvent(dragEventName, {
      bubbles: true,
      cancelable: true,
      composed: true,
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
    if (this.isActive && this.state.phase === 'dragging' && this.state.dragThresholdReached) {
      const el = element ?? this.element;
      this.emitDragEvent(el, 'cancel', pointers, event);
    }
    this.resetState();
  }
}
