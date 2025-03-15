import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

const TEST_FILES = ['community-import', 'pro-import'];

describe('v8.0.0/pickers', () => {
  describe('rename-adapter-date-fns-imports', () => {
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
      });
    });
  });
});
