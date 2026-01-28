/**
 * TapAndDragGesture - Detects tap followed by drag gestures using composition
 *
 * This gesture uses internal TapGesture and PanGesture instances to:
 * 1. First, detect a tap (quick touch without movement)
 * 2. Then, track drag movements on the next pointer down
 *
 * The gesture fires events when:
 * - A tap is completed (tap phase)
 * - Drag movement begins and passes threshold (dragStart)
 * - Drag movement continues (drag)
 * - Drag movement ends (dragEnd)
 * - The gesture is canceled at any point
 */

import type { ActiveGesturesRegistry } from '../ActiveGesturesRegistry';
import { GestureState } from '../Gesture';
import type { KeyboardManager } from '../KeyboardManager';
import { PointerGesture, type PointerGestureOptions } from '../PointerGesture';
import { type PointerManager } from '../PointerManager';
import { createEventName, preventDefault } from '../utils';
import { PanGesture, type PanEvent, type PanGestureEventData } from './PanGesture';
import { TapGesture } from './TapGesture';

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
> = PanGestureEventData<CustomData> & {};

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
  /** Timeout used to time drag interactions */
  dragTimeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * TapAndDragGesture class for handling tap followed by drag interactions
 *
 * This gesture composes tap and drag logic patterns from TapGesture and PanGesture
 * into a single coordinated gesture that handles tap-then-drag interactions.
 */
export class TapAndDragGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: TapAndDragGestureState = {
    phase: 'waitingForTap',
    dragTimeoutId: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: TapAndDragEvent;

  protected readonly optionsType!: TapAndDragGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<Partial<typeof this.state>, 'phase' | 'dragTimeoutId'>;

  /**
   * Maximum distance a pointer can move during tap for it to still be considered a tap
   * (Following TapGesture pattern)
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

  private tapGesture: TapGesture<GestureName>;

  private panGesture: PanGesture<GestureName>;

  constructor(options: TapAndDragGestureOptions<GestureName>) {
    super(options);
    this.tapMaxDistance = options.tapMaxDistance ?? 10;
    this.dragTimeout = options.dragTimeout ?? 1000;
    this.dragThreshold = options.dragThreshold ?? 0;
    this.dragDirection = options.dragDirection || ['up', 'down', 'left', 'right'];
    this.tapGesture = new TapGesture({
      name: `${this.name}-tap` as GestureName,
      maxDistance: this.tapMaxDistance,
      maxPointers: this.maxPointers,
      pointerMode: this.pointerMode,
      requiredKeys: this.requiredKeys,
      preventIf: this.preventIf,
      pointerOptions: structuredClone(this.pointerOptions),
    });
    this.panGesture = new PanGesture({
      name: `${this.name}-pan` as GestureName,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      threshold: this.dragThreshold,
      direction: this.dragDirection,
      pointerMode: this.pointerMode,
      requiredKeys: this.requiredKeys,
      preventIf: this.preventIf,
      pointerOptions: structuredClone(this.pointerOptions),
    });
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

  public init(
    element: HTMLElement,
    pointerManager: PointerManager,
    gestureRegistry: ActiveGesturesRegistry<GestureName>,
    keyboardManager: KeyboardManager,
  ): void {
    super.init(element, pointerManager, gestureRegistry, keyboardManager);
    this.tapGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
    this.panGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
    this.element.addEventListener(this.tapGesture.name, this.tapHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener(`${this.panGesture.name}Start`, this.dragStartHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener(this.panGesture.name, this.dragMoveHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener(`${this.panGesture.name}End`, this.dragEndHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.addEventListener(`${this.panGesture.name}Cancel`, this.dragEndHandler);
  }

  public destroy(): void {
    this.resetState();
    this.tapGesture.destroy();
    this.panGesture.destroy();
    this.element.removeEventListener(this.tapGesture.name, this.tapHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener(`${this.panGesture.name}Start`, this.dragStartHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener(this.panGesture.name, this.dragMoveHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener(`${this.panGesture.name}End`, this.dragEndHandler);
    // @ts-expect-error, PointerEvent is correct.
    this.element.removeEventListener(`${this.panGesture.name}Cancel`, this.dragEndHandler);
    super.destroy();
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.tapMaxDistance = options.tapMaxDistance ?? this.tapMaxDistance;
    this.dragTimeout = options.dragTimeout ?? this.dragTimeout;
    this.dragThreshold = options.dragThreshold ?? this.dragThreshold;
    this.dragDirection = options.dragDirection || this.dragDirection;

    this.element.dispatchEvent(
      new CustomEvent(`${this.panGesture.name}ChangeOptions`, {
        detail: {
          minPointers: this.minPointers,
          maxPointers: this.maxPointers,
          threshold: this.dragThreshold,
          direction: this.dragDirection,
          pointerMode: this.pointerMode,
          requiredKeys: this.requiredKeys,
          preventIf: this.preventIf,
          pointerOptions: structuredClone(this.pointerOptions),
        },
      }),
    );

    this.element.dispatchEvent(
      new CustomEvent(`${this.tapGesture.name}ChangeOptions`, {
        detail: {
          maxDistance: this.tapMaxDistance,
          maxPointers: this.maxPointers,
          pointerMode: this.pointerMode,
          requiredKeys: this.requiredKeys,
          preventIf: this.preventIf,
          pointerOptions: structuredClone(this.pointerOptions),
        },
      }),
    );
  }

  protected resetState(): void {
    if (this.state.dragTimeoutId !== null) {
      clearTimeout(this.state.dragTimeoutId);
    }

    this.restoreTouchAction();

    this.isActive = false;
    this.state = {
      phase: 'waitingForTap',
      dragTimeoutId: null,
    };
  }

  /**
   * This can be empty because the TapAndDragGesture relies on TapGesture and PanGesture to handle pointer events
   * The internal gestures will manage their own state and events, while this class coordinates between them
   */
  protected handlePointerEvent(): void {}

  private tapHandler = (): void => {
    if (this.state.phase !== 'waitingForTap') {
      return;
    }

    this.state.phase = 'tapDetected';

    this.setTouchAction();

    // Start timeout to wait for drag start
    this.state.dragTimeoutId = setTimeout(() => {
      // Timeout expired, reset gesture
      this.resetState();
    }, this.dragTimeout);
  };

  private dragStartHandler = (event: PanEvent) => {
    if (this.state.phase !== 'tapDetected') {
      return;
    }

    // Clear the drag timeout as drag has started
    if (this.state.dragTimeoutId !== null) {
      clearTimeout(this.state.dragTimeoutId);
      this.state.dragTimeoutId = null;
    }

    this.restoreTouchAction();

    this.state.phase = 'dragging';
    this.isActive = true;

    // Fire start event
    this.element.dispatchEvent(
      new CustomEvent(createEventName(this.name, event.detail.phase), event),
    );
  };

  private dragMoveHandler = (event: PanEvent): void => {
    if (this.state.phase !== 'dragging') {
      return;
    }

    // Fire move event
    this.element.dispatchEvent(
      new CustomEvent(createEventName(this.name, event.detail.phase), event),
    );
  };

  private dragEndHandler = (event: PanEvent): void => {
    if (this.state.phase !== 'dragging') {
      return;
    }

    this.resetState();

    // Fire end event
    this.element.dispatchEvent(
      new CustomEvent(createEventName(this.name, event.detail.phase), event),
    );
  };

  private setTouchAction(): void {
    this.element.addEventListener('touchstart', preventDefault, { passive: false });
  }

  private restoreTouchAction(): void {
    this.element.removeEventListener('touchstart', preventDefault);
  }
}
