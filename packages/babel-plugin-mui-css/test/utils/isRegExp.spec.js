import { expect } from 'chai';

import isRegExp from '../../src/utils/isRegExp';

describe('utils/isRegExp', () => {
  it('should return true for a RegExp', () => {
    expect(isRegExp(null)).to.be.equal(false);
    expect(isRegExp('')).to.be.equal(false);
    expect(isRegExp(1)).to.be.equal(false);
    expect(isRegExp(false)).to.be.equal(false);
    expect(isRegExp(() => {})).to.be.equal(false);
    expect(isRegExp({})).to.be.equal(false);
    expect(isRegExp(/a/)).to.be.equal(true);
    expect(isRegExp(new RegExp('a'))).to.be.equal(true);
  });
});
