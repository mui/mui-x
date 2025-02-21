import { expect } from 'chai';

import processCss from '../../src/options_resolvers/processCss';

describe('options_resolvers/processCss', () => {
  it('should throw if processCss is not a function', () => {
    expect(() => processCss('test/fixtures/processCss.module.js')).to.throw();
  });
});
