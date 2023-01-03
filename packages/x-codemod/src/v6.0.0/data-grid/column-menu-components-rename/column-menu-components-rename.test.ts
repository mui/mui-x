import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

const TEST_FILES = ['community-root-imports', 'pro-root-imports', 'premium-root-imports'];

describe('v6.0.0/data-grid', () => {
  describe('column-menu-components-rename', () => {
    TEST_FILES.forEach((testFile) => {
      const actualPath = `./actual-${testFile}.spec.tsx`;
      const expectedPath = `./expected-${testFile}.spec.tsx`;

      describe(`Package (${testFile.split(/-/g)[0]})`, () => {
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
  });
});
