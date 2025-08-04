import { GestureState } from '../../core';

export type MockState = GestureState & {
  isDragging: boolean;
  startPosition: { x: number; y: number };
  currentDistance?: number;
  customValue?: string;
};
