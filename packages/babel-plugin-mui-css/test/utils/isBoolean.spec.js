import { expect } from 'chai';

import isBoolean from '../../src/utils/isBoolean';

describe('utils/isBoolean', () => {
  it('should return true for valid values', () => {
    expect(isBoolean(null)).to.be.equal(false);
    expect(isBoolean('')).to.be.equal(false);
    expect(isBoolean(1)).to.be.equal(false);
    expect(isBoolean(false)).to.be.equal(true);
    expect(isBoolean(true)).to.be.equal(true);
    expect(isBoolean(() => {})).to.be.equal(false);
  });
});
