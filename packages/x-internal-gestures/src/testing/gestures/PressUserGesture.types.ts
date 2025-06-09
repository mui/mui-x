import { MousePointer, Pointers, PointerType } from '../types/Pointers';

export type PressUserGestureOptions<P extends PointerType> = {
  /**
   * The target element to press on.
   */
  target: Element;
  /**
   * The duration of the press in milliseconds.
   *
   * @default 500
   */
  duration?: number;
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

export type PressUserGestureRoot<P extends PointerType> = {
  /**
   * Press on the target element.
   *
   * @param options
   * @returns A promise that resolves when the press gesture is completed.
   */
  press: (options: PressUserGestureOptions<P>) => Promise<void>;
};
