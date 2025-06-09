import { describe, expect, it } from 'vitest';
import { getFakeState } from '../equals';
import { MockBadUpdateOptionsGesture } from '../mocks/MockBadUpdateOptionsGesture';
import { MockGoodGesture } from '../mocks/MockGoodGesture';
import { toUpdateOptions } from './toUpdateOptions';

const matcher = toUpdateOptions.bind(getFakeState());

describe('toUpdateOptions matcher', () => {
  it('should pass when a gesture can be updated through events', () => {
    const result = matcher(MockGoodGesture, { preventDefault: true });
    expect(result.pass).toBe(true);
  });

  it('should provide the correct "not" message when passing', () => {
    const result = matcher(MockGoodGesture, { preventDefault: true });
    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected options not to be updatable to the specified values, but they were.',
    );
  });

  it('should not pass when options are same as default', () => {
    const result = matcher(MockGoodGesture, { preventDefault: false });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected options to be updated, but they remained the same as the original.',
    );
  });

  it('should not pass when options are not updated', () => {
    const result = matcher(MockBadUpdateOptionsGesture, { preventDefault: 'fake' });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected options to be updated to the specified values, but they were not.',
    );
  });

  it('should not pass when handling invalid inputs', () => {
    const result = matcher(MockGoodGesture, {});
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected a non-empty options object, but received invalid or empty options.',
    );
  });

  it('should not pass when handling invalid gesture instances', () => {
    const result = matcher(null as any, { preventDefault: true });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected a valid gesture class, but received invalid input or an instantiated class instead.',
    );
  });
});
