import { expect } from 'chai';

import hashPrefix from '../../src/options_resolvers/hashPrefix';

describe('options_resolvers/hashPrefix', () => {
  it('should throw if hashPrefix value is not a string', () => {
    expect(() => hashPrefix(null)).to.throw();

    expect(hashPrefix('hashPrefix')).to.be.equal('hashPrefix');
  });
});
