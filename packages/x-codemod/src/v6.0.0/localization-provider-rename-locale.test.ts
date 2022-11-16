import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from './localization-provider-rename-locale';
import readFile from '../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v6.0.0', () => {
  describe('localization-provider-rename-locale', () => {
    it('transforms props as needed', () => {
      const actual = transform(
        { source: read('./localization-provider-rename-locale.test/actual.js') },
        { jscodeshift },
        {},
      );

      const expected = read('./localization-provider-rename-locale.test/expected.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent', () => {
      const actual = transform(
        { source: read('./localization-provider-rename-locale.test/expected.js') },
        { jscodeshift },
        {},
      );

      const expected = read('./localization-provider-rename-locale.test/expected.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
