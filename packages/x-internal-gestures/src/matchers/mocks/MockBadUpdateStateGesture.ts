import { Gesture } from '../../core';
import type { MockState } from './MockState';

export class MockBadUpdateStateGesture extends Gesture<string> {
  protected state: MockState = {
    isDragging: false,
    startPosition: { x: 0, y: 0 },
  };

  declare public readonly isSinglePhase: false;

  declare public readonly eventType: never;

  declare protected readonly optionsType: never;

  declare public readonly mutableOptionsType: never;

  declare public readonly mutableStateType: MockState;

  protected resetState(): void {
    this.state = {
      isDragging: false,
      startPosition: { x: 0, y: 0 },
    };
  }

  public clone(overrides?: Record<string, unknown>): MockBadUpdateStateGesture {
    return new MockBadUpdateStateGesture({
      name: this.name,
      ...overrides,
    });
  }

  // Override updateState to prevent updates
  // This simulates a broken implementation
  protected updateState(_: typeof this.mutableOptionsType): void {
    // Deliberately do nothing
  }
}
