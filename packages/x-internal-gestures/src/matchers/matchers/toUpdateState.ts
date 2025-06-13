import { Gesture, PointerManager } from '../../core';
import { ActiveGesturesRegistry } from '../../core/ActiveGesturesRegistry';
import { AnyGesture } from '../AnyGesture';
import { MatcherState, SyncMatcherFn } from '../Matcher.types';
import { messages } from '../messages';

export type ToUpdateState<R = AnyGesture> = {
  /**
   * Asserts that the provided gesture state can be updated by emitting a change event
   * and that the state properties match the expected values.
   *
   * Internally it will:
   * 1. Instantiate the gesture twice
   * 2. Initialize one of the instances with a temporary element
   * 3. Emit a custom event named `${gestureName}ChangeState` with the expected state
   * 4. Verify that the state was properly updated
   * 5. Clean up resources by destroying the gesture and removing the temporary element
   *
   * This matcher is useful for verifying that gestures correctly handle runtime state updates.
   *
   * ## Requirements
   *
   * For this matcher to work correctly, the gesture must:
   * - Listen for events named `${gestureName}ChangeState`
   * - Implement the `updateState()` method to update its state properties
   * - Have a working `destroy()` method to clean up resources
   *
   * @example
   * ```ts
   * // Check if gesture state can be updated
   * expect(MoveGesture).toUpdateState({ isDragging: true });
   * ```
   */
  toUpdateState<
    G = R extends new (...args: any[]) => infer J ? (J extends Gesture<string> ? J : never) : never,
    // @ts-expect-error, accessing protected property for testing purposes
    ExpectedState extends Partial<G['mutableStateType']> = Partial<G['mutableStateType']>,
  >(
    expectedState: ExpectedState,
  ): void;
};

export const toUpdateState: SyncMatcherFn = function toUpdateState(
  this: MatcherState,
  received: AnyGesture,
  expected: Record<string, unknown>,
) {
  // Check if the matcher is being used with .not and throw an error since it's not supported
  if (this.isNot) {
    throw new Error(messages.negationError('toUpdateState'));
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
      message: () => messages.invalidOrEmptyObjectParam('state'),
    };
  }

  // eslint-disable-next-line new-cap
  const original = new received({ name: 'updateState' });
  // eslint-disable-next-line new-cap
  const clone = new received({ name: 'updateState' });
  const expectedState = expected;
  const target = document.createElement('div');
  document.body.appendChild(target);

  const pointerManager = new PointerManager({});
  const gestureRegistry = new ActiveGesturesRegistry();

  // Setup the environment for testing
  clone.init(target, pointerManager, gestureRegistry);

  // Create and dispatch the change state event
  const changeStateEvent = new CustomEvent(`${clone.name}ChangeState`, {
    detail: expectedState,
  });

  target.dispatchEvent(changeStateEvent);

  const actualStateValues = {};
  const originalStateValues = {};

  // Track which keys didn't update correctly
  const incorrectKeys: string[] = [];

  // @ts-expect-error, accessing protected property for testing
  const cloneState = clone.state;
  // @ts-expect-error, accessing protected property for testing
  const originalState = original.state;

  // Only compare keys that are in the expected state
  for (const key in expectedState) {
    if (Reflect.has(cloneState, key)) {
      // @ts-expect-error, we checked that the key exists
      actualStateValues[key] = cloneState[key];
      // @ts-expect-error, we don't care if the key exists
      originalStateValues[key] = originalState[key];

      // Track keys that didn't update as expected
      // @ts-expect-error, we checked that the key exists
      if (!this.equals(cloneState[key], expectedState[key])) {
        incorrectKeys.push(key);
      }
    }
  }

  // Clean up
  clone.destroy();
  document.body.removeChild(target);

  const hasUpdated = this.equals(actualStateValues, expectedState);
  const isSameAsOriginal = this.equals(originalStateValues, expectedState);
  const pass = hasUpdated && !isSameAsOriginal;

  // If pass, we set the message if the "not" condition is true
  if (pass) {
    return {
      pass: true,
      message: () => 'Expected state not to be updatable to the specified values, but it was.',
      actual: actualStateValues,
      expected: expectedState,
    };
  }

  return {
    pass: false,
    message: () => {
      if (isSameAsOriginal) {
        return 'Expected state to be updated, but it remained the same as the original.';
      }
      return 'Expected state to be updated to the specified values, but it was not.';
    },
    actual: actualStateValues,
    expected: expectedState,
  };
};
