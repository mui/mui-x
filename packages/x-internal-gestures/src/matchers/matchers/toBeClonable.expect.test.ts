import { describe, expect, it } from 'vitest';
import { MockGoodGesture } from '../mocks/MockGoodGesture';

describe('toBeClonable expect', () => {
  it('should pass when a gesture can be cloned', () => {
    expect(MockGoodGesture).toBeClonable();
  });

  it('should pass when a gesture can be cloned with overrides', () => {
    expect(MockGoodGesture).toBeClonable({
      preventDefault: true,
      stopPropagation: true,
      preventIf: ['pan', 'pinch'],
    });
  });

  it('should handle invalid gesture instances gracefully', { fails: true }, () => {
    expect(null).toBeClonable();
  });
});
