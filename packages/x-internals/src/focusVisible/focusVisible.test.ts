import { expect, describe, it } from 'vitest';
import { getFocusVisibleReach } from './index';

describe('getFocusVisibleReach', () => {
  it('adds numeric width and offset into one px length', () => {
    expect(getFocusVisibleReach({ outlineWidth: 2, outlineOffset: 1 })).to.equal('3px');
  });

  it('adds string lengths with calc', () => {
    expect(getFocusVisibleReach({ outlineWidth: '0.125rem', outlineOffset: 2 })).to.equal(
      'calc(0.125rem + 2px)',
    );
  });
});
