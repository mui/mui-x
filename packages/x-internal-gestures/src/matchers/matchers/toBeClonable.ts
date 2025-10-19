import { Gesture } from '../../core';
import { AnyGesture } from '../AnyGesture';
import { MatcherState, SyncMatcherFn } from '../Matcher.types';
import { messages } from '../messages';

export type ToBeClonable<R = AnyGesture> = {
  /**
   * Asserts that the provided gesture can be cloned and that the clone
   * has the same properties as the original gesture, or overridden properties
   * if specified.
   *
   * Internally it will:
   * 1. Instantiate the gesture
   * 2. Create a clone of the initial gesture
   * 3. Verify the clone is a different instance than the original
   * 4. Check that the clone has all required gesture properties and methods
   * 5. Ensure any provided overrides are correctly applied to the clone
   * 6. Verify that non-overridden properties match the original gesture
   *
   * This matcher is useful for ensuring that gestures can be properly duplicated
   * while maintaining their functionality and allowing customization.
   *
   * ## Requirements
   *
   * For this matcher to work correctly, the gesture must:
   * - Properly implement the `clone()` method to create a new instance
   * - Return a different instance than the original when cloned
   * - Apply any provided overrides to the cloned instance
   * - Maintain non-overridden property values from the original
   *
   * @example
   * ```ts
   * // Check if the gesture can be cloned with the same properties
   * expect(MoveGesture).toBeClonable();
   *
   * // Check if the gesture can be cloned with overridden properties
   * expect(MoveGesture).toBeClonable({ preventDefault: true });
   * ```
   */
  toBeClonable<
    G = R extends new (...args: any[]) => infer J ? (J extends Gesture<string> ? J : never) : never,
    // @ts-expect-error, accessing protected property for testing purposes
    OverrideOptions extends Partial<G['mutableOptionsType']> = Partial<G['mutableOptionsType']>,
  >(
    overrides?: OverrideOptions,
  ): void;
};

export const toBeClonable: SyncMatcherFn = function toBeClonable(
  this: MatcherState,
  received: AnyGesture,
  expected: Record<string, unknown>,
) {
  // Check if the matcher is being used with .not and throw an error since it's not supported
  if (this.isNot) {
    throw new Error(messages.negationError('toBeClonable'));
  }

  // Validate inputs
  if (!received) {
    return {
      pass: false,
      message: messages.invalidClass,
    };
  }

  if (expected !== null && expected !== undefined && typeof expected !== 'object') {
    return {
      pass: false,
      message: () => messages.invalidObjectParam('options'),
    };
  }

  // eslint-disable-next-line new-cap
  const original = new received({ name: 'beClonable' });
  const overrides = expected;
  const clone = original.clone(overrides);

  // Check that the clone is a different instance
  const isNotSameInstance = original !== clone;
  const isInstanceOfGesture = clone instanceof Gesture;

  // Check that overridden properties were applied
  let overridesApplied = true;
  if (overrides) {
    for (const key in overrides) {
      if (Reflect.has(clone, key)) {
        // @ts-expect-error, we checked that the key exists
        const valueMatches = this.equals(clone[key], overrides[key]);
        if (!valueMatches) {
          overridesApplied = false;
          break;
        }
      }
    }
  }

  // Check that non-overridden properties match the original
  const nonOverriddenPropertiesMatch: string[] = [];
  for (const key in original) {
    // Skip checking overridden properties and functions
    if (overrides && key in overrides) {
      continue;
    }
    // @ts-expect-error, its ok if original[key] = undefined
    if (typeof original[key] === 'function' || key.endsWith('Gesture')) {
      continue;
    }

    if (Reflect.has(clone, key)) {
      // @ts-expect-error, we checked that the key exists
      const valueMatches = this.equals(clone[key], original[key]);
      if (!valueMatches) {
        nonOverriddenPropertiesMatch.push(key);
        break;
      }
    }
  }

  const pass =
    isNotSameInstance &&
    isInstanceOfGesture &&
    overridesApplied &&
    nonOverriddenPropertiesMatch.length === 0;

  if (pass) {
    return {
      pass: true,
      message: () => `Expected gesture not to be clonable, but it was.`,
    };
  }

  return {
    pass: false,
    message: () => {
      if (!isInstanceOfGesture) {
        return 'Expected clone to be an instance of Gesture, but it is not.';
      }
      if (!overridesApplied) {
        return 'Expected clone to have overridden properties applied, but it does not.';
      }
      if (nonOverriddenPropertiesMatch.length > 0) {
        return `Expected non-overridden properties to match the original, but they do not. Mismatched properties: ${nonOverriddenPropertiesMatch.join(
          ', ',
        )}`;
      }

      return 'Expected clone to be a different instance than the original, but they are the same.';
    },
  };
};
