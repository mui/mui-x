import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v8.0.0/charts', () => {
  describe('remove-on-axis-click-handler-global-import', () => {
    const actualPath = `./actual-global-import.spec.tsx`;
    const expectedPath = `./expected-global-import.spec.tsx`;

    it('transforms axis click handlers as needed', () => {
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

  describe('remove-on-axis-click-handler-nested-import', () => {
    const actualPath = `./actual-nested-import.spec.tsx`;
    const expectedPath = `./expected-nested-import.spec.tsx`;

    it('transforms axis click handlers as needed', () => {
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
