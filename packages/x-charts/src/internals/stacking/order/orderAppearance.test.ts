import { expect } from 'vitest';
import { orderAppearance } from './orderAppearance';
import { generateSeries } from './test.helper';

describe('orderAppearance', () => {
  it('should order by earliest peaks', () => {
    const series = generateSeries([
      [10, 5],
      [20, 10],
      [5, 15],
      [8, 2],
    ]);

    const result = orderAppearance(series);

    // Series 0 (peak at index 0), Series 1 (peak at index 0), Series 2 (peak at index 1), Series 3 (peak at index 0)
    expect(result).to.deep.equal([0, 1, 3, 2]);
  });

  it('should handle empty series', () => {
    const series: any = [];
    const result = orderAppearance(series);
    expect(result).to.deep.equal([]);
  });

  it('should handle single series', () => {
    const series = generateSeries([[10, 5]]);
    const result = orderAppearance(series);
    expect(result).to.deep.equal([0]);
  });

  it('should handle null values', () => {
    const series = generateSeries([
      [10, null, 5],
      [20, 10, null],
      [null, 15, 5],
    ]);

    const result = orderAppearance(series);

    // Series 0 (peak at index 0), Series 1 (peak at index 0), Series 2 (peak at index 1)
    expect(result).to.deep.equal([0, 1, 2]);
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

    const result = orderAppearance(series);

    expect(result).to.deep.equal([0, 1]);
  });
});
