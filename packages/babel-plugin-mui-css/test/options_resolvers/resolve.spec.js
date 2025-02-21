import { expect } from 'chai';

import resolve from '../../src/options_resolvers/resolve';

describe('options_resolvers/resolve', () => {
  it('should throw if resolve is not an object', () => {
    expect(() => resolve([])).to.throw();
  });

  it('should throw if resolve.alias is not an object', () => {
    expect(() => resolve({ alias: [] })).to.throw();
  });

  it('should throw if resolve.extensions is not an array', () => {
    expect(() => resolve({ extensions: {} })).to.throw();
  });

  it('should throw if resolve.modules is not an array', () => {
    expect(() => resolve({ modules: {} })).to.throw();
  });

  it('should throw if resolve.modules.* is not an absolute directory or does not exist', () => {
    expect(() => resolve({ modules: ['/test/this/not/exists'] })).to.throw();

    expect(() => resolve('./')).to.throw();
  });

  it('should throw if resolve.mainFile is not a string', () => {
    expect(() => resolve({ mainFile: {} })).to.throw();
  });

  it('should throw if resolve.preserveSymlinks is not a boolean', () => {
    expect(() => resolve({ preserveSymlinks: 1 })).to.throw();
  });

  it('works if resolve.alias is an object', () => {
    expect(() => resolve({ alias: {} })).to.not.throw();
  });

  it('works if resolve.extensions is an array of strings', () => {
    expect(() => resolve({ extensions: ['a', 'b'] })).to.not.throw();
  });

  it('works if resolve.modules is an array of valid file paths', () => {
    expect(() => resolve({ modules: [__dirname] })).to.not.throw();
  });

  it('works if resolve.mainFile is a string', () => {
    expect(() => resolve({ mainFile: 'aa' })).to.not.throw();
  });

  it('works if resolve.preserveSymlinks is a boolean', () => {
    expect(() => resolve({ preserveSymlinks: true })).to.not.throw();
  });
});
