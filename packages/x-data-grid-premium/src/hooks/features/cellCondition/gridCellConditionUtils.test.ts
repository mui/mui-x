import { describe, it, expect } from 'vitest';
import { matchesGridCellConditionValue } from './gridCellConditionUtils';

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
});
