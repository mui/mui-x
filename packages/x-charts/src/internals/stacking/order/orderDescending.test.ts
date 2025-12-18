import { expect } from 'vitest';
import { orderDescending } from './orderDescending';
import { generateSeries } from './test.helper';

describe('orderDescending', () => {
  it('should order by descending sum', () => {
    const series = generateSeries([
      [10, 5],
      [20, 10],
      [5, 15],
      [8, 2],
    ]);

    const result = orderDescending(series);

    // Series 1 (sum=30), Series 2 (sum=20), Series 0 (sum=15), Series 3 (sum=10)
    expect(result).to.deep.equal([1, 2, 0, 3]);
  });

  it('should handle empty series', () => {
    const series: any = [];
    const result = orderDescending(series);
    expect(result).to.deep.equal([]);
  });

  it('should handle single series', () => {
    const series = generateSeries([[10, 5]]);
    const result = orderDescending(series);
    expect(result).to.deep.equal([0]);
  });

  it('should handle null values', () => {
    const series = generateSeries([
      [10, null, 5],
      [20, 10, null],
      [null, 15, 5],
    ]);

    const result = orderDescending(series);

    // Series 1 (sum=30), Series 2 (sum=20), Series 0 (sum=15)
    expect(result).to.deep.equal([1, 2, 0]);
  });

  it('should handle series where d3 would change output based on zeros', () => {
    const series = generateSeries(
      [
        [20, 5],
        [10, 10],
      ],
      [
        [0, undefined],
        [undefined, 0],
      ],
    );

    const result = orderDescending(series);

    expect(result).to.deep.equal([0, 1]);
  });
});
