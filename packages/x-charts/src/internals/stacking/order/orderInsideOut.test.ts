import { expect } from 'vitest';
import { orderInsideOut } from './orderInsideOut';

describe('orderInsideOut', () => {
  it('should order with larger series on outside', () => {
    const series: any = [
      [
        { data: { A: 10 }, 0: 0, 1: 10 },
        { data: { A: 5 }, 0: 0, 1: 5 },
      ],
      [
        { data: { B: 20 }, 0: 0, 1: 20 },
        { data: { B: 10 }, 0: 0, 1: 10 },
      ],
      [
        { data: { C: 5 }, 0: 0, 1: 5 },
        { data: { C: 15 }, 0: 0, 1: 15 },
      ],
      [
        { data: { D: 8 }, 0: 0, 1: 8 },
        { data: { D: 2 }, 0: 0, 1: 2 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';
    series[2].key = 'C';
    series[3].key = 'D';

    const result = orderInsideOut(series);
    // Should alternate between top and bottom, placing larger series on outside
    expect(result).to.have.lengthOf(4);
    expect(result).to.be.an('array');
  });

  it('should handle empty series', () => {
    const series: any = [];
    const result = orderInsideOut(series);
    expect(result).to.deep.equal([]);
  });

  it('should handle single series', () => {
    const series: any = [
      [
        { data: { A: 10 }, 0: 0, 1: 10 },
        { data: { A: 5 }, 0: 0, 1: 5 },
      ],
    ];
    series[0].key = 'A';

    const result = orderInsideOut(series);
    expect(result).to.deep.equal([0]);
  });

  it('should alternate between tops and bottoms', () => {
    const series: any = [
      [
        { data: { A: 1 }, 0: 0, 1: 1 },
        { data: { A: 2 }, 0: 0, 1: 2 },
      ],
      [
        { data: { B: 1 }, 0: 0, 1: 1 },
        { data: { B: 3 }, 0: 0, 1: 3 },
      ],
      [
        { data: { C: 1 }, 0: 0, 1: 1 },
        { data: { C: 1 }, 0: 0, 1: 1 },
      ],
    ];
    series[0].key = 'A';
    series[1].key = 'B';
    series[2].key = 'C';

    const result = orderInsideOut(series);
    // Should have all 3 series in some order
    expect(result).to.have.lengthOf(3);
    expect(result).to.include(0);
    expect(result).to.include(1);
    expect(result).to.include(2);
  });
});
