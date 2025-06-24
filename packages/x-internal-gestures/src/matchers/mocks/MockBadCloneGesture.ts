import { Gesture } from '../../core';

export class MockBadCloneGesture extends Gesture<string> {
  protected readonly state = {};

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: { preventDefault?: boolean };

  protected readonly mutableStateType!: never;

  // eslint-disable-next-line class-methods-use-this
  protected resetState(): void {}

  public clone(): MockBadCloneGesture {
    return this;
  }
}
