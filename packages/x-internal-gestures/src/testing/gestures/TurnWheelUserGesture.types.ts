import { MousePointer } from '../types/Pointers';

export type TurnWheelUserGestureOptions = {
  /**
   * The target element to turn wheel on.
   */
  target: Element;
  /**
   * The pointer configuration to be used.
   */
  pointer?: MousePointer;
  /**
   * The delay between turns in milliseconds.
   *
   * @default 50
   */
  delay?: number;
  /**
   * The deltaX value to simulate horizontal scrolling.
   * Positive values scroll right, negative values scroll left.
   *
   * @default 0
   */
  deltaX?: number;
  /**
   * The deltaY value to simulate vertical scrolling.
   * Positive values scroll down, negative values scroll up.
   *
   * @default 100
   */
  deltaY?: number;
  /**
   * The deltaZ value to simulate depth scrolling (if supported).
   *
   * @default 0
   */
  deltaZ?: number;
  /**
   * The delta mode for the wheel event.
   * 0: Pixel
   * 1: Line
   * 2: Page
   *
   * @default 0
   */
  deltaMode?: number;
  /**
   * Number of wheel events to dispatch.
   *
   * @default 1
   */
  turns?: number;
};

export type TurnWheelUserGestureRoot = {
  /**
   * Turns the mouse wheel on the target element.
   *
   * @param options
   * @returns A promise that resolves when the turnWheel gesture is completed.
   */
  turnWheel: (options: TurnWheelUserGestureOptions) => Promise<void>;
};
