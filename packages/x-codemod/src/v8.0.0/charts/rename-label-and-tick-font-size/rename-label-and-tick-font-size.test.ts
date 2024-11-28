import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v8.0.0/charts', () => {
  describe('rename-label-and-tick-font-size.test', () => {
    const actualPath = `./actual.spec.tsx`;
    const expectedPath = `./expected.spec.tsx`;

    it('transforms imports as needed', () => {
      const actual = transform(
        { source: read(actualPath) },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read(expectedPath);
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent', () => {
      const actual = transform(
        { source: read(expectedPath) },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read(expectedPath);
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
