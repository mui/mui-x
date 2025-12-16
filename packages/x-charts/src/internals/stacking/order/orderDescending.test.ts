import { expect } from 'vitest';
import { orderDescending } from './orderDescending';

describe('orderDescending', () => {
  it('should order by descending sum', () => {
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

    const result = orderDescending(series);
    // Reverse of ascending: Series C (sum=35), Series A (sum=30), Series B (sum=10)
    expect(result).to.deep.equal([2, 0, 1]);
  });
});
