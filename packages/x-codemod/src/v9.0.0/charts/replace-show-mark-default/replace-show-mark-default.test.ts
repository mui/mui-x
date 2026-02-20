import jscodeshift from 'jscodeshift';
import transform, { testConfig } from './index';

const allFiles = [testConfig].map((config) => config().specFiles).flat();

describe('v9.0.0/charts', () => {
  describe(`${testConfig.name}`, () => {
    describe.each(allFiles)('$name', (file) => {
      it('transforms code as needed', () => {
        const actual = transform(
          { source: file.actual },
          { jscodeshift: jscodeshift.withParser('tsx') },
          {},
        );

        const expected = file.expected;
        expect(actual).to.equal(expected, 'The transformed version should be correct');
      });

      it('should be idempotent', () => {
        const actual = transform(
          { source: file.expected },
          { jscodeshift: jscodeshift.withParser('tsx') },
          {},
        );

        const expected = file.expected;

        expect(actual).to.equal(expected, 'The transformed version should be correct');
      });
    });
  });
});
