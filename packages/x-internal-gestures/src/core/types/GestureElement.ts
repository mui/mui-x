import { TargetElement } from './TargetElement';

/**
 * Enhanced HTML element type with strongly-typed gesture event handlers.
 *
 * This type extends the standard Element with correctly typed addEventListener
 * and removeEventListener methods that understand both standard DOM events and
 * custom gesture events.
 */
export type GestureElement<
  GestureEventName extends string = string,
  GestureNameToEvent = unknown,
  T = unknown,
> = Omit<T, 'addEventListener' | 'removeEventListener'> & {
  addEventListener<
    K extends GestureEventName,
    GestureEvent = GestureNameToEvent extends Record<GestureEventName, Event>
      ? GestureNameToEvent[K]
      : never,
  >(
    type: K,
     
    listener: (this: TargetElement, ev: GestureEvent) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
     
    listener: (this: TargetElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<
    K extends GestureEventName,
    GestureEvent = GestureNameToEvent extends Record<GestureEventName, Event>
      ? GestureNameToEvent[K]
      : never,
  >(
    type: K,
     
    listener: (this: TargetElement, ev: GestureEvent) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener<K extends keyof HTMLElementEventMap>(
    type: K,
     
    listener: (this: TargetElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
};
