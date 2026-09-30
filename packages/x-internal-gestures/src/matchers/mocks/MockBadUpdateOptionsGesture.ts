import { Gesture } from '../../core';

export class MockBadUpdateOptionsGesture extends Gesture<string> {
  protected readonly state = {};

  declare protected readonly isSinglePhase: false;

  declare protected readonly eventType: never;

  declare protected readonly optionsType: never;

  declare protected readonly mutableOptionsType: { preventDefault?: boolean };

  declare protected readonly mutableStateType: never;

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
