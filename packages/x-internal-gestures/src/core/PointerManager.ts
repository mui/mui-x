/**
 * PointerManager - Centralized manager for pointer events in the gesture recognition system
 *
 * This singleton class abstracts the complexity of working with pointer events by:
 * 1. Capturing and tracking all active pointers (touch, mouse, pen)
 * 2. Normalizing pointer data into a consistent format
 * 3. Managing pointer capture for proper tracking across elements
 * 4. Distributing events to registered gesture recognizers
 */

import { TargetElement } from './types/TargetElement';

/**
 * Normalized representation of a pointer, containing all relevant information
 * from the original PointerEvent plus additional tracking data.
 *
 * This data structure encapsulates everything gesture recognizers need to know
 * about a pointer's current state.
 */
export type PointerData = {
  /** Unique identifier for this pointer */
  pointerId: number;
  /** X-coordinate relative to the viewport */
  clientX: number;
  /** Y-coordinate relative to the viewport */
  clientY: number;
  /** X-coordinate relative to the document, including scroll offset */
  pageX: number;
  /** Y-coordinate relative to the document, including scroll offset */
  pageY: number;
  /** The DOM element that was the target of this pointer event */
  target: EventTarget | null;
  /** Timestamp when the event occurred */
  timeStamp: number;
  /** Type of pointer event: 'pointerdown', 'pointermove', 'pointerup', etc. */
  type: string;
  /** Whether this is the primary pointer in a multi-pointer scenario */
  isPrimary: boolean;
  /** Pressure value, ranges from 0 to 1 (1 is maximum pressure) */
  pressure: number;
  /** Width of the contact area in CSS pixels */
  width: number;
  /** Height of the contact area in CSS pixels */
  height: number;
  /** Indicates the type of pointing device: 'mouse', 'touch', or 'pen' */
  pointerType: string;
  /** Reference to the original browser PointerEvent */
  srcEvent: PointerEvent;
};

/**
 * Configuration options for initializing the PointerManager.
 */
export type PointerManagerOptions = {
  /**
   * The root DOM element to which the PointerManager will attach its event listeners.
   * All gesture detection will be limited to events within this element.
   */
  root?: TargetElement;

  /**
   * CSS touch-action property to apply to the root element.
   * Controls how the browser responds to touch interactions.
   *
   * Common values:
   * - "none": Disable browser handling of all panning/zooming gestures
   * - "pan-x": Allow horizontal panning, disable vertical gestures
   * - "pan-y": Allow vertical panning, disable horizontal gestures
   * - "manipulation": Allow panning and pinch zoom, disable double-tap
   * - "auto": Default behavior, allows browser to handle gestures
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
   *
   * @default "auto"
   */
  touchAction?: string;

  /**
   * Whether to use passive event listeners for better scrolling performance.
   * When true, listeners cannot call preventDefault() on events.
   *
   * @default true
   */
  passive?: boolean;

  /**
   * Whether to prevent interrupt events like blur or contextmenu from affecting gestures.
   * If true, these events will not interrupt ongoing gestures.
   *
   * @default true
   */
  preventEventInterruption?: boolean;
};

/**
 * Manager for handling pointer events across the application.
 *
 * PointerManager serves as the foundational layer for gesture recognition,
 * providing a centralized system for tracking active pointers and distributing
 * pointer events to gesture recognizers.
 *
 * It normalizes browser pointer events into a consistent format and simplifies
 * multi-touch handling by managing pointer capture and tracking multiple
 * simultaneous pointers.
 */
export class PointerManager {
  /** Root element where pointer events are captured */
  private root: HTMLElement;

  /** CSS touch-action property value applied to the root element */
  private touchAction: string;

  /** Whether to use passive event listeners */
  private passive: boolean;

  /** Whether to prevent interrupt events like blur or contextmenu */
  private preventEventInterruption: boolean = true;

  /** Map of all currently active pointers by their pointerId */
  private pointers: Map<number, PointerData> = new Map();

  /** Set of registered gesture handlers that receive pointer events */
  private gestureHandlers: Set<(pointers: Map<number, PointerData>, event: PointerEvent) => void> =
    new Set();

  public constructor(options: PointerManagerOptions) {
    this.root = (options.root ?? document.documentElement) as HTMLElement;
    this.touchAction = options.touchAction || 'auto';
    this.passive = options.passive !== false;
    this.preventEventInterruption = options.preventEventInterruption !== false;

    this.setupEventListeners();
  }

  /**
   * Register a handler function to receive pointer events.
   *
   * The handler will be called whenever pointer events occur within the root element.
   * It receives the current map of all active pointers and the original event.
   *
   * @param {Function} handler - Function to receive pointer events and current pointer state
   * @returns {Function} An unregister function that removes this handler when called
   */
  public registerGestureHandler(
    handler: (pointers: Map<number, PointerData>, event: PointerEvent) => void,
  ): () => void {
    this.gestureHandlers.add(handler);

    // Return unregister function
    return () => {
      this.gestureHandlers.delete(handler);
    };
  }

  /**
   * Get a copy of the current active pointers map.
   *
   * Returns a new Map containing all currently active pointers.
   * Modifying the returned map will not affect the internal pointers state.
   *
   * @returns A new Map containing all active pointers
   */
  public getPointers(): Map<number, PointerData> {
    return new Map(this.pointers);
  }

