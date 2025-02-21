import { expect } from 'chai';

import append from '../../src/options_resolvers/append';

describe('options_resolvers/append', () => {
  it('should throw if append is not an array', () => {
    expect(() => append({})).to.throw();
  });

  it('should throw if append does not contain functions', () => {
    expect(() => append(['test/fixtures/append.module.js'])).to.throw();
  });
});
