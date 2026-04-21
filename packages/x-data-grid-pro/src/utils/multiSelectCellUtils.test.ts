import { getOverflowChipWidth, calculateVisibleCount } from './multiSelectCellUtils';

describe('multiSelectCellUtils', () => {
  describe('getOverflowChipWidth', () => {
    it('should return 0 for hiddenCount <= 0', () => {
      expect(getOverflowChipWidth(0)).to.equal(0);
      expect(getOverflowChipWidth(-1)).to.equal(0);
    });

    it('should return 32 for 1-9 hidden items', () => {
      expect(getOverflowChipWidth(1)).to.equal(32);
      expect(getOverflowChipWidth(9)).to.equal(32);
    });

    it('should return 38 for 10-99 hidden items', () => {
      expect(getOverflowChipWidth(10)).to.equal(38);
      expect(getOverflowChipWidth(99)).to.equal(38);
    });

    it('should return 44 for 100+ hidden items', () => {
      expect(getOverflowChipWidth(100)).to.equal(44);
      expect(getOverflowChipWidth(999)).to.equal(44);
    });
  });

  describe('calculateVisibleCount', () => {
    it('should return 0 for empty array', () => {
      const chipWidths = new Map<number, number>();
      expect(calculateVisibleCount(0, 200, chipWidths)).to.equal(0);
    });

    it('should return index when chip width is not measured', () => {
      const chipWidths = new Map<number, number>([[0, 50]]);
      expect(calculateVisibleCount(3, 200, chipWidths)).to.equal(1);
    });

    it('should show all chips when they fit without overflow chip', () => {
      // 3 chips: 68 + 4 + 66 + 4 + 71 = 213
      const chipWidths = new Map<number, number>([
        [0, 68],
        [1, 66],
        [2, 71],
      ]);
      expect(calculateVisibleCount(3, 213, chipWidths)).to.equal(3);
    });

    it('should collapse the last chip into +1 when the row would overflow', () => {
      // Sub-pixel widths from getBoundingClientRect — sum = 213, container = 212.3.
      // No tolerance: last chip is dropped, +1 takes its place.
      // 2 chips: 68 + 4 + 66 = 138, plus overflow chip (32) + gap (4) = 174 ≤ 212.3
      const chipWidths = new Map<number, number>([
        [0, 68],
        [1, 66],
        [2, 71],
      ]);
      expect(calculateVisibleCount(3, 212.3, chipWidths)).to.equal(2);
    });

    it('should always show at least first chip', () => {
      const chipWidths = new Map<number, number>([[0, 100]]);
      expect(calculateVisibleCount(1, 50, chipWidths)).to.equal(1);
    });

    it('should account for overflow chip width when hiding chips', () => {
      // 2 chips that would fit: 50 + 4 + 50 = 104
      // But with overflow chip (+1): 50 + 4 + 32 = 86
      const chipWidths = new Map<number, number>([
        [0, 50],
        [1, 50],
      ]);
      // Container can fit first chip + overflow chip (50 + 4 + 32 = 86)
      // but not both chips (104)
      expect(calculateVisibleCount(2, 90, chipWidths)).to.equal(1);
    });
  });
});
