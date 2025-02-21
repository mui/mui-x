import { expect } from 'chai';

import isModulePath from '../../src/utils/isModulePath';

describe('utils/isModulePath', () => {
  it('should return true for valid paths', () => {
    expect(isModulePath('mkdirp')).to.be.equal(true);
    expect(isModulePath('not-global-existing')).to.be.equal(false);
    expect(isModulePath('./test/utils/isModulePath.spec.js')).to.be.equal(true);
    expect(isModulePath('./test/utils/nonexisting')).to.be.equal(false);
    expect(isModulePath('')).to.be.equal(false);
    expect(isModulePath(1)).to.be.equal(false);
    expect(isModulePath(false)).to.be.equal(false);
    expect(isModulePath(() => {})).to.be.equal(false);
    expect(isModulePath({})).to.be.equal(false);
  });
});
