import { expect } from 'chai';

import generateScopedName from '../../src/options_resolvers/generateScopedName';

describe('options_resolvers/generateScopedName', () => {
  it('should throw if generateScopeName is not exporting a function', () => {
    expect(() => generateScopedName('test/fixtures/generateScopedName.module.js')).to.throw();
  });

  it('should not throw if generateScopeName is exporting a function', () => {
    expect(() =>
      generateScopedName('test/fixtures/generateScopedName.function.module.js'),
    ).to.not.throw();
  });
});
