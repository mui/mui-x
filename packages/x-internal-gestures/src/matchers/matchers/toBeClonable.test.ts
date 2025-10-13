import { describe, expect, it } from 'vitest';
import { getFakeState } from '../equals';
import { MockBadCloneGesture } from '../mocks/MockBadCloneGesture';
import { MockBadInstanceGesture } from '../mocks/MockBadInstanceGesture';
import { MockBadOverrideGesture } from '../mocks/MockBadOverrideGesture';
import { MockBadOverrideIgnoreGesture } from '../mocks/MockBadOverrideIgnoreGesture';
import { MockGoodGesture } from '../mocks/MockGoodGesture';
import { toBeClonable } from './toBeClonable';

const matcher = toBeClonable.bind(getFakeState());

describe('toBeClonable matcher', () => {
  it('should pass when a gesture can be cloned', () => {
    const result = matcher(MockGoodGesture);
    expect(result.pass).toBe(true);
  });

  it('should provide the correct "not" message when passing', () => {
    const result = matcher(MockGoodGesture);
    expect(result.pass).toBe(true);
    expect(result.message()).toBe('Expected gesture not to be clonable, but it was.');
  });

  it('should pass when a gesture can be cloned with overrides', () => {
    const result = matcher(MockGoodGesture, {
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['pan', 'pinch'],
    });
    expect(result.pass).toBe(true);
  });

  it('should pass for different inputs', () => {
    // Should pass when overriding with the same values
    const resultSameOptions = matcher(MockGoodGesture, {
      preventDefault: false,
      stopPropagation: false,
    });
    expect(resultSameOptions.pass).toBe(true);

    // Should pass when overriding some options
    const resultSomeOptions = matcher(MockGoodGesture, {
      preventDefault: true,
    });
    expect(resultSomeOptions.pass).toBe(true);
  });

  it('should not pass when the clone is the same instance as the original', () => {
    const result = matcher(MockBadCloneGesture);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected clone to be a different instance than the original, but they are the same.',
    );
  });

  it('should not pass when the clone is not an instance of Gesture', () => {
    const result = matcher(MockBadInstanceGesture);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected clone to be an instance of Gesture, but it is not.');
  });

  it('should not pass when the clone does not have overridden properties applied', () => {
    const result = matcher(MockBadOverrideGesture, { preventDefault: true });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected clone to have overridden properties applied, but it does not.',
    );
  });

  it('should not pass when non-overridden properties do not match the original', () => {
    const result = matcher(MockBadOverrideIgnoreGesture);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected non-overridden properties to match the original, but they do not. Mismatched properties: preventDefault',
    );
  });

  it('should handle invalid inputs gracefully', () => {
    const result = matcher(MockGoodGesture, false);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe('Expected valid options, but received an invalid value.');
  });

  it('should handle invalid gesture instances gracefully', () => {
    const result = matcher(null as any);
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected a valid gesture class, but received invalid input or an instantiated class instead.',
    );
  });
});
