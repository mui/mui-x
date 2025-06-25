import { ActiveGesturesRegistry } from './ActiveGesturesRegistry';
import { Gesture } from './Gesture';
import { PointerManager, PointerManagerOptions } from './PointerManager';
import { GestureElement } from './types/GestureElement';
import { MergeUnions } from './types/MergeUnions';
import { OmitNever } from './types/OmitNever';
import { Simplify } from './types/Simplify';
import { TargetElement } from './types/TargetElement';

/**
 * Configuration options for initializing the GestureManager
 */
export type GestureManagerOptions<
  GestureName extends string,
  Gestures extends Gesture<GestureName>,
> = PointerManagerOptions & {
  /**
   * Array of gesture templates to register with the manager.
   * These serve as prototypes that can be cloned for individual elements.
   */
  gestures: Gestures[];
};

/**
 * The primary class responsible for setting up and managing gestures across multiple elements.
 *
 * GestureManager maintains a collection of gesture templates that can be instantiated for
 * specific DOM elements. It handles lifecycle management, event dispatching, and cleanup.
 *
 * @example
 * ```typescript
 * // Basic setup with default gestures
 * const manager = new GestureManager({
 *   root: document.body,
 *   touchAction: 'none',
 *   gestures: [
 *     new PanGesture({ name: 'pan' }),
 *   ],
 * });
 *
 * // Register pan gestures on an element
 * const element = manager.registerElement('pan', document.querySelector('.draggable'));
 *
 * // Add event listeners with proper typing
 * element.addEventListener('panStart', (event) => {
 *   console.log('Pan started');
 * });
 *
 * element.addEventListener('pan', (event) => {
 *   console.log(`Pan delta: ${event.deltaX}, ${event.deltaY}`);
 * });
 *
 * // Custom gesture types
 * interface MyGestureEvents {
 *   custom: { x: number, y: number }
 * }
 * const customManager = new GestureManager<MyGestureEvents>({
 *   root: document.body
 *   gestures: [
 *     new CustomGesture({ name: 'custom' }),
 *   ],
 * });
 * ```
 */
export class GestureManager<
  GestureName extends string,
  Gestures extends Gesture<GestureName>,
  GestureUnion extends Gesture<GestureName> = Gestures[][number],
  GestureNameUnion extends string = GestureUnion extends Gesture<infer N> ? N : never,
  GestureNameUnionComplete extends string = GestureUnion extends Gesture<string>
    ? // @ts-expect-error, this makes the types work.
      GestureUnion['isSinglePhase'] extends true
      ? GestureUnion extends Gesture<infer N>
        ? N
        : never
      : // @ts-expect-error, this makes the types work.
        GestureUnion['isSinglePhase'] extends false
        ? GestureUnion extends Gesture<infer N>
          ? `${N}Start` | N | `${N}End` | `${N}Cancel`
          : never
        : never
    : never,
  GestureNameToGestureMap extends Record<string, GestureUnion> = MergeUnions<
    | {
        [K in GestureNameUnion]: GestureUnion extends Gesture<string>
          ? // @ts-expect-error, this makes the types work.
            GestureUnion['isSinglePhase'] extends true
            ? GestureUnion extends Gesture<K>
              ? GestureUnion
              : never
            : never
          : never;
      }
    | {
        [K in GestureNameUnionComplete]: GestureUnion extends Gesture<string>
          ? // @ts-expect-error, this makes the types work.
            GestureUnion['isSinglePhase'] extends false
            ? K extends `${infer N}${'Start' | 'End' | 'Cancel'}`
              ? GestureUnion extends Gesture<N>
                ? GestureUnion
                : never
              : GestureUnion extends Gesture<K>
                ? GestureUnion
                : never
            : never
          : never;
      }
  >,
  GestureNameToEventMap = Simplify<{
    [K in keyof GestureNameToGestureMap]: Simplify<
      Omit<
        // @ts-expect-error, this makes the types work.
        GestureNameToGestureMap[K]['eventType'],
        'detail'
      > & {
        detail: Simplify<
          // @ts-expect-error, this makes the types work.
          Omit<GestureNameToGestureMap[K]['eventType']['detail'], 'activeGestures'> & {
            activeGestures: Record<GestureNameUnion, boolean>;
          }
        >;
      }
    >;
  }>,
  GestureNameToOptionsMap = {
    // @ts-expect-error, this makes the types work.
    [K in keyof GestureNameToGestureMap]: GestureNameToGestureMap[K]['mutableOptionsType'];
  },
  GestureNameToStateMap = Simplify<
    OmitNever<{
      // @ts-expect-error, this makes the types work.
      [K in keyof GestureNameToGestureMap]: GestureNameToGestureMap[K]['mutableStateType'];
    }>
  >,
