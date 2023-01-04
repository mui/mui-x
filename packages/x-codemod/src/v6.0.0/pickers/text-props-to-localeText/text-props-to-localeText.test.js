import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from './index';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v6.0.0/pickers', () => {
  describe('localization-provider-rename-locale', () => {
    it('transforms expression props as needed', () => {
      const actual = transform(
        {
          source: read('./actual-expression-values.spec.js'),
          path: require.resolve('./actual-expression-values.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-expression-values.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent for expression', () => {
      const actual = transform(
        {
          source: read('./expected-expression-values.spec.js'),
          path: require.resolve('./expected-expression-values.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-expression-values.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('transforms string props as needed', () => {
      const actual = transform(
        {
          source: read('./actual-string-values.spec.js'),
          path: require.resolve('./actual-string-values.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-string-values.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent for string', () => {
      const actual = transform(
        {
          source: read('./expected-string-values.spec.js'),
          path: require.resolve('./expected-string-values.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-string-values.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
