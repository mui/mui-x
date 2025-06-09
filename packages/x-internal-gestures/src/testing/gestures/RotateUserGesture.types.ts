import { Point } from '../types/Point';
import { Pointers } from '../types/Pointers';

export type RotateUserGestureOptions = {
  /**
   * The target element to start the rotate on.
   */
  target: Element;
  /**
   * The pointers configuration to be used.
   *
   * It can be an object with the amount and distance properties, or an array of pointers.
   *
   * @default
   * { amount: 2, distance: 50 }
   */
  pointers?: Pointers;
  /**
   * The duration of the rotate in milliseconds.
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
   * The angle to rotate to in degrees.
   *
   * @default 90
   */
  rotationAngle?: number;
  /**
   * The center of rotation.
   *
   * If not set and pointers are set, the center will be the center point between the pointers.
   * If not set and pointers are not set, the center will be the center of the target element.
   */
  rotationCenter?: Point;
  /**
   * Defines if the pointers should be released after the rotate gesture.
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

export type RotateUserGestureRoot = {
  /**
   * Sets up the rotate gesture with the given options.
   *
   * @param options
   * @returns The rotate gesture builder.
   */
  rotate: (options: RotateUserGestureOptions) => Promise<void>;
};
