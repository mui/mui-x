import {
  createContinuousScaleGetAxisFilter,
  createDiscreteScaleGetAxisFilter,
} from './createAxisFilterMapper';

const continuousFilter = createContinuousScaleGetAxisFilter;

describe('createDiscreteScaleGetAxisFilter', () => {
  it("should not include elements that aren't at least partially visible", () => {
    const axisData = ['I0', 'I1', 'I2', 'I3', 'I4'];
    const filter = createDiscreteScaleGetAxisFilter(axisData, 20, 80, 'x');

    expect(filter({ x: 'I0', y: null }, 0)).toBe(false); // index 0, outside range
    expect(filter({ x: 'I1', y: null }, 1)).toBe(true); // index 1, within range
    expect(filter({ x: 'I2', y: null }, 2)).toBe(true); // index 2, within range
    expect(filter({ x: 'I3', y: null }, 3)).toBe(true); // index 3, within range
    expect(filter({ x: 'I4', y: null }, 4)).toBe(false); // index 4, outside range
  });

  it('should include elements if they are partially visible', () => {
    const axisData = ['I0', 'I1', 'I2', 'I3'];
    const filter = createDiscreteScaleGetAxisFilter(axisData, 24, 76, 'y');

    expect(filter({ x: null, y: 'I0' }, 0)).toBe(true);
    expect(filter({ x: null, y: 'I1' }, 1)).toBe(true);
    expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
    expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
  });

  it('should include elements if they are partially visible (another case)', () => {
    const axisData = ['I0', 'I1', 'I2', 'I3'];
    const filter = createDiscreteScaleGetAxisFilter(axisData, 51, 76, 'y');

    expect(filter({ x: null, y: 'I0' }, 0)).toBe(false);
    expect(filter({ x: null, y: 'I1' }, 1)).toBe(false);
    expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
    expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
  });

  it('should include elements if they are partially visible (another case)', () => {
    const axisData = ['I0', 'I1', 'I2', 'I3'];
    const filter = createDiscreteScaleGetAxisFilter(axisData, 51, 76, 'y');

    expect(filter({ x: null, y: 'I0' }, 0)).toBe(false);
    expect(filter({ x: null, y: 'I1' }, 1)).toBe(false);
    expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
    expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
  });

  it('should include all elements when there is no zoom', () => {
    const axisData = ['I0', 'I1', 'I2', 'I3', 'I4', 'I5'];
    const filter = createDiscreteScaleGetAxisFilter(axisData, 0, 100, 'y');

    expect(filter({ x: null, y: 'I0' }, 0)).toBe(true);
    expect(filter({ x: null, y: 'I1' }, 1)).toBe(true);
    expect(filter({ x: null, y: 'I2' }, 2)).toBe(true);
    expect(filter({ x: null, y: 'I3' }, 3)).toBe(true);
    expect(filter({ x: null, y: 'I4' }, 4)).toBe(true);
    expect(filter({ x: null, y: 'I5' }, 5)).toBe(true);
  });
});

