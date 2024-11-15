import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

const TEST_FILES = ['community-import-root', 'community-import-nested', 'pro-import-root'];

describe('v8.0.0/pickers', () => {
  describe('rename-and-move-field-value-type', () => {
    TEST_FILES.forEach((testFile) => {
      const actualPath = `./actual-${testFile}.spec.tsx`;
      const expectedPath = `./expected-${testFile}.spec.tsx`;

      describe(`${testFile.replace(/-/g, ' ')}`, () => {
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
