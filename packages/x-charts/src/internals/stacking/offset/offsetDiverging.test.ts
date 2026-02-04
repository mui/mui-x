import { expect } from 'vitest';
import { offsetDiverging } from './offsetDiverging';

/**
 * Generates series data for stacking order tests.
 * Each series is an array of data points, where each data point has a `data` object
 * containing the original value.
 *
 * Use the optional `zeros` parameter to specify custom end values for each data point.
 * The `zeros` array accepts `undefined` to indicate that the default end value should be used.
 *
 * @example
 * ```tsx
 *  const series = generateSeries(
 *    [[10, 5]],
 *    [[undefined, 0]],
 *  );
 * // series will be:
 * [[
 *   { data: { S0: 10 }, 0: 0, 1: 10 },
 *   { data: { S0: 0 }, 0: 0, 1: 5 },
 * ]]
 * ```
 *
 * @param data - A 2D array where each sub-array represents a series and contains the values for that series.
 * @param zeros - (Optional) A 2D array of the same shape as `data` to specify custom end values for each data point.
 * @returns An array of series formatted for stacking order tests.
 */
const generateSeries = (
  data: (number | null)[][],
  zeros?: (number | undefined | null)[][],
): any => {
  const series: any = data.map((seriesData, seriesIndex) => {
    const points: any = seriesData.map((value, pointIndex) => ({
      data: { [`S${seriesIndex}`]: value },
      0: 0,
      1:
        zeros?.[seriesIndex]?.[pointIndex] === undefined
          ? value
          : zeros?.[seriesIndex]?.[pointIndex],
    }));
    points.key = `S${seriesIndex}`;
    return points;
  });
  return series;
};

