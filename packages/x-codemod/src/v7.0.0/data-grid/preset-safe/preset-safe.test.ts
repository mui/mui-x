import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v7.0.0/data-grid', () => {
  describe('preset-safe', () => {
    it('transforms code as needed', () => {
      const actual = transform({ source: read('./actual.spec.js') }, { jscodeshift }, {});

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent', () => {
      const actual = transform({ source: read('./actual.spec.js') }, { jscodeshift }, {});

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
