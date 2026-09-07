import type { GridColDef } from '@mui/x-data-grid-pro';
import { describe, it, expect } from 'vitest';
import { getPlainEditParserInput, shouldIgnorePlainEditInput } from './gridFormulaPlainEditing';

const numberColumn = { field: 'n', type: 'number', allowFormulas: true } as GridColDef;
const plainNumberColumn = { field: 'n', type: 'number' } as GridColDef;
const stringColumn = { field: 's', type: 'string', allowFormulas: true } as GridColDef;

describe('gridFormulaPlainEditing', () => {
  describe('shouldIgnorePlainEditInput', () => {
    it('neglects letters inserted into numeric text on a number column', () => {
      expect(shouldIgnorePlainEditInput(numberColumn, '12a', '12')).to.equal(true);
      expect(shouldIgnorePlainEditInput(numberColumn, 'a', '')).to.equal(true);
      expect(shouldIgnorePlainEditInput(numberColumn, '1.2.3', '1.2')).to.equal(true);
    });

    it('accepts numbers and their partial states', () => {
      expect(shouldIgnorePlainEditInput(numberColumn, '12', '1')).to.equal(false);
      expect(shouldIgnorePlainEditInput(numberColumn, '-', '')).to.equal(false);
      expect(shouldIgnorePlainEditInput(numberColumn, '-5.', '-5')).to.equal(false);
      expect(shouldIgnorePlainEditInput(numberColumn, '.5', '.')).to.equal(false);
      expect(shouldIgnorePlainEditInput(numberColumn, '1e-3', '1e-')).to.equal(false);
    });

    it('accepts formula and escaped-literal prefixes on formula columns only', () => {
      expect(shouldIgnorePlainEditInput(numberColumn, '=SUM(', '=SUM')).to.equal(false);
      expect(shouldIgnorePlainEditInput(numberColumn, "'=x", "'=")).to.equal(false);
      expect(shouldIgnorePlainEditInput(plainNumberColumn, '=', '')).to.equal(true);
    });

    it('lets text that is already non-representable be edited freely', () => {
      // Deleting the `=` of `=SUM(1)` left `SUM(1)` — later insertions land.
      expect(shouldIgnorePlainEditInput(numberColumn, 'SUM(1)2', 'SUM(1)')).to.equal(false);
    });

    it('never filters non-number columns', () => {
      expect(shouldIgnorePlainEditInput(stringColumn, 'abc', 'ab')).to.equal(false);
      expect(shouldIgnorePlainEditInput(undefined, 'abc', 'ab')).to.equal(false);
    });
  });

  describe('getPlainEditParserInput', () => {
    it('passes formula sources through on formula columns', () => {
      expect(getPlainEditParserInput('=1 + 1', numberColumn)).to.equal('=1 + 1');
      expect(getPlainEditParserInput("'=literal", numberColumn)).to.equal("'=literal");
    });

    it('reports the empty string for text a number input cannot represent', () => {
      // Never the text itself — `Number(text)` would be `NaN`.
      expect(getPlainEditParserInput('SUM(1)', numberColumn)).to.equal('');
      expect(getPlainEditParserInput('-', numberColumn)).to.equal('');
      expect(getPlainEditParserInput('=1 + 1', plainNumberColumn)).to.equal('');
    });

    it('keeps representable number text and non-number text as is', () => {
      expect(getPlainEditParserInput('12.5', numberColumn)).to.equal('12.5');
      expect(getPlainEditParserInput('', numberColumn)).to.equal('');
      expect(getPlainEditParserInput('abc', stringColumn)).to.equal('abc');
    });
  });
});
