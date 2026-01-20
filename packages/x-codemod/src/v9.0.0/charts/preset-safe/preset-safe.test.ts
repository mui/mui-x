import jscodeshift from 'jscodeshift';
import transform from './index';
import * as renameChartApiImport from '../rename-chart-api-import';

const allFiles = [
  // Add other transforms here as they are created
  renameChartApiImport,
]
  .map((mod) =>
    mod.testConfig.specFiles.map((file) => {
      file.name = `${mod.testConfig.name}/${file.name}`;
      return file;
    }),
  )
  .flat();

describe('v9.0.0/charts', () => {
  describe('preset-safe', () => {
    describe.each(allFiles)('transforms $name correctly', (file) => {
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
