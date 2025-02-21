import { expect } from 'chai';

import camelCase from '../../src/options_resolvers/camelCase';

describe('options_resolvers/camelCase', () => {
  it('should throw if camelCase value is not a boolean or is not in enum', () => {
    expect(() => camelCase(null)).to.throw();

    expect(() => camelCase('unknown')).to.throw();

    expect(camelCase(true)).to.be.equal(true);
    expect(camelCase('dashes')).to.be.equal('dashes');
    expect(camelCase('dashesOnly')).to.be.equal('dashesOnly');
    expect(camelCase('only')).to.be.equal('only');
  });
});
