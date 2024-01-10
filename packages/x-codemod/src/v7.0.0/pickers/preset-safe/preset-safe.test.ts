import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from './index';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v7.0.0/pickers', () => {
  describe('preset-safe', () => {
    it('transforms code as needed', () => {
      const actual = transform(
        {
          source: read('./actual.spec.tsx'),
          path: require.resolve('./actual.spec.tsx'),
        },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read('./expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent for expression', () => {
      const actual = transform(
        {
          source: read('./expected.spec.tsx'),
          path: require.resolve('./expected.spec.tsx'),
        },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read('./expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
