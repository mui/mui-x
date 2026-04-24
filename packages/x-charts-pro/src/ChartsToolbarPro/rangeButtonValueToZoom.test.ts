import { rangeButtonValueToZoom, type RangeButtonFunctionParams } from './rangeButtonValueToZoom';

// Domain: Jan 1 2023 → Jan 1 2025 (exactly 2 years)
const domainMin = new Date(2023, 0, 1).getTime();
const domainMax = new Date(2025, 0, 1).getTime();
const domainRange = domainMax - domainMin;

const timeParams: RangeButtonFunctionParams = {
  scaleType: 'time',
  data: undefined,
  domain: { min: domainMin, max: domainMax },
};

describe('rangeButtonValueToZoom', () => {
  describe('null (reset)', () => {
    it('should return full range', () => {
      const result = rangeButtonValueToZoom(null, timeParams);
      expect(result).to.deep.equal({ start: 0, end: 100 });
    });
  });

  describe('function value', () => {
    it('should pass params to the function', () => {
      const fn = vi.fn(() => ({ start: 10, end: 90 }));
      rangeButtonValueToZoom(fn, timeParams);
      expect(fn).toHaveBeenCalledWith(timeParams);
    });

    it('should return the function result', () => {
      const result = rangeButtonValueToZoom(() => ({ start: 25, end: 75 }), timeParams);
      expect(result).to.deep.equal({ start: 25, end: 75 });
    });

    it('should pass through results outside 0-100 (caller controls zoom bounds)', () => {
      const below = rangeButtonValueToZoom(() => ({ start: -20, end: 80 }), timeParams);
      expect(below).to.deep.equal({ start: -20, end: 80 });

      const above = rangeButtonValueToZoom(() => ({ start: 10, end: 150 }), timeParams);
      expect(above).to.deep.equal({ start: 10, end: 150 });
    });

    it('should receive data and scaleType for ordinal axes', () => {
      const data = ['A', 'B', 'C'];
      const ordinalParams: RangeButtonFunctionParams = {
        scaleType: 'band',
        data,
        domain: { min: 0, max: 2 },
      };
      const fn = vi.fn((_p: RangeButtonFunctionParams) => ({ start: 0, end: 100 }));
      rangeButtonValueToZoom(fn, ordinalParams);
      expect(fn).toHaveBeenCalledWith(ordinalParams);
      expect(fn.mock.calls[0][0].scaleType).to.equal('band');
      expect(fn.mock.calls[0][0].data).to.deep.equal(['A', 'B', 'C']);
    });
  });

  describe('zero or negative domain range', () => {
    it('should return full range when domainMin equals domainMax', () => {
      const result = rangeButtonValueToZoom(
        { unit: 'month' },
        {
          ...timeParams,
          domain: { min: domainMin, max: domainMin },
        },
      );
      expect(result).to.deep.equal({ start: 0, end: 100 });
    });
  });

  describe('absolute date range', () => {
    it('should convert date range to zoom percentages', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2024, 0, 1), new Date(2025, 0, 1)],
        timeParams,
      );
      expect(result.start).to.be.closeTo(50, 0.1);
      expect(result.end).to.equal(100);
    });

    it('should pass through dates outside the domain without clamping', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2020, 0, 1), new Date(2030, 0, 1)],
        timeParams,
      );
      expect(result.start).to.be.lessThan(0);
      expect(result.end).to.be.greaterThan(100);
    });

    it('should handle dates partially outside the domain', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2020, 0, 1), new Date(2024, 0, 1)],
        timeParams,
      );
      expect(result.start).to.be.lessThan(0);
      expect(result.end).to.be.closeTo(50, 0.1);
    });
  });

  describe('calendar interval', () => {
    it('should handle { unit: "year" } — last 1 year from end', () => {
      const result = rangeButtonValueToZoom({ unit: 'year' }, timeParams);
      expect(result.start).to.be.closeTo(50, 0.5);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "year", step: 2 } — full domain', () => {
      const result = rangeButtonValueToZoom({ unit: 'year', step: 2 }, timeParams);
      expect(result.start).to.be.closeTo(0, 0.5);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "month" } — last 1 month', () => {
      const result = rangeButtonValueToZoom({ unit: 'month' }, timeParams);
      expect(result.start).to.be.greaterThan(95);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "month", step: 6 } — last 6 months', () => {
      const result = rangeButtonValueToZoom({ unit: 'month', step: 6 }, timeParams);
      expect(result.start).to.be.greaterThan(70);
      expect(result.start).to.be.lessThan(80);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "day" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'day' }, timeParams);
      const expectedStart = ((domainRange - 24 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "week" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'week' }, timeParams);
      const expectedStart = ((domainRange - 7 * 24 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "hour" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'hour', step: 12 }, timeParams);
      const expectedStart = ((domainRange - 12 * 60 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "minute" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'minute', step: 30 }, timeParams);
      const expectedStart = ((domainRange - 30 * 60 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "second" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'second', step: 30 }, timeParams);
      const expectedStart = ((domainRange - 30 * 1000) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should handle { unit: "millisecond" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'millisecond', step: 500 }, timeParams);
      const expectedStart = ((domainRange - 500) / domainRange) * 100;
      expect(result.start).to.be.closeTo(expectedStart, 0.01);
      expect(result.end).to.equal(100);
    });

    it('should let start go negative when interval exceeds domain', () => {
      const result = rangeButtonValueToZoom({ unit: 'year', step: 10 }, timeParams);
      expect(result.start).to.be.lessThan(0);
      expect(result.end).to.equal(100);
    });

    it('should default step to 1', () => {
      const withStep = rangeButtonValueToZoom({ unit: 'day', step: 1 }, timeParams);
      const withoutStep = rangeButtonValueToZoom({ unit: 'day' }, timeParams);
      expect(withStep).to.deep.equal(withoutStep);
    });
  });

  describe('ordinal axis (index-based domain)', () => {
    const ordinalParams: RangeButtonFunctionParams = {
      scaleType: 'band',
      data: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      domain: { min: 0, max: 9 },
    };

    it('should reset to full range with null', () => {
      const result = rangeButtonValueToZoom(null, ordinalParams);
      expect(result).to.deep.equal({ start: 0, end: 100 });
    });

    it('should work with function values using data', () => {
      const result = rangeButtonValueToZoom(({ data }) => {
        const itemCount = data!.length;
        const visibleItems = 3;
        const startPct = ((itemCount - visibleItems) / itemCount) * 100;
        return { start: startPct, end: 100 };
      }, ordinalParams);
      expect(result.start).to.be.closeTo(70, 0.1);
      expect(result.end).to.equal(100);
    });

    it('should pass scaleType and data to function values', () => {
      const fn = vi.fn((_p: RangeButtonFunctionParams) => ({ start: 0, end: 100 }));
      rangeButtonValueToZoom(fn, ordinalParams);
      expect(fn.mock.calls[0][0].scaleType).to.equal('band');
      expect(fn.mock.calls[0][0].data).to.have.length(10);
      expect(fn.mock.calls[0][0].domain).to.deep.equal({ min: 0, max: 9 });
    });
  });

  describe('ordinal axis with date-like data', () => {
    const monthlyDates = Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1));
    const ordinalDateParams: RangeButtonFunctionParams = {
      scaleType: 'band',
      data: monthlyDates,
      domain: { min: 0, max: 11 },
    };

    it('should match absolute date range to data indices', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2024, 3, 1), new Date(2024, 8, 1)],
        ordinalDateParams,
      );
      expect(result.start).to.be.closeTo((3 / 11) * 100, 0.1);
      expect(result.end).to.be.closeTo((8 / 11) * 100, 0.1);
    });

    it('should clamp date range that starts before data', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2023, 0, 1), new Date(2024, 5, 1)],
        ordinalDateParams,
      );
      expect(result.start).to.equal(0);
      expect(result.end).to.be.closeTo((5 / 11) * 100, 0.1);
    });

    it('should clamp date range that ends after data', () => {
      const result = rangeButtonValueToZoom(
        [new Date(2024, 9, 1), new Date(2025, 6, 1)],
        ordinalDateParams,
      );
      expect(result.start).to.be.closeTo((9 / 11) * 100, 0.1);
      expect(result.end).to.equal(100);
    });

    it('should handle calendar interval { unit: "month", step: 3 }', () => {
      const result = rangeButtonValueToZoom({ unit: 'month', step: 3 }, ordinalDateParams);
      expect(result.start).to.be.closeTo((8 / 11) * 100, 5);
      expect(result.end).to.equal(100);
    });

    it('should handle calendar interval { unit: "year" }', () => {
      const result = rangeButtonValueToZoom({ unit: 'year' }, ordinalDateParams);
      expect(result.start).to.equal(0);
      expect(result.end).to.equal(100);
    });

    it('should skip missing (non-date) items and still match valid dates', () => {
      const result = rangeButtonValueToZoom([new Date(2024, 3, 1), new Date(2024, 8, 1)], {
        scaleType: 'band',
        // Index 2 is a missing value (null) mixed in with valid dates.
        data: [
          new Date(2024, 0, 1),
          new Date(2024, 3, 1),
          null,
          new Date(2024, 8, 1),
          new Date(2024, 11, 1),
        ],
        domain: { min: 0, max: 4 },
      });
      expect(result.start).to.be.closeTo((1 / 4) * 100, 0.1);
      expect(result.end).to.be.closeTo((3 / 4) * 100, 0.1);
    });

    it('should work with date strings', () => {
      const result = rangeButtonValueToZoom([new Date(2024, 3, 1), new Date(2024, 6, 1)], {
        scaleType: 'band',
        data: ['2024-01-01', '2024-04-01', '2024-07-01', '2024-10-01'],
        domain: { min: 0, max: 3 },
      });
      expect(result.start).to.be.closeTo((1 / 3) * 100, 0.1);
      expect(result.end).to.be.closeTo((2 / 3) * 100, 0.1);
    });

    it('should warn and fall back to continuous logic for non-date-like data', () => {
      let result: { start: number; end: number } | undefined;
      expect(() => {
        result = rangeButtonValueToZoom([new Date(2024, 0, 1), new Date(2024, 6, 1)], {
          scaleType: 'band',
          data: ['A', 'B', 'C', 'D', 'E'],
          domain: { min: 0, max: 4 },
        });
      }).toWarnDev(
        [
          'MUI X Charts: Range button received a date value for an ordinal axis whose data could not be parsed as dates.',
          'The zoom range may not match the intended selection. Provide date-like axis data or use a function value.',
        ].join('\n'),
      );
      expect(result!.start).to.be.a('number');
      expect(result!.end).to.be.a('number');
    });

    it('should warn when the range end is before its start', () => {
      expect(() => {
        rangeButtonValueToZoom([new Date(2024, 6, 1), new Date(2024, 0, 1)], ordinalDateParams);
      }).toWarnDev(
        [
          'MUI X Charts: Range button received a date range whose end is before its start.',
          'This produces an empty zoom range.',
        ].join('\n'),
      );
    });
  });
});
