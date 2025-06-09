import { Pointers } from '../types/Pointers';

export type PanUserGestureOptions = {
  /**
   * The target element to start the pan on.
   */
  target: Element;
  /**
   * The pointers configuration to be used.
   *
   * It can be an object with the amount and distance properties, or an array of pointers.
   *
   * @default
   * { amount: 1, distance: 0 }
   */
  pointers?: Pointers;
  /**
   * The distance to pan by in pixels.
   *
   * ```ts
   *  <=0 // No pan
   *  >0  // Pan
   * ```
   */
  distance: number;
  /**
   * The duration of the pan in milliseconds.
   *
   * @default 500
   */
  duration?: number;
  /**
   * The amount of steps to be performed.
   *
   * @default 10
   */
  steps?: number;
  /**
   * The angle of the pan in degrees.
   *
   * ```ts
   * 0 // Horizontal pan
   * 90 // Vertical pan
   * 45 // Diagonal pan
   * ```
   *
   * @default 0
   */
  angle?: number;
  /**
   * Defines if the pointers should be released after the pan gesture.
   *
   * If set to true, all pointers will be released.
   * If set to an array of ids, only the pointers with the given ids will be released.
   * If set to false, no pointers will be released.
   *
   * Useful for running expects while the pointers are still pressed.
   * Or to test partially releasing pointers.
   *
   * @default true
   */
  releasePointers?: boolean | number[];
};

export type PanUserGestureRoot = {
  /**
   * Sets up the pan gesture with the given options.
   *
   * @param options
   * @returns The pan gesture builder.
   */
  pan: (options: PanUserGestureOptions) => Promise<void>;
};
