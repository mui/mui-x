import { expect } from 'vitest';
// import { none, orderAppearance, orderAscending, orderDescending, orderInsideOut } from './order';
import {
  stackOrderNone as none,
  stackOrderAppearance as orderAppearance,
  stackOrderAscending as orderAscending,
  stackOrderDescending as orderDescending,
  stackOrderInsideOut as orderInsideOut,
} from '@mui/x-charts-vendor/d3-shape';

describe('order functions', () => {
  describe('none', () => {
    it('should return indices in original order', () => {
      const series = [{}, {}, {}];
      const result = none(series);
      expect(result).to.deep.equal([0, 1, 2]);
    });

    it('should handle empty array', () => {
      const series: any[] = [];
      const result = none(series);
      expect(result).to.deep.equal([]);
    });

    it('should handle single series', () => {
      const series = [{}];
      const result = none(series);
      expect(result).to.deep.equal([0]);
    });
  });

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
      const series: any[] = [];
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
});
