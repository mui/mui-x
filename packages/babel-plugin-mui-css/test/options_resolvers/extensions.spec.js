import { expect } from 'chai';

import extensions from '../../src/options_resolvers/extensions';

describe('options_resolvers/extensions', () => {
  it('should throw if extensions is not an array', () => {
    expect(() => extensions({})).to.throw();
  });

  it('should throw if append does not strings', () => {
    expect(() => extensions([true])).to.throw();
  });
});
