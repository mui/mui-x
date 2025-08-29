import { PointerData } from '../PointerManager';
import { getAngle } from './getAngle';

/**
 * Calculate the rotation angle between pointers
 * This uses the angle between the first two pointers relative to the centroid
 */
export function calculateRotationAngle(pointers: PointerData[]): number {
  if (pointers.length < 2) {
    return 0;
  }

  // For rotation, we need exactly 2 pointers
  // Use first two since they're most likely the primary pointers
  const p1 = { x: pointers[0].clientX, y: pointers[0].clientY };
  const p2 = { x: pointers[1].clientX, y: pointers[1].clientY };

  return getAngle(p1, p2);
}
