import { Gesture } from '../../core';

export class MockBadOverrideGesture extends Gesture<string> {
  protected readonly state = {};

  declare protected readonly isSinglePhase: false;

  declare protected readonly eventType: never;

  declare protected readonly optionsType: never;

  declare protected readonly mutableOptionsType: { preventDefault?: boolean };

  declare protected readonly mutableStateType: never;

  protected resetState(): void {}

  public clone(): MockBadOverrideGesture {
    return new MockBadOverrideGesture({
      name: this.name,
    });
  }
}
