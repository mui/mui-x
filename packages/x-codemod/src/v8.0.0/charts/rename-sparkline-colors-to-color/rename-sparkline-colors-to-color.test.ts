import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from '.';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v8.0.0/charts', () => {
  describe('rename-sparkline-colors-to-color', () => {
    it('transforms code as needed', () => {
      const actual = transform(
        {
          source: read('./actual.spec.tsx'),
          path: require.resolve('./actual.spec.tsx'),
        },
        { jscodeshift: jscodeshift.withParser('tsx') },
        {},
      );

      const expected = read('./expected.spec.tsx');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
