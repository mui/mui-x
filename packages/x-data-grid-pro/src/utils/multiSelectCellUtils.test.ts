import {
  getOverflowChipWidth,
  calculateVisibleCount,
  DEFAULT_OVERFLOW_CHIP_WIDTHS,
  DEFAULT_GAP,
} from './multiSelectCellUtils';

describe('multiSelectCellUtils', () => {
  describe('getOverflowChipWidth', () => {
    it('should return 0 for hiddenCount <= 0', () => {
      expect(getOverflowChipWidth(0)).to.equal(0);
      expect(getOverflowChipWidth(-1)).to.equal(0);
    });

    it('should return the 1-digit width for 1-9 hidden items', () => {
      expect(getOverflowChipWidth(1)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[0]);
      expect(getOverflowChipWidth(9)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[0]);
    });

    it('should return the 2-digit width for 10-99 hidden items', () => {
      expect(getOverflowChipWidth(10)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[1]);
      expect(getOverflowChipWidth(99)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[1]);
    });

    it('should return the 3-digit width for 100+ hidden items', () => {
      expect(getOverflowChipWidth(100)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[2]);
      expect(getOverflowChipWidth(999)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[2]);
    });

    it('should reuse the last entry for digit counts beyond the table', () => {
      expect(getOverflowChipWidth(1000)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[2]);
      expect(getOverflowChipWidth(99999)).to.equal(DEFAULT_OVERFLOW_CHIP_WIDTHS[2]);
    });

    it('should accept custom measured widths', () => {
      const widths = [40, 50, 60];
      expect(getOverflowChipWidth(5, widths)).to.equal(40);
      expect(getOverflowChipWidth(50, widths)).to.equal(50);
      expect(getOverflowChipWidth(500, widths)).to.equal(60);
      expect(getOverflowChipWidth(5000, widths)).to.equal(60);
    });

    it('should return 0 when widths table is empty', () => {
      expect(getOverflowChipWidth(5, [])).to.equal(0);
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

    it('should use custom overflow widths and gap when supplied', () => {
      // Custom: overflow "+1" = 50, gap = 8
      // 1 chip + gap + overflow = 60 + 8 + 50 = 118
      const chipWidths = new Map<number, number>([
        [0, 60],
        [1, 60],
      ]);
      expect(calculateVisibleCount(2, 120, chipWidths, [50, 60, 70], 8)).to.equal(1);
      // Both chips: 60 + 8 + 60 = 128 — does not fit in 120
      expect(calculateVisibleCount(2, 128, chipWidths, [50, 60, 70], 8)).to.equal(2);
    });

    it('should fit all chips when sub-pixel sum equals container width exactly', () => {
      // Captured from a real autosize commit: chips sum + 3 gaps = 254.734375,
      // container = 254.734375. With strict (no-tolerance) `<=`, all 4 chips fit and
      // no overflow chip is needed.
      const chipWidths = new Map<number, number>([
        [0, 49.0390625],
        [1, 56.4609375],
        [2, 77.0703125],
        [3, 60.1640625],
      ]);
      const overflowWidths = [30.6875, 37.9921875, 45.296875];
      expect(calculateVisibleCount(4, 254.734375, chipWidths, overflowWidths, 4)).to.equal(4);
    });

    it('should fall back to DEFAULT_GAP when gap is omitted', () => {
      const chipWidths = new Map<number, number>([
        [0, 50],
        [1, 50],
      ]);
      // Default gap is 4, default overflow is 32; 50 + 4 + 32 = 86 fits in 90
      expect(calculateVisibleCount(2, 90, chipWidths)).to.equal(1);
      expect(DEFAULT_GAP).to.equal(4);
    });
  });
});
