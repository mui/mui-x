import { expect } from 'chai';

import rootDir from '../../src/options_resolvers/rootDir';

describe('options_resolvers/rootDir', () => {
  it('should throw if rootDir is not an absolute directory or does not exist', () => {
    expect(() => rootDir('')).to.throw();

    expect(() => rootDir('/test/this/not/exists')).to.throw();
    expect(() => rootDir('./')).to.throw();
  });

  it('should throw if rootDir is a file path', () => {
    expect(() => rootDir(__filename)).to.throw();
  });

  it('should return rootDir if is valid', () => {
    expect(rootDir(__dirname)).to.be.equal(__dirname);
  });
});
