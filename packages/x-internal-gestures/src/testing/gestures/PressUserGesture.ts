import { PointerManager } from '../PointerManager';
import { PointerType } from '../types/Pointers';
import type { PressUserGestureOptions } from './PressUserGesture.types';

/**
 * Implementation of the press gesture for testing.
 *
 * @param options - The options for the press gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the press gesture is completed.
 */
export const press = async <P extends PointerType>(
  pointerManager: PointerManager,
  options: PressUserGestureOptions<P>,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const { target, duration = 500 } = options;

  if (!target) {
    throw new Error('Target element is required for press gesture');
  }

  // Parse pointer(s) based on pointer type
  let pointersArray;
  if (pointerManager.mode === 'mouse') {
    // For mouse, we use the MousePointer type from the options
    const mousePointer = 'pointer' in options ? options.pointer : undefined;
    pointersArray = [pointerManager.parseMousePointer(mousePointer, target)];
  } else {
    // For touch, we use the Pointers type from the options
    const touchPointers = 'pointers' in options ? options.pointers : undefined;
    pointersArray = pointerManager.parsePointers(touchPointers, target, {
      amount: 1,
      distance: 0,
    });
  }

  // Press down all pointers
  for (const pointer of pointersArray) {
    pointerManager.pointerDown(pointer);
  }

  // Wait for the specified duration
  if (advanceTimers) {
    await advanceTimers(duration);
  } else {
    await new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  // Release all pointers
  for (const pointer of pointersArray) {
    pointerManager.pointerUp(pointer);
  }
};
