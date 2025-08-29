import { describe, expect, it } from 'vitest';
import { MockGoodGesture } from '../mocks/MockGoodGesture';

describe('toUpdateState expect', () => {
  it('should pass when a gesture can be cloned', () => {
    expect(MockGoodGesture).toUpdateState({ isDragging: true });
  });

  it('should fail when there is options to uses', { fails: true }, () => {
    // @ts-expect-error, this is a test case for invalid input handling
    expect(MockGoodGesture).toUpdateState();
  });
});
