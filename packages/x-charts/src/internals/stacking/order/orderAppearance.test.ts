import { expect } from 'vitest';
import { orderAppearance } from './orderAppearance';

describe('orderAppearance', () => {
  it('should order by earliest peak appearance', () => {
    const series: any = [
      [
        { data: { A: 1 }, 0: 0, 1: 1 },
        { data: { A: 5 }, 0: 0, 1: 5 },
        { data: { A: 2 }, 0: 0, 1: 2 },
      ],
      [
        { data: { B: 3 }, 0: 0, 1: 3 },
        { data: { B: 2 }, 0: 0, 1: 2 },
        { data: { B: 1 }, 0: 0, 1: 1 },
      ],
      [
        { data: { C: 2 }, 0: 0, 1: 2 },
        { data: { C: 1 }, 0: 0, 1: 1 },
        { data: { C: 4 }, 0: 0, 1: 4 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';
    series[2].key = 'C';

    const result = orderAppearance(series);
    // Series B peaks at index 0, Series A peaks at index 1, Series C peaks at index 2
    expect(result).to.deep.equal([1, 0, 2]);
  });

  it('should handle zero values using data.key', () => {
    const series: any = [
      [
        { data: { A: 0 }, 0: 0, 1: 0 },
        { data: { A: 5 }, 0: 0, 1: 5 },
      ],
      [
        { data: { B: 10 }, 0: 0, 1: 10 },
        { data: { B: 0 }, 0: 0, 1: 0 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';

    const result = orderAppearance(series);
    // Series B peaks at index 0, Series A peaks at index 1
    expect(result).to.deep.equal([1, 0]);
  });

  it('should handle null values', () => {
    const series: any = [
      [
        { data: { A: null }, 0: 0, 1: null },
        { data: { A: 5 }, 0: 0, 1: 5 },
        { data: { A: 3 }, 0: 0, 1: 3 },
      ],
      [
        { data: { B: 10 }, 0: 0, 1: 10 },
        { data: { B: null }, 0: 0, 1: null },
        { data: { B: 2 }, 0: 0, 1: 2 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';

    const result = orderAppearance(series);
    // Series B peaks at index 0 (value=10), Series A peaks at index 1 (value=5)
    expect(result).to.deep.equal([1, 0]);
  });
});
