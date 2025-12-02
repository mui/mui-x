/**
 * CustomEventListener interface
 *
 * Used to define the structure of an object that can listen to custom events.
 */
export type CustomEventListener = {
  addEventListener: (type: string, listener: (event: CustomEvent) => void) => void;
  removeEventListener: (type: string, listener: (event: CustomEvent) => void) => void;
};
