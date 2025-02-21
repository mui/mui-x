import { expect } from 'chai';

import isFunction from '../../src/utils/isFunction';

describe('utils/isFunction', () => {
  it('should return true for function', () => {
    expect(isFunction(null)).to.be.equal(false);
    expect(isFunction('')).to.be.equal(false);
    expect(isFunction(1)).to.be.equal(false);
    expect(isFunction(false)).to.be.equal(false);
    expect(isFunction(() => {})).to.be.equal(true);
  });
});
