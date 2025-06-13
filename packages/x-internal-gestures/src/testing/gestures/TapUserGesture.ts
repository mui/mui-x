import { PointerManager } from '../PointerManager';
import { PointerType } from '../types/Pointers';
import type { TapUserGestureOptions } from './TapUserGesture.types';

/**
 * Implementation of the tap gesture for testing.
 *
 * @param options - The options for the tap gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the tap gesture is completed.
 */
export const tap = async <P extends PointerType>(
  pointerManager: PointerManager,
  options: TapUserGestureOptions<P>,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const { target, taps = 1, delay = 50 } = options;

  if (!target) {
    throw new Error('Target element is required for tap gesture');
  }

  // Parse pointer(s) based on pointer type
  let pointersArray;
  if (pointerManager.mode === 'mouse') {
    // For mouse, we use the MousePointer type from the options
    const mousePointer = 'pointer' in options ? options.pointer : undefined;
    pointersArray = [pointerManager.parseMousePointer(mousePointer, target)];
  }

  // Perform the specified number of taps
  for (let tapCount = 0; tapCount < taps; tapCount += 1) {
    if (pointerManager.mode === 'touch') {
      // For touch, we use the Pointers type from the options
      const touchPointers = 'pointers' in options ? options.pointers : undefined;
      pointersArray = pointerManager.parsePointers(touchPointers, target, {
        amount: 1,
        distance: 0,
      });
    }

    if (!pointersArray || pointersArray.length === 0) {
      return;
    }

    // For each tap, press and release all pointers
    for (const pointer of pointersArray) {
      pointerManager.pointerDown(pointer);
    }

    // Short delay (10ms) between down and up within a single tap
    // eslint-disable-next-line no-await-in-loop
    await (advanceTimers
      ? advanceTimers(10)
      : new Promise((resolve) => {
          setTimeout(resolve, 10);
        }));

    for (const pointer of pointersArray) {
      pointerManager.pointerUp(pointer);
    }

    // If this isn't the last tap, wait for the specified delay before the next tap
    if (tapCount < taps - 1) {
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
