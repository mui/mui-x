import { ActiveGesturesRegistry } from './ActiveGesturesRegistry';
import {
  Gesture,
  GestureEventData,
  GestureOptions,
  type BaseGestureOptions,
  type PointerMode,
} from './Gesture';
import type { KeyboardManager } from './KeyboardManager';
import { PointerData, PointerManager } from './PointerManager';
import { TargetElement } from './types/TargetElement';

/**
 * Base configuration options that can be overridden per pointer mode.
 */
export type BasePointerGestureOptions = BaseGestureOptions & {
  /**
   * Minimum number of pointers required to activate the gesture.
   * The gesture will not start until at least this many pointers are active.
   *
   * @default 1
   */
  minPointers?: number;

  /**
   * Maximum number of pointers allowed for this gesture to remain active.
   * If more than this many pointers are detected, the gesture may be canceled.
   *
   * @default Infinity (no maximum)
   */
  maxPointers?: number;
};

/**
 * Configuration options for pointer-based gestures, extending the base GestureOptions.
 *
 * These options provide fine-grained control over how pointer events are interpreted
 * and when the gesture should be recognized.
 */
export interface PointerGestureOptions<GestureName extends string> extends GestureOptions<
  GestureName,
  BasePointerGestureOptions
> {}

export type PointerGestureEventData<
  CustomData extends Record<string, unknown> = Record<string, unknown>,
> = GestureEventData<CustomData> & {
  /** The original event that triggered this gesture */
  srcEvent: PointerEvent;
};

/**
 * Base class for all pointer-based gestures.
 *
 * This class extends the base Gesture class with specialized functionality for
 * handling pointer events via the PointerManager. It provides common logic for
 * determining when a gesture should activate, tracking pointer movements, and
 * managing pointer thresholds.
 *
 * All pointer-based gesture implementations should extend this class rather than
 * the base Gesture class.
 *
 * @example
 * ```ts
 * import { PointerGesture } from './PointerGesture';
 *
 * class CustomGesture extends PointerGesture {
 *   constructor(options) {
 *     super(options);
 *   }
 *
 *   clone(overrides) {
 *     return new CustomGesture({
 *       name: this.name,
 *       // ... other options
 *       ...overrides,
 *     });
 *   }
 *
 *   handlePointerEvent = (pointers, event) => {
 *     // Handle pointer events here
 *   }
 * }
 * ```
 */
export abstract class PointerGesture<GestureName extends string> extends Gesture<GestureName> {
  /** Function to unregister from the PointerManager when destroying this gesture */
  protected unregisterHandler: (() => void) | null = null;

  /** The original target element when the gesture began, used to prevent limbo state if target is removed */
  protected originalTarget: TargetElement | null = null;

  protected abstract readonly optionsType: PointerGestureOptions<GestureName>;

  protected abstract readonly mutableOptionsType: Omit<typeof this.optionsType, 'name'>;

  /**
   * Minimum number of simultaneous pointers required to activate the gesture.
   * The gesture will not start until at least this many pointers are active.
   */
  protected minPointers: number;

  /**
   * Maximum number of simultaneous pointers allowed for this gesture.
   * If more than this many pointers are detected, the gesture may be canceled.
   */
  protected maxPointers: number;

  constructor(options: PointerGestureOptions<GestureName>) {
    super(options);
    this.minPointers = options.minPointers ?? 1;
    this.maxPointers = options.maxPointers ?? Infinity;
  }

  public init(
    element: TargetElement,
    pointerManager: PointerManager,
    gestureRegistry: ActiveGesturesRegistry<GestureName>,
    keyboardManager: KeyboardManager,
  ): void {
    super.init(element, pointerManager, gestureRegistry, keyboardManager);

    this.unregisterHandler = this.pointerManager!.registerGestureHandler(this.handlePointerEvent);
  }

  protected updateOptions(options: typeof this.mutableOptionsType): void {
    super.updateOptions(options);

    this.minPointers = options.minPointers ?? this.minPointers;
    this.maxPointers = options.maxPointers ?? this.maxPointers;
  }

  protected getBaseConfig() {
    return {
      requiredKeys: this.requiredKeys,
      minPointers: this.minPointers,
      maxPointers: this.maxPointers,
    };
  }

  protected isWithinPointerCount(pointers: PointerData[], pointerMode: string): boolean {
    const config = this.getEffectiveConfig(pointerMode as PointerMode, this.getBaseConfig());
    return pointers.length >= config.minPointers && pointers.length <= config.maxPointers;
  }

  /**
   * Handler for pointer events from the PointerManager.
   * Concrete gesture implementations must override this method to provide
   * gesture-specific logic for recognizing and tracking the gesture.
   *
   * @param pointers - Map of active pointers by pointer ID
   * @param event - The original pointer event from the browser
   */
  protected abstract handlePointerEvent(
    pointers: Map<number, PointerData>,
    event: PointerEvent,
  ): void;

  /**
   * Calculate the target element for the gesture based on the active pointers.
   *
   * It takes into account the original target element.
   *
   * @param pointers - Map of active pointers by pointer ID
   * @param calculatedTarget - The target element calculated from getTargetElement
   * @returns A list of relevant pointers for this gesture
   */
  protected getRelevantPointers(
    pointers: PointerData[],
    calculatedTarget: TargetElement,
  ): PointerData[] {
    return pointers.filter(
      (pointer) =>
        (this.isPointerTypeAllowed(pointer.pointerType) &&
          (calculatedTarget === pointer.target ||
            pointer.target === this.originalTarget ||
            calculatedTarget === this.originalTarget ||
            ('contains' in calculatedTarget &&
              calculatedTarget.contains(pointer.target as Node)))) ||
        ('getRootNode' in calculatedTarget &&
          calculatedTarget.getRootNode() instanceof ShadowRoot &&
          pointer.srcEvent.composedPath().includes(calculatedTarget)),
    );
  }

  public destroy(): void {
    if (this.unregisterHandler) {
      this.unregisterHandler();
      this.unregisterHandler = null;
    }
    super.destroy();
  }
}
