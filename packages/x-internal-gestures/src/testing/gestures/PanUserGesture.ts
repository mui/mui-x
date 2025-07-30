import { PointerManager } from '../PointerManager';
import type { PointerType } from '../types/Pointers';
import { PanUserGestureOptions } from './PanUserGesture.types';

/**
 * Implementation of the pan gesture.
 *
 * @param options - The options for the pan gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the pan gesture is completed.
 */
export const pan = async <P extends PointerType>(
  pointerManager: PointerManager,
  options: PanUserGestureOptions<P>,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const {
    target,
    distance,
    duration = 500,
    steps = 10,
    angle = 0,
    releasePointers = true,
  } = options;

  if (!target) {
    throw new Error('Target element is required for pan gesture');
  }

  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Calculate the move distance in each direction
  const deltaX = Math.cos(rad) * distance;
  const deltaY = Math.sin(rad) * distance;

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

  // Start the pan gesture by pressing down all pointers
  for (const pointer of pointersArray) {
    pointerManager.pointerDown(pointer);
  }

  // Perform the pan in steps
  const stepDelayMs = duration / steps;

  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;

    for (const pointer of pointersArray) {
      const startX = pointer.x!;
      const startY = pointer.y!;
      const currentX = startX + deltaX * progress;
      const currentY = startY + deltaY * progress;

      pointerManager.pointerMove({
        id: pointer.id,
        target: pointer.target,
        x: currentX,
        y: currentY,
      });
    }

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

  // Handle pointer release based on the releasePointers option
  if (releasePointers === true) {
    // Release all pointers
    for (const pointer of pointersArray) {
      const finalX = pointer.x! + deltaX;
      const finalY = pointer.y! + deltaY;
      pointerManager.pointerUp({
        id: pointer.id,
        target: pointer.target,
        x: finalX,
        y: finalY,
      });
    }
  } else if (Array.isArray(releasePointers)) {
    // Release only specific pointers
    for (const pointer of pointersArray) {
      if (releasePointers.includes(pointer.id!)) {
        const finalX = pointer.x! + deltaX;
        const finalY = pointer.y! + deltaY;
        pointerManager.pointerUp({
          id: pointer.id,
          target: pointer.target,
          x: finalX,
          y: finalY,
        });
      }
    }
  }
};
