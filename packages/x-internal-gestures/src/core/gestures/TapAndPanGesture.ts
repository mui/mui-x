/**
 * TapAndPanGesture - Detects tap followed by pan gestures
 *
 * This gesture tracks a two-phase interaction:
 * 1. First, a tap (quick touch without movement) is detected
 * 2. Then, panning movements are tracked on the next pointer down
 *
 * The gesture fires events when:
 * - A tap is completed (tap phase)
 * - Pan movement begins and passes threshold (panStart)
 * - Pan movement continues (pan)
 * - Pan movement ends (panEnd)
 * - The gesture is canceled at any point
 */

import { GesturePhase, GestureState } from '../Gesture';
import { PointerGesture, PointerGestureEventData, PointerGestureOptions } from '../PointerGesture';
import { PointerData } from '../PointerManager';
import { TargetElement } from '../types/TargetElement';
import { Direction } from '../types/Direction';
import { calculateCentroid, getDirection, isDirectionAllowed } from '../utils';

/**
 * Configuration options for TapAndPanGesture
 * Extends PointerGestureOptions with tap and pan specific settings
 */
export type TapAndPanGestureOptions<GestureName extends string> =
  PointerGestureOptions<GestureName> & {
    /**
     * Maximum distance in pixels a pointer can move during the tap phase for it to still be considered a tap
     * @default 10
     */
    tapMaxDistance?: number;

    /**
     * Maximum time in milliseconds between the tap completion and the start of the pan
     * If exceeded, the gesture will reset and wait for a new tap
     * @default 1000
     */
    panTimeout?: number;

    /**
     * Distance threshold in pixels for pan activation.
     * The pan will only be recognized once the pointer has moved this many
     * pixels from its starting position in the pan phase.
     * @default 0
     */
    panThreshold?: number;

    /**
     * Optional array of allowed directions for the pan gesture
     * If not specified, all directions are allowed
     */
    panDirection?: Array<'up' | 'down' | 'left' | 'right'>;
  };

/**
 * Event data specific to tap and pan gesture events
 * Contains information about the gesture state, position, and movement
 */
export type TapAndPanGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PointerGestureEventData<CustomData> & {
  /** X coordinate of the tap */
  tapX: number;
  /** Y coordinate of the tap */
  tapY: number;
  /** The initial centroid position when the pan began (null during tap phase) */
  initialPanCentroid: { x: number; y: number } | null;
  /** Horizontal distance moved in pixels from last pan event */
  deltaX: number;
  /** Vertical distance moved in pixels from last pan event */
  deltaY: number;
  /** Total accumulated horizontal movement in pixels during pan */
  totalDeltaX: number;
  /** Total accumulated vertical movement in pixels during pan */
  totalDeltaY: number;
  /** The direction of pan movement with vertical and horizontal components */
  panDirection: Direction;
  /** Horizontal velocity in pixels per second during pan */
  velocityX: number;
  /** Vertical velocity in pixels per second during pan */
  velocityY: number;
  /** Total velocity magnitude in pixels per second during pan */
  velocity: number;
};

/**
 * Type definition for the CustomEvent created by TapAndPanGesture
 */
export type TapAndPanEvent<CustomData extends Record<string, unknown> = Record<string, unknown>> =
  CustomEvent<TapAndPanGestureEventData<CustomData>>;

/**
 * Represents the current phase of the TapAndPan gesture
 */
export type TapAndPanPhase = 'waitingForTap' | 'tapDetected' | 'waitingForPan' | 'panning';

/**
 * State tracking for the TapAndPanGesture
 */
