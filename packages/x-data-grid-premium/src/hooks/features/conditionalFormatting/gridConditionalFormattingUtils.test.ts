import { describe, it, expect } from 'vitest';
import {
  getConditionalFormattingExcelOptions,
  getConditionalFormattingExcelStyle,
  getConditionalFormattingStyles,
  sanitizeConditionalFormattingStyle,
} from './gridConditionalFormattingUtils';
import type { GridConditionalFormattingModel } from './gridConditionalFormattingInterfaces';
import type { GridCellCondition } from '../cellCondition/gridCellConditionInterfaces';

const layout = {
  fieldToColumnLetter: new Map([
    ['name', 'A'],
    ['price', 'B'],
    ['day', 'C'],
  ]),
  fieldToColumnType: new Map([
    ['name', 'string'],
    ['price', 'number'],
    ['day', 'date'],
  ]),
  rowRuns: [[2, 5]] as [number, number][],
};

const getFormula = (condition: GridCellCondition, field = 'price') => {
  const [options] = getConditionalFormattingExcelOptions(
    [{ type: 'highlight', fields: [field], condition, style: { color: '#f00' } }],
    layout,
    undefined,
  );
  return options?.rules[0].type === 'expression' ? options.rules[0].formulae?.[0] : undefined;
};

describe('gridConditionalFormattingUtils', () => {
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
          type: 'highlight',
          fields: ['a'],
          condition: { type: 'text', operator: 'isEmpty' },
          style: { color: '#111' },
        },
        {
          type: 'highlight',
          fields: ['a'],
          condition: { type: 'text', operator: 'isEmpty' },
          style: { backgroundColor: '#222' },
        },
      ];
      expect(Object.entries(getConditionalFormattingStyles(model, 7))).to.deep.equal([
        [
          '.MuiDataGrid-root .MuiDataGrid-row:not(.Mui-selected) .MuiDataGrid-cell.MuiDataGrid-conditionalFormatting-7-1:not(.Mui-selected)',
          { backgroundColor: '#222' },
        ],
        [
          '.MuiDataGrid-root .MuiDataGrid-cell.MuiDataGrid-conditionalFormatting-7-0',
          { color: '#111' },
        ],
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
        getFormula(
          { type: 'cell', operator: 'lessThan', value: new Date(2026, 1, 3, 4, 5, 6) },
          'day',
        ),
      ).to.equal('AND(ISNUMBER(C2),C2<(DATE(2026,2,3)+TIME(4,5,6)))');
    });

    it('keeps number rules off date columns and date rules off number columns', () => {
      expect(getFormula({ type: 'cell', operator: 'greaterThan', value: 1 }, 'day')).to.equal(
        undefined,
      );
      expect(
        getFormula({ type: 'cell', operator: 'greaterThan', value: new Date(2026, 0, 1) }),
      ).to.equal(undefined);
    });

    it('skips unknown operators and malformed rules', () => {
      expect(getFormula({ type: 'cell', operator: 'toString' as 'equal', value: 1 })).to.equal(
        undefined,
      );
      expect(
        getConditionalFormattingExcelOptions(
          [
            { type: 'highlight', fields: 'price' } as any,
            null as any,
            // A rule type from a newer version.
            { type: 'colorScale', fields: ['price'] } as any,
          ],
          layout,
          undefined,
        ),
      ).to.deep.equal([]);
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

    it('writes one conditional format per exported column and run of rows, in priority order', () => {
      expect(
        getConditionalFormattingExcelOptions(
          [
            {
              type: 'highlight',
              fields: ['name', 'missing'],
              condition: { type: 'text', operator: 'isEmpty' },
              style: {},
            },
            {
              type: 'highlight',
              fields: ['name', 'price', 'missing'],
              condition: { type: 'formula', formula: '=price > 1' },
              style: { backgroundColor: '#abc', fontWeight: 'bold' },
            },
          ],
          {
            ...layout,
            rowRuns: [
              [2, 3],
              [5, 5],
            ],
          },
          (formula, letters, rowNumber) => `${letters.get('price')}${rowNumber}>1`,
        ),
      ).to.deep.equal(
        [
          ['A2:A3', 'B2>1'],
          ['B2:B3', 'B2>1'],
          ['A5:A5', 'B5>1'],
          ['B5:B5', 'B5>1'],
        ].map(([ref, formula]) => ({
          ref,
          rules: [
            {
              type: 'expression',
              priority: 2,
              formulae: [formula],
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
          type: 'highlight',
          fields: ['price'],
          condition: { type: 'formula', formula: '=price > 1' },
          style: { color: '#000' },
        },
      ];
      expect(getConditionalFormattingExcelOptions(model, layout, undefined)).to.deep.equal([]);
      expect(
        getConditionalFormattingExcelOptions(
          [{ ...model[0], condition: { type: 'text', operator: 'isEmpty' } }],
          { ...layout, rowRuns: [] },
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
