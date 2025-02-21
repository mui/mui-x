import { expect } from 'chai';

import prepend from '../../src/options_resolvers/prepend';

describe('options_resolvers/prepend', () => {
  it('should throw if prepend is not an array', () => {
    expect(() => prepend({})).to.throw();
  });

  it('should throw if prepend does not contain functions', () => {
    expect(() => prepend(['test/fixtures/append.module.js'])).to.throw();
  });
});
