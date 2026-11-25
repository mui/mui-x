import { describe, it, expect } from 'vitest';
import {
  getConditionalFormattingExcelOptions,
  getConditionalFormattingExcelStyle,
  getConditionalFormattingStyles,
  matchesConditionalFormattingValue,
  sanitizeConditionalFormattingStyle,
} from './gridConditionalFormattingUtils';
import type {
  GridConditionalFormattingCondition,
  GridConditionalFormattingModel,
} from './gridConditionalFormattingInterfaces';

const layout = {
  fieldToColumnLetter: new Map([
    ['name', 'A'],
    ['price', 'B'],
  ]),
  firstDataRowNumber: 2,
  lastDataRowNumber: 5,
};

const getFormula = (condition: GridConditionalFormattingCondition, field = 'price') => {
  const [options] = getConditionalFormattingExcelOptions(
    [{ fields: [field], condition, style: { color: '#f00' } }],
    layout,
    undefined,
  );
  return options?.rules[0].type === 'expression' ? options.rules[0].formulae?.[0] : undefined;
};

describe('gridConditionalFormattingUtils', () => {
  describe('matchesConditionalFormattingValue', () => {
    it('compares numbers and only matches number cells', () => {
      const condition = { type: 'cell', operator: 'greaterThan', value: 10 } as const;
      expect(matchesConditionalFormattingValue(condition, 11)).to.equal(true);
      expect(matchesConditionalFormattingValue(condition, 10)).to.equal(false);
      expect(matchesConditionalFormattingValue(condition, '11')).to.equal(false);
      expect(matchesConditionalFormattingValue(condition, null)).to.equal(false);
    });

    it('supports between, notBetween and notEqual', () => {
      const between = { type: 'cell', operator: 'between', value: 1, valueTo: 3 } as const;
      expect(matchesConditionalFormattingValue(between, 1)).to.equal(true);
      expect(matchesConditionalFormattingValue(between, 3)).to.equal(true);
      expect(matchesConditionalFormattingValue(between, 4)).to.equal(false);
      expect(matchesConditionalFormattingValue({ ...between, operator: 'notBetween' }, 4)).to.equal(
        true,
      );
      expect(
        matchesConditionalFormattingValue({ type: 'cell', operator: 'notEqual', value: 1 }, null),
      ).to.equal(true);
    });

    it('compares dates and strings', () => {
      expect(
        matchesConditionalFormattingValue(
          { type: 'cell', operator: 'lessThan', value: new Date(2026, 0, 1) },
          new Date(2025, 5, 1),
        ),
      ).to.equal(true);
      expect(
        matchesConditionalFormattingValue(
          { type: 'cell', operator: 'equal', value: 'Apple' },
          'apple',
        ),
      ).to.equal(true);
    });

    it('matches text case-insensitively', () => {
      expect(
        matchesConditionalFormattingValue(
          { type: 'text', operator: 'contains', value: 'AN' },
          'Banana',
        ),
      ).to.equal(true);
      expect(
        matchesConditionalFormattingValue(
          { type: 'text', operator: 'startsWith', value: 'ba' },
          'Banana',
        ),
      ).to.equal(true);
      expect(
        matchesConditionalFormattingValue(
          { type: 'text', operator: 'endsWith', value: 'x' },
          'Banana',
        ),
      ).to.equal(false);
      expect(
        matchesConditionalFormattingValue({ type: 'text', operator: 'isEmpty' }, ' '),
      ).to.equal(true);
      expect(
        matchesConditionalFormattingValue({ type: 'text', operator: 'isNotEmpty' }, null),
      ).to.equal(false);
    });
  });

  describe('sanitizeConditionalFormattingStyle', () => {
    it('drops invalid values', () => {
      let style;
      expect(() => {
        style = sanitizeConditionalFormattingStyle({
          color: 'red; } body { display: none',
          backgroundColor: '#00ff00',
          fontWeight: 'lighter' as 'bold',
        });
      }).toWarnDev(['MUI X Data Grid: The conditional formatting color']);
      expect(style).to.deep.equal({ backgroundColor: '#00ff00' });
    });
  });

  describe('getConditionalFormattingStyles', () => {
    it('writes the first rule last and keeps the background off selected cells', () => {
      const model: GridConditionalFormattingModel = [
        {
          fields: ['a'],
          condition: { type: 'text', operator: 'isEmpty' },
          style: { color: '#111' },
        },
        {
          fields: ['a'],
          condition: { type: 'text', operator: 'isEmpty' },
          style: { backgroundColor: '#222' },
        },
      ];
      expect(Object.entries(getConditionalFormattingStyles(model, 7))).to.deep.equal([
        [
          '& .MuiDataGrid-cell.MuiDataGrid-conditionalFormatting-7-1:not(.Mui-selected)',
          { backgroundColor: '#222' },
        ],
        ['& .MuiDataGrid-cell.MuiDataGrid-conditionalFormatting-7-0', { color: '#111' }],
      ]);
    });
  });

  describe('getConditionalFormattingExcelOptions', () => {
    it('writes guarded comparisons for the top-left cell', () => {
      expect(getFormula({ type: 'cell', operator: 'greaterThan', value: 10 })).to.equal(
        'AND(ISNUMBER(B2),B2>10)',
      );
      expect(getFormula({ type: 'cell', operator: 'notBetween', value: 1, valueTo: 3 })).to.equal(
        'NOT(AND(ISNUMBER(B2),B2>=1,B2<=3))',
      );
      expect(getFormula({ type: 'cell', operator: 'equal', value: 'a"b' }, 'name')).to.equal(
        'AND(ISTEXT(A2),A2="a""b")',
      );
      expect(
        getFormula({ type: 'cell', operator: 'lessThan', value: new Date(2026, 1, 3, 4, 5, 6) }),
      ).to.equal('AND(ISNUMBER(B2),B2<(DATE(2026,2,3)+TIME(4,5,6)))');
    });

    it('escapes the wildcards of text conditions', () => {
      expect(getFormula({ type: 'text', operator: 'contains', value: '5*?~' })).to.equal(
        'ISNUMBER(SEARCH("5~*~?~~",B2))',
      );
      expect(getFormula({ type: 'text', operator: 'startsWith', value: 'ab' })).to.equal(
        'LEFT(B2,2)="ab"',
      );
      expect(getFormula({ type: 'text', operator: 'isNotEmpty' })).to.equal('LEN(TRIM(B2))>0');
    });

    it('writes one conditional format per exported column, in priority order', () => {
      expect(
        getConditionalFormattingExcelOptions(
          [
            {
              fields: ['name', 'missing'],
              condition: { type: 'text', operator: 'isEmpty' },
              style: {},
            },
            {
              fields: ['name', 'price', 'missing'],
              condition: { type: 'formula', formula: '=price > 1' },
              style: { backgroundColor: '#abc', fontWeight: 'bold' },
            },
          ],
          layout,
          (formula, letters, rowNumber) => `${letters.get('price')}${rowNumber}>1`,
        ),
      ).to.deep.equal(
        ['A', 'B'].map((letter) => ({
          ref: `${letter}2:${letter}5`,
          rules: [
            {
              type: 'expression',
              priority: 2,
              formulae: ['B2>1'],
              style: {
                font: { bold: true },
                fill: {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFAABBCC' },
                  bgColor: { argb: 'FFAABBCC' },
                },
              },
            },
          ],
        })),
      );
    });

    it('skips formula conditions without the formula feature and empty exports', () => {
      const model: GridConditionalFormattingModel = [
        {
          fields: ['price'],
          condition: { type: 'formula', formula: '=price > 1' },
          style: { color: '#000' },
        },
      ];
      expect(getConditionalFormattingExcelOptions(model, layout, undefined)).to.deep.equal([]);
      expect(
        getConditionalFormattingExcelOptions(
          [{ ...model[0], condition: { type: 'text', operator: 'isEmpty' } }],
          { ...layout, lastDataRowNumber: 1 },
          undefined,
        ),
      ).to.deep.equal([]);
    });
  });

  it('maps the style to an Excel style', () => {
    expect(
      getConditionalFormattingExcelStyle({
        color: '#123456',
        fontStyle: 'italic',
        textDecoration: 'line-through',
      }),
    ).to.deep.equal({ font: { color: { argb: 'FF123456' }, italic: true, strike: true } });
  });
});
