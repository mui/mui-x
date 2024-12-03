import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import fs from 'fs';
import transform from '.';
import readFile from '../../util/readFile';

function read(fileName) {
  return readFile(fileName);
}

function getAllDirs() {
  return fs
    .readdirSync(path.resolve(__dirname, '..'))
    .filter(
      (file) =>
        fs.statSync(path.resolve(__dirname, '..', file)).isDirectory() && file !== 'preset-safe',
    );
}

describe('v8.0.0', () => {
  const MOD_DIRS = getAllDirs();

  describe('preset-safe', () => {
    MOD_DIRS.forEach((testDir) => {
      const actualPath = path.resolve(__dirname, '..', testDir, 'preset-safe', 'actual.spec.tsx');
      const expectedPath = path.resolve(
        __dirname,
        '..',
        testDir,
        'preset-safe',
        'expected.spec.tsx',
      );

      describe(`${testDir.replace(/-/g, ' ')}`, () => {
        it('transforms code as needed', () => {
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
