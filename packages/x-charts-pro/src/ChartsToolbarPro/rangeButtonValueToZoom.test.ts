import { rangeButtonValueToZoom } from './rangeButtonValueToZoom';

// Domain: Jan 1 2023 → Jan 1 2025 (exactly 2 years)
const domainMin = new Date(2023, 0, 1).getTime();
const domainMax = new Date(2025, 0, 1).getTime();
const domainRange = domainMax - domainMin;

// Default zoomed bounds = full domain
const zoomedMin = domainMin;
const zoomedMax = domainMax;

describe('rangeButtonValueToZoom', () => {
  describe('null (reset)', () => {
    it('should return full range', () => {
      const result = rangeButtonValueToZoom(null, domainMin, domainMax, zoomedMin, zoomedMax);
      expect(result).to.deep.equal({ start: 0, end: 100 });
    });
  });

  describe('function value', () => {
    it('should pass domain and zoomed bounds to the function', () => {
      const fn = vi.fn(() => ({ start: 10, end: 90 }));
      rangeButtonValueToZoom(fn, domainMin, domainMax, zoomedMin, zoomedMax);
      expect(fn).toHaveBeenCalledWith(domainMin, domainMax, zoomedMin, zoomedMax);
    });

    it('should return the function result', () => {
      const result = rangeButtonValueToZoom(
        () => ({ start: 25, end: 75 }),
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result).to.deep.equal({ start: 25, end: 75 });
    });

    it('should clamp results below 0', () => {
      const result = rangeButtonValueToZoom(
        () => ({ start: -20, end: 80 }),
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.equal(0);
      expect(result.end).to.equal(80);
    });

    it('should clamp results above 100', () => {
      const result = rangeButtonValueToZoom(
        () => ({ start: 10, end: 150 }),
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.equal(10);
      expect(result.end).to.equal(100);
    });
  });

  describe('zero or negative domain range', () => {
    it('should return full range when domainMin equals domainMax', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'month' },
        domainMin,
        domainMin,
        domainMin,
        domainMin,
      );
      expect(result).to.deep.equal({ start: 0, end: 100 });
    });
  });

  describe('absolute date range', () => {
    it('should convert date range to zoom percentages', () => {
      // Midpoint of the 2-year domain = Jan 1 2024
      const result = rangeButtonValueToZoom(
        [new Date(2024, 0, 1), new Date(2025, 0, 1)],
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.be.closeTo(50, 0.1);
      expect(result.end).to.equal(100);
    });

    it('should clamp dates outside the domain', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2020, 0, 1), new Date(2030, 0, 1)],
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.equal(0);
      expect(result.end).to.equal(100);
    });

    it('should handle dates partially outside the domain', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2020, 0, 1), new Date(2024, 0, 1)],
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.equal(0);
      expect(result.end).to.be.closeTo(50, 0.1);
    });
  });

  describe('calendar interval', () => {
    it('should handle { unit: "year" } — last 1 year from end', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'year' },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      // Last year of a 2-year domain = 50%
      expect(result.start).to.be.closeTo(50, 0.5);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "year", step: 2 } — full domain', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'year', step: 2 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.be.closeTo(0, 0.5);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "month" } — last 1 month', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'month' },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      // 1 month out of 2 years — roughly 4.2%
      expect(result.start).to.be.greaterThan(95);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "month", step: 6 } — last 6 months', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'month', step: 6 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      // 6 months out of 2 years — roughly 25%
      expect(result.start).to.be.greaterThan(70);
      expect(result.start).to.be.lessThan(80);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "day" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'day' },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 24 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "week" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'week' },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 7 * 24 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "hour" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'hour', step: 12 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 12 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "minute" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'minute', step: 30 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 30 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "second" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'second', step: 30 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 30 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "millisecond" }', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'millisecond', step: 500 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const expectedStart = ((domainRange - 500) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should clamp start to 0 when interval exceeds domain', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'year', step: 10 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(result.start).to.equal(0);
      expect(result.end).to.equal(100);
    });

    it('should default step to 1', () => {
      const withStep = rangeButtonValueToZoom(
        { unit: 'day', step: 1 },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      const withoutStep = rangeButtonValueToZoom(
        { unit: 'day' },
        domainMin,
        domainMax,
        zoomedMin,
        zoomedMax,
      );
      expect(withStep).to.deep.equal(withoutStep);
    });
  });
});
