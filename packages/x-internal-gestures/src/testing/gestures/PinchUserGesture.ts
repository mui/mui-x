import { PointerManager } from '../PointerManager';
import type { PinchUserGestureOptions } from './PinchUserGesture.types';

/**
 * Implementation of the pinch gesture for testing.
 *
 * @param options - The options for the pinch gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the pinch gesture is completed.
 */
export const pinch = async (
  pointerManager: PointerManager,
  options: PinchUserGestureOptions,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const {
    target,
    pointers,
    distance,
    duration = 500,
    steps = 10,
    angle = 0,
    releasePointers = true,
  } = options;

  if (!target) {
    throw new Error('Target element is required for pinch gesture');
  }

  // Handle no movement case
  if (distance === 0) {
    return;
  }

  // Convert angle to radians
  const rad = (angle * Math.PI) / 180;

  // Parse pointers configuration
  const pointersArray = pointerManager.parsePointers(pointers, target, {
    amount: 2,
    distance: 50,
  });

  if (pointersArray.length < 2) {
    throw new Error('Pinch gesture requires at least 2 pointers');
  }

  // Start the pinch gesture by pressing down all pointers
  for (const pointer of pointersArray) {
    pointerManager.pointerDown(pointer);
  }

  // Calculate the direction and per-step movement amount for each pointer
  const stepDelayMs = duration / steps;
  const isPinchOut = distance > 0;
  const absDistance = Math.abs(distance);

  // Calculate the centroid of all pointers
  const centroid = {
    x: pointersArray.reduce((sum, p) => sum + p.x, 0) / pointersArray.length,
    y: pointersArray.reduce((sum, p) => sum + p.y, 0) / pointersArray.length,
  };

  // Calculate movement vectors for each pointer
  // Each pointer moves radially from/toward the centroid
  const movementVectors = pointersArray.map((pointer) => {
    // Calculate the angle from centroid to this pointer
    const dx = pointer.x - centroid.x;
    const dy = pointer.y - centroid.y;
    const pointerAngle = Math.atan2(dy, dx);

    // Apply the optional rotation angle
    const adjustedAngle = pointerAngle + rad;

    // Calculate x and y components of movement
    // Divide by number of pointers to distribute the total distance
    const perPointerDistance = absDistance / pointersArray.length;
    return {
      id: pointer.id,
      target: pointer.target,
      startX: pointer.x,
      startY: pointer.y,
      deltaX: Math.cos(adjustedAngle) * perPointerDistance * (isPinchOut ? 1 : -1),
      deltaY: Math.sin(adjustedAngle) * perPointerDistance * (isPinchOut ? 1 : -1),
    };
  });

  // Perform the pinch in steps
  for (let step = 1; step <= steps; step += 1) {
    const progress = step / steps;

    for (const move of movementVectors) {
      const currentX = move.startX + move.deltaX * progress;
      const currentY = move.startY + move.deltaY * progress;

      pointerManager.pointerMove({
        id: move.id,
        target: move.target,
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
    for (const move of movementVectors) {
      const finalX = move.startX + move.deltaX;
      const finalY = move.startY + move.deltaY;
      pointerManager.pointerUp({
        id: move.id,
        target: move.target,
        x: finalX,
        y: finalY,
      });
    }
  } else if (Array.isArray(releasePointers)) {
    // Release only specific pointers
    for (const move of movementVectors) {
      if (releasePointers.includes(move.id)) {
        const finalX = move.startX + move.deltaX;
        const finalY = move.startY + move.deltaY;
        pointerManager.pointerUp({
          id: move.id,
          target: move.target,
          x: finalX,
          y: finalY,
        });
      }
    }
  }
};
