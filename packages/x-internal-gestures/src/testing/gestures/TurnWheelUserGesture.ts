import { PointerManager } from '../PointerManager';
import type { TurnWheelUserGestureOptions } from './TurnWheelUserGesture.types';

/**
 * Implementation of the turnWheel gesture for testing.
 *
 * @param options - The options for the turnWheel gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the turnWheel gesture is completed.
 */
export const turnWheel = async (
  pointerManager: PointerManager,
  options: TurnWheelUserGestureOptions,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const {
    target,
    pointer,
    delay = 50,
    deltaX = 0,
    deltaY = 100,
    deltaZ = 0,
    deltaMode = 0,
    turns = 1,
  } = options;

  if (!target) {
    throw new Error('Target element is required for turnWheel gesture');
  }

  const parsedPointer = pointerManager.parseMousePointer(pointer, target);

  // Create the WheelEvent
  const createWheelEvent = () => {
    return new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: parsedPointer.x,
      clientY: parsedPointer.y,
      deltaX,
      deltaY,
      deltaZ,
      deltaMode,
    });
  };

  // Dispatch wheel events
  for (let i = 0; i < turns; i += 1) {
    const wheelEvent = createWheelEvent();
    parsedPointer.target.dispatchEvent(wheelEvent);

    if (i < turns - 1) {
      // Wait for the specified delay between turns, except for the last one
      if (advanceTimers) {
        // eslint-disable-next-line no-await-in-loop
        await advanceTimers(delay);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, delay);
        });
      }
    }
  }
};