export type TapAndPanGestureState = GestureState & {
  /** Current phase of the tap and pan gesture */
  phase: TapAndPanPhase;
  /** The position where the tap was detected */
  tapPosition: { x: number; y: number } | null;
  /** The initial centroid position when the pan began */
  panStartCentroid: { x: number; y: number } | null;
  /** The most recent centroid position during the pan */
  lastPanCentroid: { x: number; y: number } | null;
  /** Whether the pan movement threshold has been reached */
  panThresholdReached: boolean;
  /** Total accumulated horizontal delta during pan */
  totalDeltaX: number;
  /** Total accumulated vertical delta during pan */
  totalDeltaY: number;
  /** Map of pointers that initiated the pan, used for tracking */
  panStartPointers: Map<number, PointerData>;
  /** The last direction of pan movement detected */
  lastPanDirection: Direction;
  /** The last delta movement in pixels since the last pan event */
  lastDeltas: { x: number; y: number } | null;
  /** Timeout ID for the pan timeout */
  panTimeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * TapAndPanGesture class for handling tap followed by pan interactions
 *
 * This gesture first detects a tap (quick touch without significant movement),
 * then waits for a subsequent pan interaction and tracks the pan movements.
 */
export class TapAndPanGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: TapAndPanGestureState = {
    phase: 'waitingForTap',
    tapPosition: null,
    panStartCentroid: null,
    lastPanCentroid: null,
    panThresholdReached: false,
    totalDeltaX: 0,
    totalDeltaY: 0,
    panStartPointers: new Map(),
    lastPanDirection: {
      vertical: null,
      horizontal: null,
      mainAxis: null,
    },
    lastDeltas: null,
    panTimeoutId: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: TapAndPanEvent;

  protected readonly optionsType!: TapAndPanGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<
    Partial<typeof this.state>,
    | 'phase'
    | 'tapPosition'
    | 'panStartCentroid'
    | 'lastPanCentroid'
    | 'panThresholdReached'
    | 'panStartPointers'
    | 'lastPanDirection'
    | 'panTimeoutId'
  >;

  /**
   * Maximum distance a pointer can move during tap for it to still be considered a tap
   */
  private tapMaxDistance: number;

  /**
   * Maximum time between tap completion and pan start
   */
  private panTimeout: number;

  /**
   * Movement threshold for pan activation
   */
  private panThreshold: number;

  /**
   * Allowed directions for the pan gesture
   */
  private panDirection: Array<'up' | 'down' | 'left' | 'right'>;

  constructor(options: TapAndPanGestureOptions<GestureName>) {
    super(options);
    this.tapMaxDistance = options.tapMaxDistance ?? 10;
    this.panTimeout = options.panTimeout ?? 1000;
    this.panThreshold = options.panThreshold ?? 0;
    this.panDirection = options.panDirection || ['up', 'down', 'left', 'right'];
  }

  public clone(overrides?: Record<string, unknown>): TapAndPanGesture<GestureName> {
    return new TapAndPanGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      tapMaxDistance: this.tapMaxDistance,
      panTimeout: this.panTimeout,
      panThreshold: this.panThreshold,
      panDirection: [...this.panDirection],
      requiredKeys: [...this.requiredKeys],
      pointerMode: [...this.pointerMode],
      preventIf: [...this.preventIf],
      pointerOptions: structuredClone(this.pointerOptions),
      // Apply any overrides passed to the method
      ...overrides,
    });
  }

  public destroy(): void {
    if (this.state.panTimeoutId !== null) {
      clearTimeout(this.state.panTimeoutId);
    }
    this.resetState();
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.tapMaxDistance = options.tapMaxDistance ?? this.tapMaxDistance;
    this.panTimeout = options.panTimeout ?? this.panTimeout;
    this.panThreshold = options.panThreshold ?? this.panThreshold;
    this.panDirection = options.panDirection || this.panDirection;
  }

  protected resetState(): void {
    if (this.state.panTimeoutId !== null) {
      clearTimeout(this.state.panTimeoutId);
    }

    this.isActive = false;
    this.state = {
      phase: 'waitingForTap',
      tapPosition: null,
      panStartCentroid: null,
      lastPanCentroid: null,
      panThresholdReached: false,
      totalDeltaX: 0,
      totalDeltaY: 0,
      panStartPointers: new Map(),
      lastPanDirection: {
        vertical: null,
        horizontal: null,
        mainAxis: null,
      },
      lastDeltas: null,
      panTimeoutId: null,
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

      case 'waitingForPan':
        // Clear the pan timeout since we're starting to pan
        if (this.state.panTimeoutId !== null) {
          clearTimeout(this.state.panTimeoutId);
          this.state.panTimeoutId = null;
        }

        // Start tracking for pan
        this.state.panStartCentroid = calculateCentroid(relevantPointers);
        this.state.lastPanCentroid = { ...this.state.panStartCentroid };

        // Store initial pointers for pan tracking
        relevantPointers.forEach((pointer) => {
          this.state.panStartPointers.set(pointer.pointerId, pointer);
        });

        this.state.phase = 'panning';
        break;

      case 'tapDetected':
      case 'panning':
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

      case 'panning':
        if (this.state.panStartCentroid && relevantPointers.length >= this.minPointers) {
          this.processPanMovement(targetElement, relevantPointers, event);
        }
        break;

      case 'tapDetected':
      case 'waitingForPan':
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

          // Set up timeout and transition to waiting for pan
          this.state.phase = 'waitingForPan';
          this.state.panTimeoutId = setTimeout(() => {
            // Timeout elapsed, reset the gesture
            this.resetState();
          }, this.panTimeout);
        }
        break;

      case 'panning':
        // End the pan
        if (this.state.panThresholdReached) {
          // If we have fewer pointers than minimum, end the pan
          const activePointers = relevantPointers.filter(
            (p) => p.type !== 'pointerup' && p.type !== 'pointercancel',
          );

          if (activePointers.length < this.minPointers) {
            this.emitPanEvent(targetElement, 'end', relevantPointers, event);
            this.resetState();
          }
        } else {
          // Pan never reached threshold, just reset
          this.resetState();
        }
        break;

      case 'tapDetected':
      case 'waitingForPan':
        // No action needed for pointer up in these phases
        break;

      default:
        break;
    }
  }

  /**
   * Process pan movement and emit appropriate events
   */
  private processPanMovement(
    targetElement: TargetElement,
    relevantPointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (!this.state.panStartCentroid || !this.state.lastPanCentroid) {
      return;
    }

    // Calculate current centroid
    const currentCentroid = calculateCentroid(relevantPointers);

    // Calculate delta from pan start
    const distanceDeltaX = currentCentroid.x - this.state.panStartCentroid.x;
    const distanceDeltaY = currentCentroid.y - this.state.panStartCentroid.y;

    // Calculate movement distance from pan start
    const distance = Math.sqrt(distanceDeltaX * distanceDeltaX + distanceDeltaY * distanceDeltaY);

    // Determine movement direction
    const moveDirection = getDirection(this.state.lastPanCentroid, currentCentroid);

    // Calculate change in position since last move
    const lastDeltaX = currentCentroid.x - this.state.lastPanCentroid.x;
    const lastDeltaY = currentCentroid.y - this.state.lastPanCentroid.y;

    // Check if movement passes the threshold and is in an allowed direction
    if (
      !this.state.panThresholdReached &&
      distance >= this.panThreshold &&
      isDirectionAllowed(moveDirection, this.panDirection)
    ) {
      this.state.panThresholdReached = true;

      // Update delta tracking
      this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
      this.state.totalDeltaX += lastDeltaX;
      this.state.totalDeltaY += lastDeltaY;

      // Emit pan start event
      this.emitPanEvent(targetElement, 'start', relevantPointers, event);
    } else if (this.state.panThresholdReached) {
      // Continue tracking movement
      this.state.lastDeltas = { x: lastDeltaX, y: lastDeltaY };
      this.state.totalDeltaX += lastDeltaX;
      this.state.totalDeltaY += lastDeltaY;

      // Emit ongoing pan event
      this.emitPanEvent(targetElement, 'ongoing', relevantPointers, event);
    }

    // Update last centroid and direction
    this.state.lastPanCentroid = currentCentroid;
    this.state.lastPanDirection = moveDirection;
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
    const customEventData: TapAndPanGestureEventData = {
      gestureName: this.name,
      centroid: this.state.tapPosition,
      target: event.target,
      srcEvent: event,
      phase: 'end', // Tap phase is complete
      pointers,
      timeStamp: event.timeStamp,
      tapX: this.state.tapPosition.x,
      tapY: this.state.tapPosition.y,
      initialPanCentroid: null, // No pan yet
      deltaX: 0,
      deltaY: 0,
      totalDeltaX: 0,
      totalDeltaY: 0,
      panDirection: {
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
   * Emit pan-specific events with movement data
   */
  private emitPanEvent(
    element: TargetElement,
    phase: GesturePhase,
    pointers: PointerData[],
    event: PointerEvent,
  ): void {
    if (!this.state.tapPosition || !this.state.panStartCentroid || !this.state.lastPanCentroid) {
      return;
    }

    const deltaX = this.state.lastDeltas?.x ?? 0;
    const deltaY = this.state.lastDeltas?.y ?? 0;

    // Calculate velocity - time difference in seconds
    const firstPointer = this.state.panStartPointers.values().next().value;
    const timeElapsed = firstPointer ? (event.timeStamp - firstPointer.timeStamp) / 1000 : 0;
    const velocityX = timeElapsed > 0 ? deltaX / timeElapsed : 0;
    const velocityY = timeElapsed > 0 ? deltaY / timeElapsed : 0;
    const velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);

    // Get list of active gestures
    const activeGestures = this.gesturesRegistry.getActiveGestures(element);

    // Create custom event data
    const customEventData: TapAndPanGestureEventData = {
      gestureName: this.name,
      centroid: this.state.lastPanCentroid,
      target: event.target,
      srcEvent: event,
      phase,
      pointers,
      timeStamp: event.timeStamp,
      tapX: this.state.tapPosition.x,
      tapY: this.state.tapPosition.y,
      initialPanCentroid: this.state.panStartCentroid,
      deltaX,
      deltaY,
      totalDeltaX: this.state.totalDeltaX,
      totalDeltaY: this.state.totalDeltaY,
      panDirection: this.state.lastPanDirection,
      velocityX,
      velocityY,
      velocity,
      activeGestures,
      customData: this.customData,
    };

    // Event name based on phase (panStart, pan, panEnd, panCancel)
    const phaseName =
      phase === 'ongoing' ? 'pan' : `pan${phase.charAt(0).toUpperCase() + phase.slice(1)}`;
    const panEventName = `${this.name}${phaseName.charAt(0).toUpperCase() + phaseName.slice(1)}`;

    // Dispatch custom event
    const domEvent = new CustomEvent(panEventName, {
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
    if (this.isActive && this.state.phase === 'panning' && this.state.panThresholdReached) {
      const el = element ?? this.element;
      this.emitPanEvent(el, 'cancel', pointers, event);
    }
    this.resetState();
  }
}
