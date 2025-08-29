import { Gesture } from '../../core';

export class MockBadOverrideIgnoreGesture extends Gesture<string> {
  protected readonly state = {};

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: { preventDefault?: boolean };

  protected readonly mutableStateType!: never;

  protected resetState(): void {}

  public clone(overrides?: Record<string, unknown>): MockBadOverrideIgnoreGesture {
    return new MockBadOverrideIgnoreGesture({
      name: this.name,
      preventDefault: true,
      ...overrides,
    });
  }
}
