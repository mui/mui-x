import path from 'path';
import { expect } from 'chai';
import jscodeshift from 'jscodeshift';
import transform from './index';
import readFile from '../../../util/readFile';

function read(fileName) {
  return readFile(path.join(__dirname, fileName));
}

describe('v6.0.0/pickers', () => {
  describe('rename-inputFormat-prop', () => {
    it('transforms props as needed', () => {
      const actual = transform(
        {
          source: read('./actual-props.spec.js'),
          path: require.resolve('./actual-props.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-props.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });

    it('should be idempotent for expression', () => {
      const actual = transform(
        {
          source: read('./expected-props.spec.js'),
          path: require.resolve('./expected-props.spec.js'),
        },
        { jscodeshift },
        {},
      );

      const expected = read('./expected-props.spec.js');
      expect(actual).to.equal(expected, 'The transformed version should be correct');
    });
  });
});
