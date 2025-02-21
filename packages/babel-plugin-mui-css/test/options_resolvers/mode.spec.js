import { expect } from 'chai';

import mode from '../../src/options_resolvers/mode';

describe('options_resolvers/mode', () => {
  it('should throw if mode value is not a string', () => {
    expect(() => mode(null)).to.throw();

    expect(mode('mode')).to.be.equal('mode');
  });
});
