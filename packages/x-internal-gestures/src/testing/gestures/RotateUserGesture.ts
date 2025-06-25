import { PointerManager } from '../PointerManager';
import type { RotateUserGestureOptions } from './RotateUserGesture.types';

/**
 * Implementation of the rotate gesture for testing.
 *
 * @param options - The options for the rotate gesture.
 * @param advanceTimers - Optional function to advance timers in tests.
 * @returns A promise that resolves when the rotate gesture is completed.
 */
export const rotate = async (
  pointerManager: PointerManager,
  options: RotateUserGestureOptions,
  advanceTimers?: (ms: number) => Promise<void>,
): Promise<void> => {
  const {
    target,
    pointers,
    duration = 500,
    steps = 10,
    rotationAngle = 90,
    rotationCenter,
    releasePointers = true,
  } = options;

  if (!target) {
    throw new Error('Target element is required for rotate gesture');
  }

  // Parse pointers configuration
  const pointersArray = pointerManager.parsePointers(pointers, target, {
    amount: 2,
    distance: 50,
  });

  if (pointersArray.length < 2) {
    throw new Error('Rotate gesture requires at least 2 pointers');
  }

  // Start the rotate gesture by pressing down all pointers
  for (const pointer of pointersArray) {
    pointerManager.pointerDown(pointer);
  }

  // Calculate the center of rotation
  let center;
  if (rotationCenter) {
    center = rotationCenter;
  } else {
    // Calculate the center point between the pointers
    const sumX = pointersArray.reduce((sum, p) => sum + p.x, 0);
    const sumY = pointersArray.reduce((sum, p) => sum + p.y, 0);
    center = {
      x: sumX / pointersArray.length,
      y: sumY / pointersArray.length,
    };
  }

  // Calculate the per-step rotation amount
  const stepDelayMs = duration / steps;
  const stepRotation = rotationAngle / steps;

  // Store the initial radius and angle for each pointer
  const pointerDetails = pointersArray.map((pointer) => {
    // Calculate the radius (distance from center)
    const dx = pointer.x - center.x;
    const dy = pointer.y - center.y;
    const radius = Math.sqrt(dx * dx + dy * dy);

    // Calculate the initial angle in radians
    const initialAngle = Math.atan2(dy, dx);

    return {
      id: pointer.id,
      target: pointer.target,
      radius,
      initialAngle,
    };
  });

  // Perform the rotation in steps
  for (let step = 1; step <= steps; step += 1) {
    const rotationInRadians = (stepRotation * step * Math.PI) / 180;

    for (const detail of pointerDetails) {
      // Calculate new position after rotation
      const newAngle = detail.initialAngle + rotationInRadians;
      const newX = center.x + detail.radius * Math.cos(newAngle);
      const newY = center.y + detail.radius * Math.sin(newAngle);

      pointerManager.pointerMove({
        id: detail.id,
        target: detail.target,
        x: newX,
        y: newY,
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
    for (const detail of pointerDetails) {
      const finalRotationInRadians = (rotationAngle * Math.PI) / 180;
      const newAngle = detail.initialAngle + finalRotationInRadians;
      const newX = center.x + detail.radius * Math.cos(newAngle);
      const newY = center.y + detail.radius * Math.sin(newAngle);

      pointerManager.pointerUp({
        id: detail.id,
        target: detail.target,
        x: newX,
        y: newY,
      });
    }
  } else if (Array.isArray(releasePointers)) {
    // Release only specific pointers
    for (const detail of pointerDetails) {
      if (releasePointers.includes(detail.id)) {
        const finalRotationInRadians = (rotationAngle * Math.PI) / 180;
        const newAngle = detail.initialAngle + finalRotationInRadians;
        const newX = center.x + detail.radius * Math.cos(newAngle);
        const newY = center.y + detail.radius * Math.sin(newAngle);

        pointerManager.pointerUp({
          id: detail.id,
          target: detail.target,
          x: newX,
          y: newY,
        });
      }
    }
  }
};
