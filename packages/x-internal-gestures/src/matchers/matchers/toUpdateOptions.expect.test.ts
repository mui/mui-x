import { describe, expect, it } from 'vitest';
import { MockGoodGesture } from '../mocks/MockGoodGesture';

describe('toUpdateOptions expect', () => {
  it('should pass when a gesture can be cloned', () => {
    expect(MockGoodGesture).toUpdateOptions({ preventDefault: true });
  });

  it('should fail when using with extra input', { fails: true }, () => {
    // @ts-expect-error, this is a test case for extra input handling
    expect(MockGoodGesture).toUpdateOptions({ yolo: 'fake' });
  });

  it('should fail when there is options to uses', { fails: true }, () => {
    // @ts-expect-error, this is a test case for invalid input handling
    expect(MockGoodGesture).toUpdateOptions();
  });
});
