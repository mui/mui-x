import jscodeshift from 'jscodeshift';
import path from 'path';
import transform from './index';
import * as replaceHeatmapHideLegend from '../replace-heatmap-hide-legend-false';
import readFile from '../../../util/readFile';

const allFiles = [
  // Add other transforms here as they are created
  replaceHeatmapHideLegend,
];

const parsedFiles = allFiles
  .map((mod) =>
    mod.testConfig.specFiles.map((file) => {
      file.name = `${mod.testConfig.name}/${file.name}`;
      return file;
    }),
  )
  .flat();

const testCases = [
  ...parsedFiles,
  {
    name: 'preset-safe/own-files',
    actual: readFile(path.join(import.meta.dirname, 'actual.spec.tsx')),
    expected: readFile(path.join(import.meta.dirname, 'expected.spec.tsx')),
  },
];

describe('v9.0.0/charts', () => {
  describe('preset-safe', () => {
    describe.each(testCases)('transforms $name correctly', (file) => {
      it('transforms code as needed', () => {
        const actual = transform(
          {
            source: file.actual,
          },
          { jscodeshift: jscodeshift.withParser('tsx') },
          {},
        );

        const expected = file.expected;
        expect(actual).to.equal(expected, 'The transformed version should be correct');
      });

      it('should be idempotent for expression', () => {
        const actual = transform(
          {
            source: file.expected,
          },
          { jscodeshift: jscodeshift.withParser('tsx') },
          {},
        );

        const expected = file.expected;
        expect(actual).to.equal(expected, 'The transformed version should be correct');
      });
    });
  });
});
