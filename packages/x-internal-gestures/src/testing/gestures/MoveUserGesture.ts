import { PointerManager } from '../PointerManager';
import type { MoveUserGestureOptions } from './MoveUserGesture.types';

/**
 * Implementation of the move gesture for testing.
 *
 * @param options - The options for the move gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the move gesture is completed.
 */
export const move = async (
  pointerManager: PointerManager,
  options: MoveUserGestureOptions,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const { target, pointer, distance, duration = 500, steps = 10, angle = 0 } = options;

  if (!target) {
    throw new Error('Target element is required for move gesture');
  }

  if (distance <= 0) {
    // No movement required
    return;
  }

  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Calculate the move distance in each direction
  const deltaX = Math.cos(rad) * distance;
  const deltaY = Math.sin(rad) * distance;

  const parsedPointer = pointerManager.parseMousePointer(pointer, target);

  // Perform the move in steps
  const stepDelayMs = duration / steps;

  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;

    const startX = parsedPointer.x!;
    const startY = parsedPointer.y!;
    const currentX = startX + deltaX * progress;
    const currentY = startY + deltaY * progress;

    pointerManager.pointerMove({
      id: parsedPointer.id,
      target: parsedPointer.target,
      x: currentX,
      y: currentY,
    });

    if (step < steps) {
      if (advanceTimers) {
        // eslint-disable-next-line no-await-in-loop
        await advanceTimers(stepDelayMs);
      } else {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, stepDelayMs);
        });
      }
    }
  }
};
