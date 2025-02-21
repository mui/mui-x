import { expect } from 'chai';

import processorOpts from '../../src/options_resolvers/processorOpts';

describe('options_resolvers/processorOpts', () => {
  it('should throw if processorOpts is not an object or valid module path exporting object', () => {
    expect(() => processorOpts('test/fixtures/generateScopedName.function.module.js')).to.throw();

    expect(() => processorOpts(null)).to.throw();
  });

  it('should return object', () => {
    expect(processorOpts({})).to.be.deep.equal({});
    expect(processorOpts('test/fixtures/processCss.module.js')).to.be.deep.equal({});
  });
});
