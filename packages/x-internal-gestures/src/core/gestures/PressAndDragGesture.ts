/**
 * PressAndDragGesture - Detects press followed by drag gestures using composition
 *
 * This gesture uses internal PressGesture and PanGesture instances to:
 * 1. First, detect a press (hold for specified duration without movement)
 * 2. Then, track drag movements from the press position
 *
 * The gesture fires events when:
 * - A press is completed (press phase)
 * - Drag movement begins and passes threshold (dragStart)
 * - Drag movement continues (drag)
 * - Drag movement ends (dragEnd)
 * - The gesture is canceled at any point
 *
 * This is ideal for panning operations where you want to hold first, then drag.
 */

import type { ActiveGesturesRegistry } from '../ActiveGesturesRegistry';
import { GestureState } from '../Gesture';
import type { KeyboardManager } from '../KeyboardManager';
import { PointerGesture, type PointerGestureOptions } from '../PointerGesture';
import { type PointerManager } from '../PointerManager';
import { createEventName, preventDefault } from '../utils';
import { PanGesture, type PanEvent, type PanGestureEventData } from './PanGesture';
import { PressGesture } from './PressGesture';

/**
 * Configuration options for PressAndDragGesture
 * Extends PointerGestureOptions with press and drag specific settings
 */
export type PressAndDragGestureOptions<GestureName extends string> =
  PointerGestureOptions<GestureName> & {
    /**
     * Duration in milliseconds required to hold before the press gesture is recognized
     * @default 500
     */
    pressDuration?: number;

    /**
     * Maximum distance in pixels a pointer can move during the press phase for it to still be considered a press
     * @default 10
     */
    pressMaxDistance?: number;

    /**
     * Maximum time in milliseconds between the press completion and the start of the drag
     * If exceeded, the gesture will reset and wait for a new press
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
 * Event data specific to press and drag gesture events
 * Contains information about the gesture state, position, and movement
 */
export type PressAndDragGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = PanGestureEventData<CustomData> & {};

/**
 * Type definition for the CustomEvent created by PressAndDragGesture
 */
export type PressAndDragEvent<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = CustomEvent<PressAndDragGestureEventData<CustomData>>;

/**
 * Represents the current phase of the PressAndDrag gesture
 */
export type PressAndDragPhase = 'waitingForPress' | 'pressDetected' | 'waitingForDrag' | 'dragging';

/**
 * State tracking for the PressAndDragGesture
 */
export type PressAndDragGestureState = GestureState & {
  /** Current phase of the press and drag gesture */
  phase: PressAndDragPhase;
  /** Timeout used to time drag interactions */
  dragTimeoutId: ReturnType<typeof setTimeout> | null;
};

/**
 * PressAndDragGesture class for handling press followed by drag interactions
 *
 * This gesture composes press and drag logic patterns from PressGesture and PanGesture
 * into a single coordinated gesture that handles press-then-drag interactions.
 */
export class PressAndDragGesture<GestureName extends string> extends PointerGesture<GestureName> {
  protected state: PressAndDragGestureState = {
    phase: 'waitingForPress',
    dragTimeoutId: null,
  };

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: PressAndDragEvent;

  protected readonly optionsType!: PressAndDragGestureOptions<GestureName>;

  protected readonly mutableOptionsType!: Omit<typeof this.optionsType, 'name'>;

  protected readonly mutableStateType!: Omit<Partial<typeof this.state>, 'phase' | 'dragTimeoutId'>;

  /**
   * Duration required for press recognition
   */
  private pressDuration: number;

  /**
   * Maximum distance a pointer can move during press for it to still be considered a press
   */
  private pressMaxDistance: number;

  /**
   * Maximum time between press completion and drag start
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

  private pressGesture: PressGesture<GestureName>;

  private panGesture: PanGesture<GestureName>;

  constructor(options: PressAndDragGestureOptions<GestureName>) {
    super(options);
    this.pressDuration = options.pressDuration ?? 500;
    this.pressMaxDistance = options.pressMaxDistance ?? 10;
    this.dragTimeout = options.dragTimeout ?? 1000;
    this.dragThreshold = options.dragThreshold ?? 0;
    this.dragDirection = options.dragDirection || ['up', 'down', 'left', 'right'];

    this.pressGesture = new PressGesture({
      name: `${this.name}-press` as GestureName,
      duration: this.pressDuration,
      maxDistance: this.pressMaxDistance,
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

  public clone(overrides?: Record<string, unknown>): PressAndDragGesture<GestureName> {
    return new PressAndDragGesture({
      name: this.name,
      preventDefault: this.preventDefault,
      stopPropagation: this.stopPropagation,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
      pressDuration: this.pressDuration,
      pressMaxDistance: this.pressMaxDistance,
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
    this.pressGesture.init(element, pointerManager, gestureRegistry, keyboardManager);
    this.panGesture.init(element, pointerManager, gestureRegistry, keyboardManager);

    // Listen to press gesture events
    this.element.addEventListener(this.pressGesture.name, this.pressHandler);

    // Listen to pan gesture events for dragging
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
    this.pressGesture.destroy();
    this.panGesture.destroy();

    this.element.removeEventListener(this.pressGesture.name, this.pressHandler);
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

    this.pressDuration = options.pressDuration ?? this.pressDuration;
    this.pressMaxDistance = options.pressMaxDistance ?? this.pressMaxDistance;
    this.dragTimeout = options.dragTimeout ?? this.dragTimeout;
    this.dragThreshold = options.dragThreshold ?? this.dragThreshold;
    this.dragDirection = options.dragDirection || this.dragDirection;

    // Update internal gesture options
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
      new CustomEvent(`${this.pressGesture.name}ChangeOptions`, {
        detail: {
          duration: this.pressDuration,
          maxDistance: this.pressMaxDistance,
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
      phase: 'waitingForPress',
      dragTimeoutId: null,
    };
  }

  /**
   * This can be empty because the PressAndDragGesture relies on PressGesture and PanGesture to handle pointer events
   * The internal gestures will manage their own state and events, while this class coordinates between them
   */
  protected handlePointerEvent(): void {}

  private pressHandler = (): void => {
    if (this.state.phase !== 'waitingForPress') {
      return;
    }

    this.state.phase = 'pressDetected';

    this.setTouchAction();

    // Start timeout to wait for drag start
    this.state.dragTimeoutId = setTimeout(() => {
      // Timeout expired, reset gesture
      this.resetState();
    }, this.dragTimeout);
  };

  private dragStartHandler = (event: PanEvent) => {
    if (this.state.phase !== 'pressDetected') {
      return;
    }

    // Clear the drag timeout as drag has started
    if (this.state.dragTimeoutId !== null) {
      clearTimeout(this.state.dragTimeoutId);
      this.state.dragTimeoutId = null;
    }

    // Restore touch action since we're now dragging
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
    this.element.addEventListener('touchmove', preventDefault, { passive: false });
    this.element.addEventListener('touchend', preventDefault, { passive: false });
  }

  private restoreTouchAction(): void {
    this.element.removeEventListener('touchstart', preventDefault);
    this.element.removeEventListener('touchmove', preventDefault);
    this.element.removeEventListener('touchend', preventDefault);
  }
}