describe('offsetDiverging', () => {
  it('should handle empty series array', () => {
    const series: any = [];
    const order: any[] = [];
    offsetDiverging(series, order);
    expect(series).to.deep.equal([]);
  });
  it('should stack positive values above zero', () => {
    const series = generateSeries([
      [10, 20],
      [5, 15],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First series starts at 0
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[0][1][0]).to.equal(0);
    expect(series[0][1][1]).to.equal(20);
    // Second series stacks on top of first
    expect(series[1][0][0]).to.equal(10);
    expect(series[1][0][1]).to.equal(15);
    expect(series[1][1][0]).to.equal(20);
    expect(series[1][1][1]).to.equal(35);
  });
  it('should stack negative values below zero', () => {
    const series = generateSeries([
      [-10, -20],
      [-5, -15],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First series starts at 0 and goes negative
    expect(series[0][0][1]).to.equal(0);
    expect(series[0][0][0]).to.equal(-10);
    expect(series[0][1][1]).to.equal(0);
    expect(series[0][1][0]).to.equal(-20);
    // Second series stacks below first
    expect(series[1][0][1]).to.equal(-10);
    expect(series[1][0][0]).to.equal(-15);
    expect(series[1][1][1]).to.equal(-20);
    expect(series[1][1][0]).to.equal(-35);
  });
  it('should handle mixed positive and negative values', () => {
    const series = generateSeries([
      [10, -20],
      [-5, 15],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First point: A=10 (positive), B=-5 (negative)
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[1][0][1]).to.equal(0);
    expect(series[1][0][0]).to.equal(-5);
    // Second point: A=-20 (negative), B=15 (positive)
    expect(series[0][1][1]).to.equal(0);
    expect(series[0][1][0]).to.equal(-20);
    expect(series[1][1][0]).to.equal(0);
    expect(series[1][1][1]).to.equal(15);
  });
  it('should handle zero values with positive original data', () => {
    const series = generateSeries([
      [10, 1],
      [5, 0],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First point: A=10, B=5
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[1][0][0]).to.equal(10);
    expect(series[1][0][1]).to.equal(15);
    // Second point: A=1, B=0 (with positive original data 0 > 0 is false, so uses 0,0)
    expect(series[0][1][0]).to.equal(0);
    expect(series[0][1][1]).to.equal(1);
    // B has original value 0 which equals 0, so falls through to else case
    expect(series[1][1][0]).to.equal(0);
    expect(series[1][1][1]).to.equal(0);
  });
  it('should handle zero values with negative original data', () => {
    const series = generateSeries([
      [-10, -1],
      [-5, 0],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First point: A=-10, B=-5
    expect(series[0][0][1]).to.equal(0);
    expect(series[0][0][0]).to.equal(-10);
    expect(series[1][0][1]).to.equal(-10);
    expect(series[1][0][0]).to.equal(-15);
    // Second point: A=-1, B=0 (with 0 original data, falls through to else)
    expect(series[0][1][1]).to.equal(0);
    expect(series[0][1][0]).to.equal(-1);
    expect(series[1][1][0]).to.equal(0);
    expect(series[1][1][1]).to.equal(0);
  });
  it('should handle zero values with zero original data', () => {
    const series = generateSeries([[10, 0]]);
    const order = [0];
    offsetDiverging(series, order);
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[0][1][0]).to.equal(0);
    expect(series[0][1][1]).to.equal(0);
  });
  it('should respect custom order', () => {
    const series = generateSeries([
      [10, 20],
      [5, 15],
    ]);

    const order = [1, 0]; // Reverse order
    offsetDiverging(series, order);
    // First series (B) starts at 0
    expect(series[1][0][0]).to.equal(0);
    expect(series[1][0][1]).to.equal(5);
    expect(series[1][1][0]).to.equal(0);
    expect(series[1][1][1]).to.equal(15);
    // Second series (A) stacks on top
    expect(series[0][0][0]).to.equal(5);
    expect(series[0][0][1]).to.equal(15);
    expect(series[0][1][0]).to.equal(15);
    expect(series[0][1][1]).to.equal(35);
  });
  it('should handle single series', () => {
    const series = generateSeries([[10, -5, 15]]);
    const order = [0];
    offsetDiverging(series, order);
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[0][1][1]).to.equal(0);
    expect(series[0][1][0]).to.equal(-5);
    expect(series[0][2][0]).to.equal(0);
    expect(series[0][2][1]).to.equal(15);
  });
  it('should handle multiple series with complex stacking', () => {
    const series = generateSeries([
      [10, -10, 5],
      [5, 10, -5],
      [-5, 5, 10],
    ]);
    const order = [0, 1, 2];
    offsetDiverging(series, order);
    // Point 0: A=10+, B=5+, C=-5
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    expect(series[1][0][0]).to.equal(10);
    expect(series[1][0][1]).to.equal(15);
    expect(series[2][0][1]).to.equal(0);
    expect(series[2][0][0]).to.equal(-5);
    // Point 1: A=-10, B=10+, C=5+
    expect(series[0][1][1]).to.equal(0);
    expect(series[0][1][0]).to.equal(-10);
    expect(series[1][1][0]).to.equal(0);
    expect(series[1][1][1]).to.equal(10);
    expect(series[2][1][0]).to.equal(10);
    expect(series[2][1][1]).to.equal(15);
    // Point 2: A=5+, B=-5, C=10+
    expect(series[0][2][0]).to.equal(0);
    expect(series[0][2][1]).to.equal(5);
    expect(series[1][2][1]).to.equal(0);
    expect(series[1][2][0]).to.equal(-5);
    expect(series[2][2][0]).to.equal(5);
    expect(series[2][2][1]).to.equal(15);
  });
  it('should handle null values in series', () => {
    const series = generateSeries([
      [10, null, 5],
      [null, 15, -5],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // Point 0: A=10, B=null (difference=0)
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    // B has null, difference = null - 0 = NaN, which is treated as 0
    expect(series[1][0][0]).to.be.a('number');
    expect(series[1][0][1]).to.be.a('number');
    // Point 1: A=null (difference=0), B=15
    expect(series[0][1][0]).to.be.a('number');
    expect(series[0][1][1]).to.be.a('number');
    expect(series[1][1][0]).to.be.a('number');
    expect(series[1][1][1]).to.be.a('number');
    // Point 2: A=5, B=-5
    expect(series[0][2][0]).to.be.a('number');
    expect(series[0][2][1]).to.be.a('number');
    expect(series[1][2][1]).to.be.a('number');
    expect(series[1][2][0]).to.be.a('number');
  });
  it('should handle null values without breaking stacking order', () => {
    const series = generateSeries([
      [10, 20],
      [null, 5],
    ]);
    const order = [0, 1];
    offsetDiverging(series, order);
    // First point: A=10, B=null
    expect(series[0][0][0]).to.equal(0);
    expect(series[0][0][1]).to.equal(10);
    // Second point: A=20, B=5
    expect(series[0][1][0]).to.equal(0);
    expect(series[0][1][1]).to.equal(20);
    expect(series[1][1][0]).to.equal(20);
    expect(series[1][1][1]).to.equal(25);
  });
  it('should handle differently when computed data is 0 but dataset is not', () => {
    const series = generateSeries(
      [
        [10, 20],
        [5, 30],
        [10, 10],
      ],
      [
        [0, 0],
        [undefined, undefined],
        [undefined, undefined],
      ],
    );
    const order = [2, 0, 1];
    offsetDiverging(series, order);

    // First point: A=10, B=5
    expect(series[2][0][0]).to.equal(0);
    expect(series[2][0][1]).to.equal(10);
    expect(series[0][0][0]).to.equal(10);
    expect(series[0][0][1]).to.equal(10);
    expect(series[1][0][0]).to.equal(10);
    expect(series[1][0][1]).to.equal(15);
    // Second point: A=20, B=30
    expect(series[2][1][0]).to.equal(0);
    expect(series[2][1][1]).to.equal(10);
    expect(series[0][1][0]).to.equal(10);
    expect(series[0][1][1]).to.equal(10);
    expect(series[1][1][0]).to.equal(10);
    expect(series[1][1][1]).to.equal(40);
  });
});
