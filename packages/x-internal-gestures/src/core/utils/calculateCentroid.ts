import { PointerData } from '../PointerManager';

/**
 * Calculate the centroid (average position) of multiple pointers
 */
export function calculateCentroid(pointers: PointerData[]): { x: number; y: number } {
  if (pointers.length === 0) {
    return { x: 0, y: 0 };
  }

  const sum = pointers.reduce(
    (acc, pointer) => {
      acc.x += pointer.clientX;
      acc.y += pointer.clientY;
      return acc;
    },
    { x: 0, y: 0 }
  );

  return {
    x: sum.x / pointers.length,
    y: sum.y / pointers.length,
  };
}
