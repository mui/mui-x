import path, { basename } from 'path';
import jscodeshift from 'jscodeshift';
import transform from './index';
import readFile from '../../../util/readFile';
import * as renameAxisTooltipHook from '../rename-axis-tooltip-hook';

const allFiles = [renameAxisTooltipHook]
  .map((mod) =>
    mod.testConfig.specFiles.map(({ actual, expected }) => {
      return {
        name: `${basename(mod.testConfig.location)}/${actual.replace('.spec.tsx', '').replace('actual-', '')}`,
        actual: readFile(path.join(mod.testConfig.location, actual)),
        expected: readFile(path.join(mod.testConfig.location, expected)),
      };
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
