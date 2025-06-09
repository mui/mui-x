import { PointerManager } from './PointerManager';
import { PointerType } from './types/Pointers';
import { UserGesturePlugin } from './types/UserGesturePlugin';

/**
 * Global user gesture options.
 */
export type UserGestureOptions = {
  /**
   * Custom function to replace setTimeout for advancing timers in tests.
   * Useful for testing with fake timers.
   * @param ms
   */
  advanceTimers?: (ms: number) => Promise<void>;
  /**
   * Optional plugins to extend the functionality of the user gesture.
   * Each plugin should implement a specific gesture.
   */
  plugins?: UserGesturePlugin[];
};

export class UserGesture {
  protected pointerManager: PointerManager;

  protected advanceTimers?: (ms: number) => Promise<void>;

  /**
   * Creates a new UserGesture instance.
   */
  constructor(pointerType: PointerType) {
    this.pointerManager = new PointerManager(pointerType);
  }

  /**
   * Configures global options for the gestures.
   *
   * @param options - Global options for the gestures.
   * @returns This instance.
   */
  setup(options?: UserGestureOptions): this {
    // Preserve advanceTimers if it was set previously and not overridden
    if (options?.advanceTimers !== undefined) {
      this.advanceTimers = options.advanceTimers;
    }

    // Register plugins if provided
    options?.plugins?.forEach((plugin) => {
      // @ts-expect-error, we are using a dynamic key
      if (this[plugin.name]) {
        throw new Error(
          `Plugin with name "${plugin.name}" already exists. Please use a unique name.`,
        );
      }
      // @ts-expect-error, we are using a dynamic key
      this[plugin.name] = (newOptions: unknown) =>
        plugin.gesture(this.pointerManager, newOptions, this.advanceTimers);
    });
    return this;
  }
}
