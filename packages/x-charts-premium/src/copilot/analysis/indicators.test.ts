import { describe, expect, it } from 'vitest';
import { computeIndicator } from './indicators';

describe('computeIndicator', () => {
  describe('sma', () => {
    it('computes a trailing simple moving average with null leading positions', () => {
      // period 3 over [1,2,3,4,5,6]: index 2 = (1+2+3)/3 = 2, then 3, 4, 5.
      const result = computeIndicator('sma', [1, 2, 3, 4, 5, 6], { period: 3 });
      expect(result.kind).to.equal('sma');
      expect(result.period).to.equal(3);
      expect(result.series).to.have.length(1);
      expect(result.series[0].id).to.equal('sma');
      expect(result.series[0].data).to.deep.equal([null, null, 2, 3, 4, 5]);
    });

    it('defaults the period to 14', () => {
      const result = computeIndicator('sma', [1, 2, 3], {});
      expect(result.period).to.equal(14);
    });

    it('nulls a window that contains a null value', () => {
      // period 2: window [2,null] at index 2 -> null; [null,4] at index 3 -> null.
      const result = computeIndicator('sma', [1, 2, null, 4, 5], { period: 2 });
      expect(result.series[0].data).to.deep.equal([null, 1.5, null, null, 4.5]);
    });
  });

  describe('ema', () => {
    it('computes an EMA seeded with the first SMA window', () => {
      // period 3, alpha = 0.5. seed index 2 = SMA(1,2,3) = 2.
      // index 3 = 0.5*4 + 0.5*2 = 3; index 4 = 0.5*5 + 0.5*3 = 4; index 5 = 5.
      const result = computeIndicator('ema', [1, 2, 3, 4, 5, 6], { period: 3 });
      expect(result.series).to.have.length(1);
      expect(result.series[0].id).to.equal('ema');
      const data = result.series[0].data;
      expect(data[0]).to.equal(null);
      expect(data[1]).to.equal(null);
      expect(data[2]).to.be.closeTo(2, 1e-12);
      expect(data[3]).to.be.closeTo(3, 1e-12);
      expect(data[4]).to.be.closeTo(4, 1e-12);
      expect(data[5]).to.be.closeTo(5, 1e-12);
    });
  });

  describe('rsi', () => {
    it('returns 100 for a strictly increasing series (no losses)', () => {
      // Monotonic up: every delta is a gain, avgLoss = 0 -> RSI 100.
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
      const result = computeIndicator('rsi', values, { period: 14 });
      const data = result.series[0].data;
      // RSI needs `period` deltas; first value at index = period = 14.
      expect(data.slice(0, 14).every((v) => v === null)).to.equal(true);
      expect(data[14]).to.be.closeTo(100, 1e-9);
      expect(data[15]).to.be.closeTo(100, 1e-9);
    });

    it('falls between 0 and 100 for a mixed series', () => {
      const result = computeIndicator(
        'rsi',
        [44, 44.34, 44.09, 44.15, 43.61, 44.33, 44.83, 45.1, 45.42, 45.84, 46.08, 45.89, 46.03, 45.61, 46.28],
        { period: 14 },
      );
      const data = result.series[0].data;
      const last = data[14];
      expect(last).to.be.a('number');
      expect(last as number).to.be.greaterThan(0);
      expect(last as number).to.be.lessThan(100);
    });
  });

  describe('bollinger', () => {
    it('produces three lines (upper/mid/lower) with k = 2', () => {
      const values = [2, 4, 6, 8, 10, 12];
      const result = computeIndicator('bollinger', values, { period: 3 });
      expect(result.series.map((s) => s.id)).to.deep.equal(['upper', 'mid', 'lower']);
      // mid at index 2 = SMA(2,4,6) = 4; population stdDev of [2,4,6] = sqrt(8/3).
      const sd = Math.sqrt(8 / 3);
      expect(result.series[1].data[2]).to.be.closeTo(4, 1e-12);
      expect(result.series[0].data[2]).to.be.closeTo(4 + 2 * sd, 1e-12);
      expect(result.series[2].data[2]).to.be.closeTo(4 - 2 * sd, 1e-12);
      // Leading position is null on every line.
      expect(result.series[0].data[0]).to.equal(null);
      expect(result.series[1].data[0]).to.equal(null);
      expect(result.series[2].data[0]).to.equal(null);
    });
  });

  describe('macd', () => {
    it('produces macd/signal/histogram lines', () => {
      // 40 points so the signal line (seeded at index 33) becomes non-null.
      const values = Array.from({ length: 40 }, (_, i) => i + 1);
      const result = computeIndicator('macd', values, {});
      expect(result.series.map((s) => s.id)).to.deep.equal(['macd', 'signal', 'histogram']);
      const [macdLine, signal, histogram] = result.series;
      // EMA26 seed at index 25 -> macd line first non-null there.
      expect(macdLine.data[24]).to.equal(null);
      expect(macdLine.data[25]).to.be.a('number');
      // Signal is EMA9 of the macd line, first macd at 25 -> seed at 25 + 8 = 33.
      expect(signal.data[32]).to.equal(null);
      expect(signal.data[33]).to.be.a('number');
      // Histogram = macd - signal where both exist.
      expect(histogram.data[33]).to.be.closeTo(
        (macdLine.data[33] as number) - (signal.data[33] as number),
        1e-12,
      );
    });
  });

  describe('pivot', () => {
    it('derives flat support/resistance lines from high/low/close', () => {
      // high 10, low 2, close 6 -> pivot = 6, r1 = 10, s1 = 2, r2 = 14, s2 = -2.
      const result = computeIndicator('pivot', [4, 10, 2, 6], {});
      expect(result.series.map((s) => s.id)).to.deep.equal(['r2', 'r1', 'pivot', 's1', 's2']);
      const byId = Object.fromEntries(result.series.map((s) => [s.id, s.data]));
      expect(byId.pivot.every((v) => v === 6)).to.equal(true);
      expect(byId.r1[0]).to.be.closeTo(10, 1e-12);
      expect(byId.s1[0]).to.be.closeTo(2, 1e-12);
      expect(byId.r2[0]).to.be.closeTo(14, 1e-12);
      expect(byId.s2[0]).to.be.closeTo(-2, 1e-12);
    });
  });

  describe('linreg', () => {
    it('reuses the forecast regression for each trailing window', () => {
      // Perfectly linear y = 2x; the fitted endpoint equals the value itself.
      const result = computeIndicator('linreg', [0, 2, 4, 6, 8], { period: 3 });
      expect(result.series[0].id).to.equal('linreg');
      const data = result.series[0].data;
      expect(data[0]).to.equal(null);
      expect(data[1]).to.equal(null);
      expect(data[2]).to.be.closeTo(4, 1e-9);
      expect(data[3]).to.be.closeTo(6, 1e-9);
      expect(data[4]).to.be.closeTo(8, 1e-9);
    });
  });

  describe('edge cases', () => {
    it('returns an all-null line when the period exceeds the length (sma)', () => {
      const result = computeIndicator('sma', [1, 2, 3], { period: 5 });
      expect(result.series[0].data).to.deep.equal([null, null, null]);
    });

    it('returns an all-null line when the period exceeds the length (ema)', () => {
      const result = computeIndicator('ema', [1, 2, 3], { period: 5 });
      expect(result.series[0].data).to.deep.equal([null, null, null]);
    });

    it('returns an all-null line when the period exceeds the length (rsi)', () => {
      const result = computeIndicator('rsi', [1, 2, 3], { period: 14 });
      expect(result.series[0].data).to.deep.equal([null, null, null]);
    });

    it('returns an empty series for an unknown kind', () => {
      // @ts-expect-error testing an unsupported kind at runtime.
      const result = computeIndicator('unknown', [1, 2, 3], {});
      expect(result.series).to.deep.equal([]);
      expect(result.kind).to.equal('unknown');
    });

    it('handles a constant series (stdDev 0 -> bollinger bands collapse to mid)', () => {
      const result = computeIndicator('bollinger', [5, 5, 5, 5], { period: 2 });
      expect(result.series[0].data[1]).to.equal(5);
      expect(result.series[1].data[1]).to.equal(5);
      expect(result.series[2].data[1]).to.equal(5);
    });

    it('handles an empty series', () => {
      const result = computeIndicator('sma', [], { period: 3 });
      expect(result.series[0].data).to.deep.equal([]);
    });
  });
});
