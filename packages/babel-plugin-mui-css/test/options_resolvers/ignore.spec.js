import { expect } from 'chai';

import ignore from '../../src/options_resolvers/ignore';

describe('options_resolvers/ignore', () => {
  it('should throw if ignore value is not a function, string or RegExp', () => {
    expect(() => ignore(null)).to.throw();
  });

  it('should return string', () => {
    expect(ignore('string')).to.be.equal('string');
  });

  it('should return function', () => {
    const func = () => {};

    expect(ignore(func)).to.be.equal(func);
  });

  it('should return function on module require', () => {
    expect(ignore('./test/fixtures/generateScopedName.function.module.js')).to.be.a('function');
  });
});
