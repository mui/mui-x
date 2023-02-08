import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v6.0.0/data-grid', () => {
  describe('rename-filter-item-props', () => {
    it('transforms code as needed', () => {
      const actual = transform(
        { source: read('./actual.spec.tsx') },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read('./expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent', () => {
      const actual = transform(
        { source: read('./actual.spec.tsx') },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read('./expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
