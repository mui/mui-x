'use client';
import { useTooltipPosition } from './useTooltipPosition';

export function useTooltipAnchor() {
  const position = useTooltipPosition();

  if (position === null) {
    return null;
  }

  return {
    getBoundingClientRect: () =>
      DOMRect.fromRect({ x: position.x, y: position.y, width: 0, height: 0 }),
  };
}
