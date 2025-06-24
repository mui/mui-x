import path from 'path';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v7.0.0/pickers', () => {
  describe('rename-day-picker-classes', () => {
    it('transforms code as needed', () => {
      const actual = transform(
        {
          source: read('./actual.spec.js'),
          path: require.resolve('./actual.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent for expression', () => {
      const actual = transform(
        {
          source: read('./expected.spec.js'),
          path: require.resolve('./expected.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
