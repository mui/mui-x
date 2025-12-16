import { expect } from 'vitest';
import { orderAscending } from './orderAscending';

describe('orderAscending', () => {
  it('should order by ascending sum', () => {
    const series: any = [
      [
        { data: { A: 10 }, 0: 0, 1: 10 },
        { data: { A: 20 }, 0: 0, 1: 20 },
      ],
      [
        { data: { B: 5 }, 0: 0, 1: 5 },
        { data: { B: 5 }, 0: 0, 1: 5 },
      ],
      [
        { data: { C: 15 }, 0: 0, 1: 15 },
        { data: { C: 20 }, 0: 0, 1: 20 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';
    series[2].key = 'C';

    const result = orderAscending(series);
    // Series B (sum=10), Series A (sum=30), Series C (sum=35)
    expect(result).to.deep.equal([1, 0, 2]);
  });

  it('should handle negative values', () => {
    const series: any = [
      [
        { data: { A: -10 }, 0: 0, 1: -10 },
        { data: { A: 20 }, 0: 0, 1: 20 },
      ],
      [
        { data: { B: 5 }, 0: 0, 1: 5 },
        { data: { B: 5 }, 0: 0, 1: 5 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';

    const result = orderAscending(series);
    // Series A (sum=10), Series B (sum=10) - stable sort
    expect(result).to.deep.equal([0, 1]);
  });

  it('should handle null values in sum calculation', () => {
    const series: any = [
      [
        { data: { A: 10 }, 0: 0, 1: 10 },
        { data: { A: null }, 0: 0, 1: null },
        { data: { A: 20 }, 0: 0, 1: 20 },
      ],
      [
        { data: { B: 5 }, 0: 0, 1: 5 },
        { data: { B: 15 }, 0: 0, 1: 15 },
      ],
      [
        { data: { C: null }, 0: 0, 1: null },
        { data: { C: 40 }, 0: 0, 1: 40 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';
    series[2].key = 'C';

    const result = orderAscending(series);
    // Series B (sum=20), Series A (sum=30 with null ignored), Series C (sum=40 with null ignored)
    expect(result).to.deep.equal([1, 0, 2]);
  });
});