describe('createContinuousScaleGetAxisFilter', () => {
  describe('linear scale', () => {
    it('should filter values within zoom range', () => {
      const filter = continuousFilter('linear', [0, 100], 20, 80, 'x', undefined, 'nice');

      // Test values within range
      expect(filter({ x: 30, y: null }, 0)).toBe(true);
      expect(filter({ x: 50, y: null }, 0)).toBe(true);
      expect(filter({ x: 70, y: null }, 0)).toBe(true);

      // Test values outside range
      expect(filter({ x: 10, y: null }, 0)).toBe(false);
      expect(filter({ x: 90, y: null }, 0)).toBe(false);
    });

    it('should handle edge values at zoom boundaries', () => {
      const filter = continuousFilter('linear', [0, 100], 25, 75, 'x', undefined, 'nice');

      // Values at boundaries should be included
      expect(filter({ x: 25, y: null }, 0)).toBe(true);
      expect(filter({ x: 75, y: null }, 0)).toBe(true);
    });

    it('should handle null values', () => {
      const filter = continuousFilter('linear', [0, 100], 20, 80, 'x', undefined, 'nice');

      // Null values should be ignored (return true)
      expect(filter({ x: null, y: null }, 0)).toBe(true);
    });

    it('should work with y direction', () => {
      const filter = continuousFilter('linear', [0, 100], 30, 70, 'y', undefined, 'nice');

      expect(filter({ x: null, y: 40 }, 0)).toBe(true);
      expect(filter({ x: null, y: 60 }, 0)).toBe(true);
      expect(filter({ x: null, y: 20 }, 0)).toBe(false);
      expect(filter({ x: null, y: 80 }, 0)).toBe(false);
    });
  });

  describe('time scale', () => {
    it('should filter date values correctly', () => {
      const startDate = new Date('2023-01-01').getTime();
      const endDate = new Date('2023-12-31').getTime();
      const filter = continuousFilter('time', [startDate, endDate], 25, 75, 'x', undefined, 'nice');

      const midYearDate = new Date('2023-06-15').getTime();
      const earlyYearDate = new Date('2023-02-01').getTime();
      const lateYearDate = new Date('2023-11-01').getTime();

      expect(filter({ x: midYearDate, y: null }, 0)).toBe(true);
      expect(filter({ x: earlyYearDate, y: null }, 0)).toBe(false);
      expect(filter({ x: lateYearDate, y: null }, 0)).toBe(false);
    });
  });

  describe('fallback to axis data', () => {
    it('should use axis data when value direction is missing', () => {
      const axisData = [10, 20, 30, 40, 50];
      const extrema = [10, 50] as const;
      const filter = continuousFilter('linear', extrema, 40, 80, 'x', axisData, 'nice');

      // When x value is missing, it should use axisData[dataIndex]
      expect(filter({ x: null, y: null }, 0)).toBe(false); // axisData[0] = 10, outside range
      expect(filter({ x: null, y: null }, 2)).toBe(true); // axisData[2] = 30, within range
      expect(filter({ x: null, y: null }, 4)).toBe(false); // axisData[4] = 50, outside range
    });

    it('should handle out of range index gracefully', () => {
      const axisData = [10, 20, 30];
      const extrema = [10, 30] as const;
      const filter = continuousFilter('linear', extrema, 20, 80, 'x', axisData, 'nice');

      // Out of range index should return true (ignore)
      expect(filter({ x: null, y: null }, 5)).toBe(true);
      expect(filter({ x: null, y: null }, -1)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle full zoom range (0-100)', () => {
      const extrema = [-50, 50] as const;
      const filter = continuousFilter('linear', extrema, 0, 100, 'x', undefined, 'nice');

      expect(filter({ x: -50.1, y: null }, 0)).toBe(false);
      expect(filter({ x: -50, y: null }, 0)).toBe(true);
      expect(filter({ x: 0, y: null }, 0)).toBe(true);
      expect(filter({ x: 50, y: null }, 0)).toBe(true);
      expect(filter({ x: 50.1, y: null }, 0)).toBe(false);
    });

    it('should handle very narrow zoom range', () => {
      const extrema = [0, 100] as const;
      const filter = continuousFilter('linear', extrema, 49, 51, 'x', undefined, 'nice');

      expect(filter({ x: 48, y: null }, 0)).toBe(false);
      expect(filter({ x: 50, y: null }, 0)).toBe(true);
      expect(filter({ x: 52, y: null }, 0)).toBe(false);
    });

    it('should handle undefined scale type (defaults to linear)', () => {
      const extrema = [0, 100] as const;
      const filter = continuousFilter(undefined, extrema, 25, 75, 'x', undefined, 'nice');

      expect(filter({ x: 40, y: null }, 0)).toBe(true);
      expect(filter({ x: 10, y: null }, 0)).toBe(false);
      expect(filter({ x: 90, y: null }, 0)).toBe(false);
    });

    it('should handle negative extrema values', () => {
      const extrema = [-50, 50] as const;
      const filter = continuousFilter('linear', extrema, 25, 75, 'x', undefined, 'nice');

      expect(filter({ x: 0, y: null }, 0)).toBe(true);
      expect(filter({ x: -40, y: null }, 0)).toBe(false);
      expect(filter({ x: 40, y: null }, 0)).toBe(false);
    });
  });

  describe('domain limit behavior', () => {
    it('should apply nice domain when domainLimit is "nice"', () => {
      const extrema = [1, 99] as const;
      const niceFilter = continuousFilter('linear', extrema, 25, 75, 'x', undefined, 'nice');

      // With nice, the domain should be rounded to [0, 100]
      // 25% of [0, 100] = 0 + 0.25 * 100 = 25
      // 75% of [0, 100] = 0 + 0.75 * 100 = 75
      expect(niceFilter({ x: 25, y: null }, 0)).toBe(true);
      expect(niceFilter({ x: 75, y: null }, 0)).toBe(true);
      expect(niceFilter({ x: 24.5, y: null }, 0)).toBe(false); // Below 25
      expect(niceFilter({ x: 99.5, y: null }, 0)).toBe(false); // Above 75
    });

    it('should use strict domain when domainLimit is "strict"', () => {
      const extrema = [1, 99] as const;
      const strictFilter = continuousFilter('linear', extrema, 25, 75, 'x', undefined, 'strict');

      // With strict, the domain should remain [1, 99]
      // 25% of [1, 99] = 1 + 0.25 * 98 = 25.5
      // 75% of [1, 99] = 1 + 0.75 * 98 = 74.5
      expect(strictFilter({ x: 26, y: null }, 0)).toBe(true);
      expect(strictFilter({ x: 74, y: null }, 0)).toBe(true);
      expect(strictFilter({ x: 25, y: null }, 0)).toBe(false); // Below 25.5
      expect(strictFilter({ x: 75, y: null }, 0)).toBe(false); // Above 74.5
    });

    it('should handle function domainLimit', () => {
      const extrema = [20, 80] as const;
      const customFn = (min: number, max: number) => ({ min: min - 10, max: max + 10 });
      const functionFilter = continuousFilter('linear', extrema, 25, 75, 'x', undefined, customFn);

      // The function transforms [20, 80] to [10, 90]
      // 25% of [10, 90] = 10 + 0.25 * 80 = 30
      // 75% of [10, 90] = 10 + 0.75 * 80 = 70
      expect(functionFilter({ x: 30, y: null }, 0)).toBe(true);
      expect(functionFilter({ x: 70, y: null }, 0)).toBe(true);
      expect(functionFilter({ x: 29, y: null }, 0)).toBe(false); // Below 30
      expect(functionFilter({ x: 71, y: null }, 0)).toBe(false); // Above 70
    });

    it('should display the different domain limits behaviors', () => {
      // This test shows that the fix actually works by comparing nice vs strict
      const extrema = [5, 99] as const;

      const niceFilter = continuousFilter('linear', extrema, 50, 50, 'x', undefined, 'nice');
      const strictFilter = continuousFilter('linear', extrema, 50, 50, 'x', undefined, 'strict');

      // Both filters should work, demonstrating that domain limits are properly handled
      // With nice: [5,99] becomes [0,100], so 50% = 50
      // With strict: [5,99] stays [5,99], so 50% = 50 (5 + 0.5 * 94 = 52)
      expect(niceFilter({ x: 50, y: null }, 0)).toBe(true);
      expect(strictFilter({ x: 52, y: null }, 0)).toBe(true);
    });
  });
});