> {
  /** Repository of gesture templates that can be cloned for specific elements */
  private gestureTemplates: Map<string, Gesture<string>> = new Map();

  /** Maps DOM elements to their active gesture instances */
  private elementGestureMap: Map<TargetElement, Map<string, Gesture<string>>> = new Map();

  private activeGesturesRegistry: ActiveGesturesRegistry<GestureName> =
    new ActiveGesturesRegistry();

  private pointerManager: PointerManager;

  /**
   * Create a new GestureManager instance to coordinate gesture recognition
   *
   * @param options - Configuration options for the gesture manager
   */
  constructor(options: GestureManagerOptions<GestureName, Gestures>) {
    // Initialize the PointerManager
    this.pointerManager = new PointerManager({
      root: options.root,
      touchAction: options.touchAction,
      passive: options.passive,
    });

    // Add initial gestures as templates if provided
    if (options.gestures && options.gestures.length > 0) {
      options.gestures.forEach((gesture) => {
        this.addGestureTemplate(gesture);
      });
    }
  }

  /**
   * Add a gesture template to the manager's template registry.
   * Templates serve as prototypes that can be cloned for individual elements.
   *
   * @param gesture - The gesture instance to use as a template
   */
  private addGestureTemplate(gesture: Gesture<GestureName>): void {
    if (this.gestureTemplates.has(gesture.name)) {
      console.warn(
        `Gesture template with name "${gesture.name}" already exists. It will be overwritten.`,
      );
    }
    this.gestureTemplates.set(gesture.name, gesture);
  }

  /**
   * Updates the options for a specific gesture on a given element and emits a change event.
   *
   * @param gestureName - Name of the gesture whose options should be updated
   * @param element - The DOM element where the gesture is attached
   * @param options - New options to apply to the gesture
   * @returns True if the options were successfully updated, false if the gesture wasn't found
   *
   * @example
   * ```typescript
   * // Update pan gesture sensitivity on the fly
   * manager.setGestureOptions('pan', element, { threshold: 5 });
   * ```
   */
  public setGestureOptions<
    T extends TargetElement,
    GNU extends GestureNameUnion,
    GN extends keyof GestureNameToOptionsMap & string = GNU extends keyof GestureNameToOptionsMap
      ? GNU
      : never,
  >(gestureName: GN, element: T, options: GestureNameToOptionsMap[GN]): void {
    const elementGestures = this.elementGestureMap.get(element);
    if (!elementGestures || !elementGestures.has(gestureName)) {
      console.error(`Gesture "${gestureName}" not found on the provided element.`);
      return;
    }

    const event = new CustomEvent<GestureNameToOptionsMap[GN]>(`${gestureName}ChangeOptions`, {
      detail: options,
      bubbles: false,
      cancelable: false,
    });

    element.dispatchEvent(event);
  }

  /**
   * Updates the state for a specific gesture on a given element and emits a change event.
   *
   * @param gestureName - Name of the gesture whose state should be updated
   * @param element - The DOM element where the gesture is attached
   * @param state - New state to apply to the gesture
   * @returns True if the state was successfully updated, false if the gesture wasn't found
   *
   * @example
   * ```typescript
   * // Update total delta for a turnWheel gesture
   * manager.setGestureState('turnWheel', element, { totalDeltaX: 10 });
   * ```
   */
  public setGestureState<
    T extends TargetElement,
    GNU extends GestureNameUnion,
    GN extends keyof GestureNameToStateMap & string = GNU extends keyof GestureNameToStateMap
      ? GNU
      : never,
  >(gestureName: GN, element: T, state: GestureNameToStateMap[GN]): void {
    const elementGestures = this.elementGestureMap.get(element);
    if (!elementGestures || !elementGestures.has(gestureName)) {
      console.error(`Gesture "${gestureName}" not found on the provided element.`);
      return;
    }

    const event = new CustomEvent<GestureNameToStateMap[GN]>(`${gestureName}ChangeState`, {
      detail: state,
      bubbles: false,
      cancelable: false,
    });

    element.dispatchEvent(event);
  }

  /**
   * Register an element to recognize one or more gestures.
   *
   * This method clones the specified gesture template(s) and creates
   * gesture recognizer instance(s) specifically for the provided element.
   * The element is returned with enhanced TypeScript typing for gesture events.
   *
   * @param gestureNames - Name(s) of the gesture(s) to register (must match template names)
   * @param element - The DOM element to attach the gesture(s) to
   * @param options - Optional map of gesture-specific options to override when registering
   * @returns The same element with properly typed event listeners
   *
   * @example
   * ```typescript
   * // Register multiple gestures
   * const element = manager.registerElement(['pan', 'pinch'], myDiv);
   *
   * // Register a single gesture
   * const draggable = manager.registerElement('pan', dragHandle);
   *
   * // Register with customized options for each gesture
   * const customElement = manager.registerElement(
   *   ['pan', 'pinch', 'rotate'],
   *   myElement,
   *   {
   *     pan: { threshold: 20, direction: ['left', 'right'] },
   *     pinch: { threshold: 0.1 }
   *   }
   * );
   * ```
   */
  public registerElement<
    T extends TargetElement,
    GNU extends GestureNameUnion,
    GN extends keyof GestureNameToOptionsMap & string = GNU extends keyof GestureNameToOptionsMap
      ? GNU
      : never,
  >(
    gestureNames: GN | GN[],
    element: T,
    options?: Partial<Pick<GestureNameToOptionsMap, GN>>,
  ): GestureElement<GestureNameUnionComplete, GestureNameToEventMap, T> {
    // Handle array of gesture names
    if (Array.isArray(gestureNames)) {
      gestureNames.forEach((name) => {
        const gestureOptions = options?.[name];
        this.registerSingleGesture(name, element, gestureOptions!);
      });
      return element as GestureElement<GestureNameUnionComplete, GestureNameToEventMap, T>;
    }

    // Handle single gesture name
    const gestureOptions = options?.[gestureNames];
    this.registerSingleGesture(gestureNames, element, gestureOptions!);
    return element as GestureElement<GestureNameUnionComplete, GestureNameToEventMap, T>;
  }

  /**
   * Internal method to register a single gesture on an element.
   *
   * @param gestureName - Name of the gesture to register
   * @param element - DOM element to attach the gesture to
   * @param options - Optional options to override the gesture template configuration
   * @returns True if the registration was successful, false otherwise
   */
  private registerSingleGesture(
    gestureName: string,
    element: TargetElement,
    options?: Record<string, unknown>,
  ): boolean {
    // Find the gesture template
    const gestureTemplate = this.gestureTemplates.get(gestureName);
    if (!gestureTemplate) {
      console.error(`Gesture template "${gestureName}" not found.`);
      return false;
    }

    // Create element's gesture map if it doesn't exist
    if (!this.elementGestureMap.has(element)) {
      this.elementGestureMap.set(element, new Map());
    }

    // Check if this element already has this gesture registered
    const elementGestures = this.elementGestureMap.get(element)!;
    if (elementGestures.has(gestureName)) {
      console.warn(`Element already has gesture "${gestureName}" registered. It will be replaced.`);
      // Unregister the existing gesture first
      this.unregisterElement(gestureName, element);
    }

    // Clone the gesture template and create a new instance with optional overrides
    // This allows each element to have its own state, event listeners, and configuration
    const gestureInstance = gestureTemplate.clone(options);
    gestureInstance.init(element, this.pointerManager, this.activeGesturesRegistry);

    // Store the gesture in the element's gesture map
    elementGestures.set(gestureName, gestureInstance);

    return true;
  }

  /**
   * Unregister a specific gesture from an element.
   * This removes the gesture recognizer and stops event emission for that gesture.
   *
   * @param gestureName - Name of the gesture to unregister
   * @param element - The DOM element to remove the gesture from
   * @returns True if the gesture was found and removed, false otherwise
   */
  public unregisterElement(gestureName: string, element: TargetElement): boolean {
    const elementGestures = this.elementGestureMap.get(element);
    if (!elementGestures || !elementGestures.has(gestureName)) {
      return false;
    }

    // Destroy the gesture instance
    const gesture = elementGestures.get(gestureName)!;
    gesture.destroy();

    // Remove from the map
    elementGestures.delete(gestureName);
    this.activeGesturesRegistry.unregisterElement(element);

    // Remove the element from the map if it no longer has any gestures
    if (elementGestures.size === 0) {
      this.elementGestureMap.delete(element);
    }

    return true;
  }

  /**
   * Unregister all gestures from an element.
   * Completely removes the element from the gesture system.
   *
   * @param element - The DOM element to remove all gestures from
   */
  public unregisterAllGestures(element: TargetElement): void {
    const elementGestures = this.elementGestureMap.get(element);
    if (elementGestures) {
      // Unregister all gestures for this element
      for (const [, gesture] of elementGestures) {
        gesture.destroy();
        this.activeGesturesRegistry.unregisterElement(element);
      }

      // Clear the map
      this.elementGestureMap.delete(element);
    }
  }

  /**
   * Clean up all gestures and event listeners.
   * Call this method when the GestureManager is no longer needed to prevent memory leaks.
   */
  public destroy(): void {
    // Unregister all element gestures
    for (const [element] of this.elementGestureMap) {
      this.unregisterAllGestures(element);
    }

    // Clear all templates
    this.gestureTemplates.clear();
    this.elementGestureMap.clear();
    this.activeGesturesRegistry.destroy();
  }
}
