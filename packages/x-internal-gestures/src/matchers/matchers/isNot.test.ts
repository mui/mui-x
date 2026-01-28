import { describe, expect, it } from 'vitest';
import { Gesture } from '../../core';
import { MatcherState } from '../Matcher.types';
import { toBeClonable } from './toBeClonable';
import { toUpdateOptions } from './toUpdateOptions';
import { toUpdateState } from './toUpdateState';

// Create a basic gesture class for testing
class TestGesture extends Gesture<string> {
  protected readonly state = {};

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: never;

  protected readonly mutableStateType!: never;

  protected resetState(): void {}

  public clone(): TestGesture {
    return new TestGesture({
      name: this.name,
    });
  }
}

// Create a test state with isNot = true to simulate .not usage
const fakeState = {
  isNot: true,
  equals: (a: unknown, b: unknown) => a === b,
} as MatcherState;

describe('Matchers with isNot property', () => {
  it('toUpdateOptions should throw an error when used with .not', () => {
    expect(() => {
      toUpdateOptions.call(fakeState, TestGesture, { preventDefault: true });
    }).toThrow('toUpdateOptions matcher does not support negation');
  });

  it('toBeClonable should throw an error when used with .not', () => {
    expect(() => {
      toBeClonable.call(fakeState, TestGesture, {});
    }).toThrow('toBeClonable matcher does not support negation');
  });

  it('toUpdateState should throw an error when used with .not', () => {
    expect(() => {
      toUpdateState.call(fakeState, TestGesture, { testState: true });
    }).toThrow('toUpdateState matcher does not support negation');
  });
});
