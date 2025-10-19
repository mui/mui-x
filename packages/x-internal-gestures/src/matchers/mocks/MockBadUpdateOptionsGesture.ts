import { Gesture } from '../../core';

export class MockBadUpdateOptionsGesture extends Gesture<string> {
  protected readonly state = {};

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: { preventDefault?: boolean };

  protected readonly mutableStateType!: never;

  protected resetState(): void {}

  public clone(overrides?: Record<string, unknown>): MockBadUpdateOptionsGesture {
    return new MockBadUpdateOptionsGesture({
      name: this.name,
      ...overrides,
    });
  }

  // We remove the updateOptions implementation
  protected updateOptions(): void {}
}
