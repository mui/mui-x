import { expect } from 'vitest';
import { orderInsideOut } from './orderInsideOut';
import { generateSeries } from './test.helper';

describe('orderInsideOut', () => {
  it('should order with larger series on inside', () => {
    const series = generateSeries([
      [10, 5],
      [20, 10],
      [5, 15],
      [8, 2],
    ]);

    const result = orderInsideOut(series);

    // Series 2 (sum=20), Series 3 (sum=10), Series 0 (sum=15), Series 1 (sum=30)
    expect(result).to.deep.equal([2, 3, 0, 1]);
  });

  it('should handle empty series', () => {
    const series: any = [];
    const result = orderInsideOut(series);
    expect(result).to.deep.equal([]);
  });

  it('should handle single series', () => {
    const series = generateSeries([[10, 5]]);
    const result = orderInsideOut(series);
    expect(result).to.deep.equal([0]);
  });

  it('should handle null values', () => {
    const series = generateSeries([
      [10, null, 5],
      [20, 10, null],
      [null, 15, 5],
    ]);

    const result = orderInsideOut(series);

    expect(result).to.deep.equal([2, 0, 1]);
  });

  it('should handle series where d3 would change output based on zeros', () => {
    const series = generateSeries(
      [
        [10, 5],
        [10, 10],
      ],
      [
        [0, undefined],
        [undefined, 0],
      ],
    );

    const result = orderInsideOut(series);

    expect(result).to.deep.equal([0, 1]);
  });
});
