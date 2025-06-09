import { PointerManager } from '../PointerManager';

 
export type UserGesturePlugin<Options extends Record<string, any> = any> = {
  /**
   * The name of the gesture.
   * It will be used to call the gesture provided by the plugin.
   *
   * For example, if the name is `'twistAndShout'`, the call will be `mouseGesture.twistAndShout()`.
   */
  name: string;
  /**
   * The function that implements the new gesture.
   * This function will be called with the provided options.
   *
   * The function should return a promise that resolves when the gesture is done.
   * @param pointerManager
   * @param options
   * @param advanceTimers
   */
  gesture: (
    pointerManager: PointerManager,
    options: Options,
    advanceTimers?: (ms: number) => Promise<void>,
  ) => Promise<void>;
};
