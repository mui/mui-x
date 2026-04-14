import { describe, it, expect } from 'vitest';
import { getNavigationTarget, DEFAULT_ROW_TYPES, NavigationOptions } from './getNavigationTarget';

/**
 * Default options for week/day views: 3 row types, 7 columns, 1 row per type.
 */
const weekViewOptions: NavigationOptions = {
  columnCount: 7,
  rowTypes: DEFAULT_ROW_TYPES,
  rowCounts: {},
};

/**
 * Options for month view: header + day-grid only, 7 columns, 5 week rows.
 */
const monthViewOptions: NavigationOptions = {
  columnCount: 7,
  rowTypes: ['header', 'day-grid'],
  rowCounts: { 'day-grid': 5 },
};

/**
 * Options for day view: all 3 row types, 1 column.
 */
const dayViewOptions: NavigationOptions = {
  columnCount: 1,
  rowTypes: DEFAULT_ROW_TYPES,
  rowCounts: {},
};

describe('getNavigationTarget', () => {
  describe('ArrowLeft', () => {
    it('should move to the previous column', () => {
      const result = getNavigationTarget('ArrowLeft', 'header', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'header', rowIndex: 0, columnIndex: 2 });
    });

    it('should return null at the first column', () => {
      const result = getNavigationTarget('ArrowLeft', 'header', 0, 0, weekViewOptions);
      expect(result).to.equal(null);
    });

    it('should preserve rowType and rowIndex', () => {
      const result = getNavigationTarget('ArrowLeft', 'day-grid', 2, 4, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 2, columnIndex: 3 });
    });
  });

  describe('ArrowRight', () => {
    it('should move to the next column', () => {
      const result = getNavigationTarget('ArrowRight', 'header', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'header', rowIndex: 0, columnIndex: 4 });
    });

    it('should return null at the last column', () => {
      const result = getNavigationTarget('ArrowRight', 'header', 0, 6, weekViewOptions);
      expect(result).to.equal(null);
    });

    it('should return null on the only column in day view', () => {
      const result = getNavigationTarget('ArrowRight', 'time-grid', 0, 0, dayViewOptions);
      expect(result).to.equal(null);
    });

    it('should preserve rowType and rowIndex', () => {
      const result = getNavigationTarget('ArrowRight', 'day-grid', 3, 2, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 3, columnIndex: 3 });
    });
  });

  describe('ArrowDown — single-row types (week/day view)', () => {
    it('should move from header to day-grid', () => {
      const result = getNavigationTarget('ArrowDown', 'header', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 0, columnIndex: 3 });
    });

    it('should move from day-grid to time-grid', () => {
      const result = getNavigationTarget('ArrowDown', 'day-grid', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'time-grid', rowIndex: 0, columnIndex: 3 });
    });

    it('should return null at the last row type (time-grid)', () => {
      const result = getNavigationTarget('ArrowDown', 'time-grid', 0, 3, weekViewOptions);
      expect(result).to.equal(null);
    });

    it('should preserve columnIndex when moving between row types', () => {
      const result = getNavigationTarget('ArrowDown', 'header', 0, 5, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 0, columnIndex: 5 });
    });
  });

  describe('ArrowUp — single-row types (week/day view)', () => {
    it('should move from time-grid to day-grid', () => {
      const result = getNavigationTarget('ArrowUp', 'time-grid', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 0, columnIndex: 3 });
    });

    it('should move from day-grid to header', () => {
      const result = getNavigationTarget('ArrowUp', 'day-grid', 0, 3, weekViewOptions);
      expect(result).to.deep.equal({ rowType: 'header', rowIndex: 0, columnIndex: 3 });
    });

    it('should return null at the first row type (header)', () => {
      const result = getNavigationTarget('ArrowUp', 'header', 0, 3, weekViewOptions);
      expect(result).to.equal(null);
    });
  });

  describe('ArrowDown — multi-row types (month view)', () => {
    it('should move from header to the first week row', () => {
      const result = getNavigationTarget('ArrowDown', 'header', 0, 3, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 0, columnIndex: 3 });
    });

    it('should move between week rows within day-grid', () => {
      const result = getNavigationTarget('ArrowDown', 'day-grid', 0, 3, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 1, columnIndex: 3 });
    });

    it('should navigate through all week rows', () => {
      const result = getNavigationTarget('ArrowDown', 'day-grid', 3, 5, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 4, columnIndex: 5 });
    });

    it('should return null at the last week row (no time-grid in month view)', () => {
      const result = getNavigationTarget('ArrowDown', 'day-grid', 4, 3, monthViewOptions);
      expect(result).to.equal(null);
    });
  });

  describe('ArrowUp — multi-row types (month view)', () => {
    it('should move between week rows within day-grid', () => {
      const result = getNavigationTarget('ArrowUp', 'day-grid', 3, 5, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 2, columnIndex: 5 });
    });

    it('should move from first week row to header', () => {
      const result = getNavigationTarget('ArrowUp', 'day-grid', 0, 3, monthViewOptions);
      expect(result).to.deep.equal({ rowType: 'header', rowIndex: 0, columnIndex: 3 });
    });

    it('should return null at header', () => {
      const result = getNavigationTarget('ArrowUp', 'header', 0, 3, monthViewOptions);
      expect(result).to.equal(null);
    });
  });

  describe('ArrowUp — navigating to previous row type with multiple rows', () => {
    it('should land on the last rowIndex of the previous row type', () => {
      // time-grid going up to day-grid which has 5 rows → should land on rowIndex 4
      const options: NavigationOptions = {
        columnCount: 7,
        rowTypes: ['header', 'day-grid', 'time-grid'],
        rowCounts: { 'day-grid': 5 },
      };
      const result = getNavigationTarget('ArrowUp', 'time-grid', 0, 3, options);
      expect(result).to.deep.equal({ rowType: 'day-grid', rowIndex: 4, columnIndex: 3 });
    });
  });

  describe('ArrowDown — crossing from multi-row type to next type', () => {
    it('should move from the last day-grid row to time-grid row 0', () => {
      const options: NavigationOptions = {
        columnCount: 7,
        rowTypes: ['header', 'day-grid', 'time-grid'],
        rowCounts: { 'day-grid': 3 },
      };
      const result = getNavigationTarget('ArrowDown', 'day-grid', 2, 5, options);
      expect(result).to.deep.equal({ rowType: 'time-grid', rowIndex: 0, columnIndex: 5 });
    });
  });

  describe('unknown keys', () => {
    it('should return null for non-arrow keys', () => {
      expect(getNavigationTarget('Enter', 'header', 0, 3, weekViewOptions)).to.equal(null);
      expect(getNavigationTarget('Tab', 'day-grid', 0, 0, weekViewOptions)).to.equal(null);
      expect(getNavigationTarget('Escape', 'time-grid', 0, 6, weekViewOptions)).to.equal(null);
    });
  });

  describe('edge cases', () => {
    it('should return null for ArrowDown when rowType is not in rowTypes', () => {
      const options: NavigationOptions = {
        columnCount: 7,
        rowTypes: ['header', 'day-grid'],
        rowCounts: {},
      };
      const result = getNavigationTarget('ArrowDown', 'time-grid', 0, 3, options);
      expect(result).to.equal(null);
    });

    it('should return null for ArrowUp when rowType is not in rowTypes', () => {
      const options: NavigationOptions = {
        columnCount: 7,
        rowTypes: ['header', 'day-grid'],
        rowCounts: {},
      };
      const result = getNavigationTarget('ArrowUp', 'time-grid', 0, 3, options);
      expect(result).to.equal(null);
    });

    it('should handle columnCount of 1 (day view)', () => {
      expect(getNavigationTarget('ArrowLeft', 'header', 0, 0, dayViewOptions)).to.equal(null);
      expect(getNavigationTarget('ArrowRight', 'header', 0, 0, dayViewOptions)).to.equal(null);
    });
  });
});
