import { Gesture, PointerManager } from '../../core';
import { ActiveGesturesRegistry } from '../../core/ActiveGesturesRegistry';
import { AnyGesture } from '../AnyGesture';
import { MatcherState, SyncMatcherFn } from '../Matcher.types';
import { messages } from '../messages';

export type ToUpdateOptions<R = AnyGesture> = {
  /**
   * Asserts that the provided gesture options can be updated by emitting a change event
   * and that the options match the expected values.
   *
   * Internally it will:
   * 1. Instantiate the gesture twice
   * 2. Initialize one of the instances with a temporary element
   * 3. Emit a custom event named `${gestureName}ChangeOptions` with the expected options
   * 4. Verify that the options were properly updated
   * 5. Clean up resources by destroying the gesture and removing the temporary element
   *
   * This matcher is useful for verifying that gestures correctly handle runtime option updates.
   *
   * ## Requirements
   *
   * For this matcher to work correctly, the gesture must:
   * - Listen for events named `${gestureName}ChangeOptions`
   * - Implement the `updateOptions()` method to update its properties
   * - Have a working `destroy()` method to clean up resources
   *
   * @example
   * ```ts
   * expect(MoveGesture).toUpdateOptions({ preventDefault: true });
   * ```
   */
  toUpdateOptions<
    G = R extends new (...args: any[]) => infer J ? (J extends Gesture<string> ? J : never) : never,
    // @ts-expect-error, accessing protected property for testing purposes
    ExpectedOptions extends Partial<G['mutableOptionsType']> = Partial<G['mutableOptionsType']>,
  >(
    expectedOptions: ExpectedOptions,
  ): void;
};

export const toUpdateOptions: SyncMatcherFn = function toUpdateOptions(
  this: MatcherState,
  received: AnyGesture,
  expected: Record<string, unknown>,
) {
  // Check if the matcher is being used with .not and throw an error since it's not supported
  if (this.isNot) {
    throw new Error(messages.negationError('toUpdateOptions'));
  }
  // Validate inputs
  if (!received) {
    return {
      pass: false,
      message: messages.invalidClass,
    };
  }

  if (!expected || typeof expected !== 'object' || Object.keys(expected).length === 0) {
    return {
      pass: false,
      message: () => messages.invalidOrEmptyObjectParam('options'),
    };
  }

  // eslint-disable-next-line new-cap
  const original = new received({ name: 'updateOptions' });
  // eslint-disable-next-line new-cap
  const clone = new received({ name: 'updateOptions' });
  const expectedOptions = expected;
  const target = document.createElement('div');
  document.body.appendChild(target);

  const pointerManager = new PointerManager({});
  const gestureRegistry = new ActiveGesturesRegistry();

  // Setup the environment for testing
  clone.init(target, pointerManager, gestureRegistry);

  // Create and dispatch the change options event
  const changeOptionsEvent = new CustomEvent(`${clone.name}ChangeOptions`, {
    detail: expectedOptions,
  });

  target.dispatchEvent(changeOptionsEvent);

  // Collect actual and original option values
  const actualOptions = {};
  const originalOptions = {};

  // Track which keys didn't update correctly
  const incorrectKeys: string[] = [];

  for (const key in expectedOptions) {
    if (Reflect.has(clone, key)) {
      // @ts-expect-error, we checked that the key exists
      actualOptions[key] = clone[key];
      // @ts-expect-error, we don't care if the key exists
      originalOptions[key] = original[key];

      // Track keys that didn't update as expected
      // @ts-expect-error, we checked that the key exists
      if (!this.equals(clone[key], expectedOptions[key])) {
        incorrectKeys.push(key);
      }
    }
  }

  // Clean up
  clone.destroy();
  document.body.removeChild(target);

  const hasUpdated = this.equals(actualOptions, expectedOptions);
  const isSameAsOriginal = this.equals(originalOptions, expectedOptions);
  const pass = hasUpdated && !isSameAsOriginal;

  // If pass, we set the message if the "not" condition is true
  if (pass) {
    return {
      pass: true,
      message: () => 'Expected options not to be updatable to the specified values, but they were.',
      actual: actualOptions,
      expected: expectedOptions,
    };
  }

  return {
    pass: false,
    message: () => {
      if (isSameAsOriginal) {
        return 'Expected options to be updated, but they remained the same as the original.';
      }
      return 'Expected options to be updated to the specified values, but they were not.';
    },
    actual: actualOptions,
    expected: expectedOptions,
  };
};
