import { MousePointer, Pointers, PointerType } from '../types/Pointers';

export type TapUserGestureOptions<P extends PointerType> = {
  /**
   * The target element to tap on.
   */
  target: Element;
  /**
   * The amount of taps to be performed.
   *
   * @default 1
   */
  taps?: number;
  /**
   * The delay between taps in milliseconds.
   *
   * @default 50
   */
  delay?: number;
} & (P extends 'mouse'
  ? {
      /**
       * The pointer configuration to be used.
       */
      pointer?: MousePointer;
    }
  : {
      /**
       * The pointers configuration to be used.
       *
       * It can be an object with the amount and distance properties, or an array of pointers.
       *
       * @default
       * { amount: 1, distance: 50 }
       */
      pointers?: Pointers;
    });

export type TapUserGestureRoot<P extends PointerType> = {
  /**
   * Taps on the target element.
   *
   * @param {TapUserGestureOptions<P>} options - Configuration for the tap gesture
   * @returns {Promise<void>} A promise that resolves when the tap gesture is completed
   */
  tap: (options: TapUserGestureOptions<P>) => Promise<void>;
};
