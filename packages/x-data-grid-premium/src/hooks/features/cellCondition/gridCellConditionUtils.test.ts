import { describe, it, expect } from 'vitest';
import {
  getGridCellConditionExcelFormula,
  matchesGridCellConditionValue,
} from './gridCellConditionUtils';

describe('gridCellConditionUtils', () => {
  describe('matchesGridCellConditionValue', () => {
    it('compares numbers and only matches number cells', () => {
      const condition = { type: 'cell', operator: 'greaterThan', value: 10 } as const;
      expect(matchesGridCellConditionValue(condition, 11)).to.equal(true);
      expect(matchesGridCellConditionValue(condition, 10)).to.equal(false);
      expect(matchesGridCellConditionValue(condition, '11')).to.equal(false);
      expect(matchesGridCellConditionValue(condition, null)).to.equal(false);
    });

    it('supports between, notBetween and notEqual', () => {
      const between = { type: 'cell', operator: 'between', value: 1, valueTo: 3 } as const;
      expect(matchesGridCellConditionValue(between, 1)).to.equal(true);
      expect(matchesGridCellConditionValue(between, 3)).to.equal(true);
      expect(matchesGridCellConditionValue(between, 4)).to.equal(false);
      expect(matchesGridCellConditionValue({ ...between, operator: 'notBetween' }, 4)).to.equal(
        true,
      );
      expect(
        matchesGridCellConditionValue({ type: 'cell', operator: 'notEqual', value: 1 }, null),
      ).to.equal(true);
    });

    it('never compares numbers with dates', () => {
      expect(
        matchesGridCellConditionValue(
          { type: 'cell', operator: 'greaterThan', value: 0 },
          new Date(2026, 0, 1),
        ),
      ).to.equal(false);
    });

    it('compares dates and strings', () => {
      expect(
        matchesGridCellConditionValue(
          { type: 'cell', operator: 'lessThan', value: new Date(2026, 0, 1) },
          new Date(2025, 5, 1),
        ),
      ).to.equal(true);
      expect(
        matchesGridCellConditionValue({ type: 'cell', operator: 'equal', value: 'Apple' }, 'apple'),
      ).to.equal(true);
    });

    it('matches text case-insensitively', () => {
      expect(
        matchesGridCellConditionValue(
          { type: 'text', operator: 'contains', value: 'AN' },
          'Banana',
        ),
      ).to.equal(true);
      expect(
        matchesGridCellConditionValue(
          { type: 'text', operator: 'startsWith', value: 'ba' },
          'Banana',
        ),
      ).to.equal(true);
      expect(
        matchesGridCellConditionValue({ type: 'text', operator: 'endsWith', value: 'x' }, 'Banana'),
      ).to.equal(false);
      expect(matchesGridCellConditionValue({ type: 'text', operator: 'isEmpty' }, ' ')).to.equal(
        true,
      );
      // Like Excel's `TRIM`, only spaces are blank.
      expect(matchesGridCellConditionValue({ type: 'text', operator: 'isEmpty' }, '\t')).to.equal(
        false,
      );
      expect(
        matchesGridCellConditionValue({ type: 'text', operator: 'isNotEmpty' }, null),
      ).to.equal(false);
    });
  });

  describe('dates', () => {
    const date = new Date(2024, 0, 1);
    const restored = JSON.parse(JSON.stringify(date)) as string;

    it('reads ISO strings as dates against a date cell', () => {
      const condition = { type: 'cell', operator: 'lessThan', value: restored } as const;
      expect(matchesGridCellConditionValue(condition, new Date(2023, 5, 1))).to.equal(true);
      expect(getGridCellConditionExcelFormula(condition, 'D2', 'date')).to.equal(
        'AND(ISNUMBER(D2),D2<(DATE(2024,1,1)+TIME(0,0,0)))',
      );
    });

    it('only tests emptiness on date cells with text conditions', () => {
      const contains = { type: 'text', operator: 'contains', value: 'gmt' } as const;
      expect(matchesGridCellConditionValue(contains, date)).to.equal(false);
      expect(
        matchesGridCellConditionValue({ ...contains, operator: 'notContains' }, date),
      ).to.equal(false);
      expect(
        matchesGridCellConditionValue({ type: 'text', operator: 'isNotEmpty' }, date),
      ).to.equal(true);
      expect(getGridCellConditionExcelFormula(contains, 'D2', 'date')).to.equal(null);
      expect(
        getGridCellConditionExcelFormula({ type: 'text', operator: 'isEmpty' }, 'D2', 'date'),
      ).to.equal('LEN(TRIM(D2))=0');
    });
  });

  describe('ranges', () => {
    it('never matches a range without a comparable upper bound', () => {
      const missing = { type: 'cell', operator: 'notBetween', value: 10 } as const;
      const mixed = {
        type: 'cell',
        operator: 'between',
        value: 1,
        valueTo: new Date(2024, 0, 1),
      } as const;
      expect(matchesGridCellConditionValue(missing, 15)).to.equal(false);
      expect(matchesGridCellConditionValue(mixed, 2)).to.equal(false);
      expect(getGridCellConditionExcelFormula(missing, 'B2', 'number')).to.equal(null);
      expect(getGridCellConditionExcelFormula(mixed, 'B2', 'number')).to.equal(null);
    });
  });

  it('skips Excel formulas with text longer than Excel accepts', () => {
    expect(
      getGridCellConditionExcelFormula(
        { type: 'text', operator: 'contains', value: 'a'.repeat(256) },
        'A2',
        'string',
      ),
    ).to.equal(null);
  });
});
