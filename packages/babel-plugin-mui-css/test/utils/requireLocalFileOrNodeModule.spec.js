import { expect } from 'chai';

import requireLocalFileOrNodeModule from '../../src/utils/requireLocalFileOrNodeModule';

describe('utils/requireLocalFileOrNodeModule', () => {
  it('should return exported value from file', () => {
    expect(requireLocalFileOrNodeModule('mkdirp')).to.be.a('function');
    expect(requireLocalFileOrNodeModule('./src/utils/requireLocalFileOrNodeModule')).to.be.a(
      'object',
    );
  });
});
