import { describe, it, expect } from 'vitest';
import { RowsMeta, type RowsMetaState } from './dimensions';

const uniform: RowsMetaState = {
  rowCount: 3,
  uniformRowHeight: 50,
  positions: null,
  currentPageTotalHeight: 150,
  pinnedTopRowsTotalHeight: 0,
  pinnedBottomRowsTotalHeight: 0,
};

const variable: RowsMetaState = {
  ...uniform,
  positions: [0, 50, 130],
  currentPageTotalHeight: 180,
};

describe('RowsMeta', () => {
  describe('getPosition', () => {
    it('derives the positions of uniform rows from their height', () => {
      expect(RowsMeta.getPosition(uniform, 0)).to.equal(0);
      expect(RowsMeta.getPosition(uniform, 2)).to.equal(100);
    });

    it('reads the positions of variable rows', () => {
      expect(RowsMeta.getPosition(variable, 2)).to.equal(130);
    });

    it('returns undefined out of range, like an array lookup', () => {
      expect(RowsMeta.getPosition(uniform, -1)).to.equal(undefined);
      expect(RowsMeta.getPosition(uniform, 3)).to.equal(undefined);
      expect(RowsMeta.getPosition(variable, 3)).to.equal(undefined);
    });
  });

  describe('getSlotHeight', () => {
    it('spans up to the next row, or the end of the content for the last row', () => {
      expect(RowsMeta.getSlotHeight(uniform, 1)).to.equal(50);
      expect(RowsMeta.getSlotHeight(uniform, 2)).to.equal(50);
      expect(RowsMeta.getSlotHeight(variable, 1)).to.equal(80);
      expect(RowsMeta.getSlotHeight(variable, 2)).to.equal(50);
    });

    it('is 0 out of range', () => {
      expect(RowsMeta.getSlotHeight(uniform, 3)).to.equal(0);
      expect(RowsMeta.getSlotHeight(variable, 3)).to.equal(0);
    });
  });
});
