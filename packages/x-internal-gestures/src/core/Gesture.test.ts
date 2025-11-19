import { describe, expect, it } from 'vitest';
import { Gesture } from '.';

export class MockGesture extends Gesture<string> {
  protected state = {};

  protected readonly isSinglePhase!: false;

  protected readonly eventType!: never;

  protected readonly optionsType!: never;

  protected readonly mutableOptionsType!: never;

  protected readonly mutableStateType!: never;

  protected resetState(): void {}

  // Extra property for coverage
  public extra = () => {};

  // Add custom properties for testing complex options
  public complexOption?: { nestedValue: number; enabled: boolean };

  public arrayOption?: string[];

  public clone(): MockGesture {
    return this;
  }
}

describe('Gesture', () => {
  it('should throw an error when creating a gesture without options', () => {
    // @ts-expect-error, we are testing invalid usage
    expect(() => new MockGesture()).toThrowError('Gesture must be initialized with a valid name.');
  });

  it('should throw an error when creating a gesture with an invalid name', () => {
    expect(() => new MockGesture({ name: '' })).toThrowError(
      'Gesture must be initialized with a valid name.',
    );
  });

  it('should throw an error when creating a gesture with the same name as a native event', () => {
    expect(() => new MockGesture({ name: 'wheel' })).toThrowError(
      `Gesture can't be created with a native event name. Tried to use "wheel". Please use a custom name instead.`,
    );
  });
});
