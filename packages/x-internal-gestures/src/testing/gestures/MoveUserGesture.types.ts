import { MousePointer } from '../types/Pointers';

export type MoveUserGestureOptions = {
  /**
   * The target element to start the move on.
   */
  target: Element;
  /**
   * The pointer configuration to be used.
   */
  pointer?: MousePointer;
  /**
   * The distance to move by in pixels.
   *
   * ```ts
   *  <=0 // No move
   *  >0  // Move
   * ```
   */
  distance: number;
  /**
   * The duration of the move in milliseconds.
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
   * The angle of the move in degrees.
   *
   * ```ts
   * 0 // Horizontal move
   * 90 // Vertical move
   * 45 // Diagonal move
   * ```
   *
   * @default 0
   */
  angle?: number;
};

export type MoveUserGestureRoot = {
  /**
   * Sets up the move gesture with the given options.
   *
   * @param options
   * @returns The move gesture builder.
   */
  move: (options: MoveUserGestureOptions) => Promise<void>;
};
