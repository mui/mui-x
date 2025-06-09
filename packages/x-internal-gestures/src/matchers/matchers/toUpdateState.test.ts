import { describe, expect, it } from 'vitest';

import { getFakeState } from '../equals';
import '../index';
import { MockBadUpdateStateGesture } from '../mocks/MockBadUpdateStateGesture';
import { MockGoodGesture } from '../mocks/MockGoodGesture';
import { toUpdateState } from './toUpdateState';

const matcher = toUpdateState.bind(getFakeState());

describe('toUpdateState matcher', () => {
  it('should pass when a gesture state can be updated through events', () => {
    const result = matcher(MockGoodGesture, {
      isDragging: true,
      startPosition: { x: 100, y: 200 },
    });
    expect(result.pass).toBe(true);
  });

  it('should provide the correct "not" message when passing', () => {
    const result = matcher(MockGoodGesture, { isDragging: true });
    expect(result.pass).toBe(true);
    expect(result.message()).toBe(
      'Expected state not to be updatable to the specified values, but it was.'
    );
  });

  it('should not pass when options are same as default', () => {
    const result = matcher(MockGoodGesture, { isDragging: false });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected state to be updated, but it remained the same as the original.'
    );
  });

  it('should not pass when state is not updated', () => {
    const result = matcher(MockBadUpdateStateGesture, {
      isDragging: true,
      startPosition: { x: 100, y: 200 },
    });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected state to be updated to the specified values, but it was not.'
    );
  });

  it('should not pass when handling invalid inputs', () => {
    const result = matcher(MockGoodGesture, {});
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected a non-empty state object, but received invalid or empty state.'
    );
  });

  it('should not pass when handling invalid gesture instances', () => {
     
    const result = matcher(null as any, { preventDefault: true });
    expect(result.pass).toBe(false);
    expect(result.message()).toBe(
      'Expected a valid gesture class, but received invalid input or an instantiated class instead.'
    );
  });
});