  /**
   * Set up event listeners for pointer events on the root element.
   *
   * This method attaches all necessary event listeners and configures
   * the CSS touch-action property on the root element.
   */
  private setupEventListeners(): void {
    // Set touch-action CSS property
    if (this.touchAction !== 'auto') {
      this.root.style.touchAction = this.touchAction;
    }

    // Add event listeners
    this.root.addEventListener('pointerdown', this.handlePointerEvent, { passive: this.passive });
    this.root.addEventListener('pointermove', this.handlePointerEvent, { passive: this.passive });
    this.root.addEventListener('pointerup', this.handlePointerEvent, { passive: this.passive });
    this.root.addEventListener('pointercancel', this.handlePointerEvent, { passive: this.passive });
    // @ts-expect-error, forceCancel is not a standard event, but used for custom handling
    this.root.addEventListener('forceCancel', this.handlePointerEvent, { passive: this.passive });

    // Add blur and contextmenu event listeners to interrupt all gestures
    this.root.addEventListener('blur', this.handleInterruptEvents);
    this.root.addEventListener('contextmenu', this.handleInterruptEvents);
  }

  /**
   * Handle events that should interrupt all gestures.
   * This clears all active pointers and notifies handlers with a pointercancel-like event.
   *
   * @param event - The event that triggered the interruption (blur or contextmenu)
   */
  private handleInterruptEvents = (event: Event): void => {
    if (
      this.preventEventInterruption &&
      'pointerType' in event &&
      (event as PointerEvent).pointerType === 'touch'
    ) {
      event.preventDefault();
      return;
    }

    // Create a synthetic pointer cancel event
    const cancelEvent = new PointerEvent('forceCancel', {
      bubbles: false,
      cancelable: false,
    });

    const firstPointer = this.pointers.values().next().value;
    if (this.pointers.size > 0 && firstPointer) {
      // If there are active pointers, use the first one as a template for coordinates

      // Update the synthetic event with the pointer's coordinates
      Object.defineProperties(cancelEvent, {
        clientX: { value: firstPointer.clientX },
        clientY: { value: firstPointer.clientY },
        pointerId: { value: firstPointer.pointerId },
        pointerType: { value: firstPointer.pointerType },
      });

      // Force update of all pointers to have type 'forceCancel'
      for (const [pointerId, pointer] of this.pointers.entries()) {
        const updatedPointer = { ...pointer, type: 'forceCancel' };
        this.pointers.set(pointerId, updatedPointer);
      }
    }

    // Notify all handlers about the interruption
    this.notifyHandlers(cancelEvent);

    // Clear all pointers
    this.pointers.clear();
  };

  /**
   * Event handler for all pointer events.
   *
   * This method:
   * 1. Updates the internal pointers map based on the event type
   * 2. Manages pointer capture for tracking pointers outside the root element
   * 3. Notifies all registered handlers with the current state
   *
   * @param event - The original pointer event from the browser
   */
  private handlePointerEvent = (event: PointerEvent): void => {
    const { type, pointerId } = event;

    // Create or update pointer data
    if (type === 'pointerdown') {
      this.pointers.set(pointerId, this.createPointerData(event));
      // Capture the pointer to track it even when it leaves the element
      if (event.target instanceof Element) {
        try {
          event.target.setPointerCapture(pointerId);
        } catch (_) {
          // The target may not support pointer capture
        }
      }
    } else if (type === 'pointermove') {
      this.pointers.set(pointerId, this.createPointerData(event));
    }
    // Remove pointer data on up or cancel
    else if (type === 'pointerup' || type === 'pointercancel' || type === 'forceCancel') {
      // Release pointer capture on up or cancel
      if (event.target instanceof Element) {
        try {
          event.target.releasePointerCapture(pointerId);
        } catch (_) {
          // The target may not support pointer capture
        }
      }

      // Update one last time before removing
      this.pointers.set(pointerId, this.createPointerData(event));

      // Notify handlers with current state
      this.notifyHandlers(event);

      // Then remove the pointer
      this.pointers.delete(pointerId);
      return;
    }

    this.notifyHandlers(event);
  };

  /**
   * Notify all registered gesture handlers about a pointer event.
   *
   * Each handler receives the current map of active pointers and the original event.
   *
   * @param event - The original pointer event that triggered this notification
   */
  private notifyHandlers(event: PointerEvent): void {
    this.gestureHandlers.forEach((handler) => handler(this.pointers, event));
  }

  /**
   * Create a normalized PointerData object from a browser PointerEvent.
   *
   * This method extracts all relevant information from the original event
   * and formats it in a consistent way for gesture recognizers to use.
   *
   * @param event - The original browser pointer event
   * @returns A new PointerData object representing this pointer
   */
  // eslint-disable-next-line class-methods-use-this
  private createPointerData(event: PointerEvent): PointerData {
    return {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      pageX: event.pageX,
      pageY: event.pageY,
      target: event.target,
      timeStamp: event.timeStamp,
      type: event.type,
      isPrimary: event.isPrimary,
      pressure: event.pressure,
      width: event.width,
      height: event.height,
      pointerType: event.pointerType,
      srcEvent: event,
    };
  }

  /**
   * Clean up all event listeners and reset the PointerManager state.
   *
   * This method should be called when the PointerManager is no longer needed
   * to prevent memory leaks. It removes all event listeners, clears the
   * internal state, and resets the singleton instance.
   */
  public destroy(): void {
    this.root.removeEventListener('pointerdown', this.handlePointerEvent);
    this.root.removeEventListener('pointermove', this.handlePointerEvent);
    this.root.removeEventListener('pointerup', this.handlePointerEvent);
    this.root.removeEventListener('pointercancel', this.handlePointerEvent);
    // @ts-expect-error, forceCancel is not a standard event, but used for custom handling
    this.root.removeEventListener('forceCancel', this.handlePointerEvent);
    this.root.removeEventListener('blur', this.handleInterruptEvents);
    this.root.removeEventListener('contextmenu', this.handleInterruptEvents);

    this.pointers.clear();
    this.gestureHandlers.clear();
  }
}
