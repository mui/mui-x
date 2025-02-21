import { expect } from 'chai';

import use from '../../src/options_resolvers/use';

describe('options_resolvers/use', () => {
  it('should throw if use is not an array', () => {
    expect(() => use('test/fixtures/processCss.module.js')).to.throw();
  });

  it('should throw if array is not containing functions or module paths', () => {
    expect(() => use([null])).to.throw();

    expect(() => use(['unknown-module'])).to.throw();
  });

  it('should return result of called function', () => {
    let called = false;

    const caller = () => {
      called = true;

      return 'result';
    };

    expect(use([caller])).to.be.deep.equal(['result']);
    expect(called).to.be.equal(true);
  });
});
