import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v7.0.0/pickers', () => {
  describe('rename-slot-types', () => {
    const actualPath = `./actual-rename-slots-types.spec.tsx`;
    const expectedPath = `./expected-rename-slots-types.spec.tsx`;

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
