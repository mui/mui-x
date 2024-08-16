import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

const TEST_FILES = ['nested-imports', 'root-imports'];

describe('v7.0.0/tree-view', () => {
  describe('rename-tree-view-simple-tree-view', () => {
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
