import { describe, it, expect } from 'vitest';
import type { RowsMetaState } from './dimensions';
import { RowsMeta } from './dimensions';

const createUniform = () =>
  RowsMeta.create({
    rowCount: 3,
    hasUniformRowHeight: true,
    positions: null,
    currentPageTotalHeight: 150,
    pinnedTopRowsTotalHeight: 0,
    pinnedBottomRowsTotalHeight: 0,
  });

const uniform = createUniform();

const variable: RowsMetaState = {
  rowCount: 3,
  hasUniformRowHeight: false,
  positions: [0, 50, 130],
  currentPageTotalHeight: 180,
  pinnedTopRowsTotalHeight: 0,
  pinnedBottomRowsTotalHeight: 0,
};

describe('RowsMeta', () => {
  describe('create', () => {
    it('builds the positions of uniform rows on first access, once', () => {
      const rowsMeta = createUniform();
      expect(rowsMeta.positions).to.deep.equal([0, 50, 100]);
      expect(rowsMeta.positions).to.equal(rowsMeta.positions);
    });

    it('keeps the positions key when the state is spread', () => {
      expect({ ...createUniform() }.positions).to.deep.equal([0, 50, 100]);
    });
  });

  describe('getUniformRowHeight', () => {
    it('derives the row height from the total height', () => {
      expect(RowsMeta.getUniformRowHeight(uniform)).to.equal(50);
    });

    it('is 0 without rows', () => {
      const empty = RowsMeta.create({
        rowCount: 0,
        hasUniformRowHeight: true,
        positions: null,
        currentPageTotalHeight: 0,
        pinnedTopRowsTotalHeight: 0,
        pinnedBottomRowsTotalHeight: 0,
      });
      expect(RowsMeta.getUniformRowHeight(empty)).to.equal(0);
      expect(RowsMeta.getPosition(empty, 0)).to.equal(undefined);
      expect(empty.positions).to.deep.equal([]);
    });

    it('positions fractional rows within rounding of their summed height', () => {
      const rowCount = 1000;
      const rowHeight = 33.3;
      let totalHeight = 0;
      for (let i = 0; i < rowCount; i += 1) {
        totalHeight += rowHeight;
      }
      const rowsMeta = RowsMeta.create({
        rowCount,
        hasUniformRowHeight: true,
        positions: null,
        currentPageTotalHeight: totalHeight,
        pinnedTopRowsTotalHeight: 0,
        pinnedBottomRowsTotalHeight: 0,
      });
      expect(RowsMeta.getPosition(rowsMeta, rowCount - 1)).to.be.closeTo(
        (rowCount - 1) * rowHeight,
        1e-6,
      );
    });
  });

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
