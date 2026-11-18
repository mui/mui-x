import { Gesture } from '../../core';

export class MockBadOverrideIgnoreGesture extends Gesture<string> {
  protected readonly state = {};

  declare public readonly isSinglePhase: false;

  declare public readonly eventType: never;

  declare protected readonly optionsType: never;

  declare public readonly mutableOptionsType: { preventDefault?: boolean };

  declare public readonly mutableStateType: never;

  protected resetState(): void {}

  public clone(overrides?: Record<string, unknown>): MockBadOverrideIgnoreGesture {
    return new MockBadOverrideIgnoreGesture({
      name: this.name,
      preventDefault: true,
      ...overrides,
    });
  }
}
