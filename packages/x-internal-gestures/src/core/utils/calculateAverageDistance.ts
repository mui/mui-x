import { PointerData } from '../PointerManager';
import { getDistance } from './getDistance';

/**
 * Calculate the average distance between all pairs of pointers
 */
export function calculateAverageDistance(pointers: PointerData[]): number {
  if (pointers.length < 2) {
    return 0;
  }

  let totalDistance = 0;
  let pairCount = 0;

  // Calculate distance between each pair of pointers
  for (let i = 0; i < pointers.length; i += 1) {
    for (let j = i + 1; j < pointers.length; j += 1) {
      totalDistance += getDistance(
        { x: pointers[i].clientX, y: pointers[i].clientY },
        { x: pointers[j].clientX, y: pointers[j].clientY },
      );
      pairCount += 1;
    }
  }

  // Return average distance
  return pairCount > 0 ? totalDistance / pairCount : 0;
}
