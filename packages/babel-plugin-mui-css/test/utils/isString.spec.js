import { expect } from 'chai';

import isString from '../../src/utils/isString';

describe('utils/isString', () => {
  it('should return true for a string', () => {
    expect(isString(null)).to.be.equal(false);
    expect(isString('')).to.be.equal(true);
    expect(isString('a')).to.be.equal(true);
    expect(isString(1)).to.be.equal(false);
    expect(isString(false)).to.be.equal(false);
    expect(isString(() => {})).to.be.equal(false);
    expect(isString({})).to.be.equal(false);
    expect(isString(/a/)).to.be.equal(false);
    expect(isString(new RegExp('a'))).to.be.equal(false);
  });
});
