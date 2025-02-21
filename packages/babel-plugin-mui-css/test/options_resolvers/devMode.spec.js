import { expect } from 'chai';

import devMode from '../../src/options_resolvers/devMode';

describe('options_resolvers/devMode', () => {
  it('should throw if devMode value is not a boolean', () => {
    expect(() => devMode(null)).to.throw();

    expect(devMode(true)).to.be.equal(true);
  });
});
