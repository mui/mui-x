import { expect } from 'chai';

import preprocessCss from '../../src/options_resolvers/preprocessCss';

describe('options_resolvers/preprocessCss', () => {
  it('should throw if processCss is not a function', () => {
    expect(() => preprocessCss('test/fixtures/preprocessCss.module.js')).to.throw();
  });
});
