import { expect } from 'vitest';
import { stackOrderAscending as d3OrderAscending } from '@mui/x-charts-vendor/d3-shape';
import { orderAscending } from './orderAscending';
import { generateSeries } from './test.helper';

describe('orderAscending', () => {
  it('should order by ascending sum', () => {
    const series = generateSeries([
      [10, 5],
      [20, 10],
      [5, 15],
      [8, 2],
    ]);

    const result = orderAscending(series);
    const d3Result = d3OrderAscending(series);

    // Series 3 (sum=10), Series 0 (sum=15), Series 2 (sum=20), Series 1 (sum=30)
    expect(result).to.deep.equal([3, 0, 2, 1]);
    expect(d3Result).to.deep.equal(result);
  });

  it('should handle empty series', () => {
    const series: any = [];
    const result = orderAscending(series);
    expect(result).to.deep.equal([]);
  });

  it('should handle single series', () => {
    const series = generateSeries([[10, 5]]);
    const result = orderAscending(series);
    expect(result).to.deep.equal([0]);
  });

  it('should handle null values', () => {
    const series = generateSeries([
      [10, null, 5],
      [20, 10, null],
      [null, 15, 5],
    ]);

    const result = orderAscending(series);
    const d3Result = d3OrderAscending(series);

    // Series 0 (sum=15), Series 2 (sum=20), Series 1 (sum=30)
    expect(result).toStrictEqual([0, 2, 1]);
    expect(d3Result).to.deep.equal(result);
  });

  it('should handle series where d3 would change output based on zeros', () => {
    const series = generateSeries(
      [
        [10, 10],
        [5, 20],
      ],
      [
        [0, undefined],
        [undefined, 0],
      ],
    );

    const result = orderAscending(series);
    const d3Result = d3OrderAscending(series);

    expect(result).to.deep.equal([0, 1]);
    expect(d3Result).to.deep.equal([1, 0]);
    expect(result).not.to.deep.equal(d3Result);
  });
});
