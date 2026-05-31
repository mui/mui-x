import { describe, expect, it } from 'vitest';
import { applyTransform } from './applyTransform';
import type { TransformSpec } from './types';

const SALES = [
  { region: 'North', channel: 'web', revenue: 100, orders: 3 },
  { region: 'North', channel: 'store', revenue: 50, orders: 1 },
  { region: 'South', channel: 'web', revenue: 200, orders: 4 },
  { region: 'South', channel: 'store', revenue: null, orders: 2 },
  { region: 'East', channel: 'web', revenue: 30, orders: 1 },
  { region: 'West', channel: 'web', revenue: 10, orders: 1 },
];

describe('applyTransform', () => {
  it('returns the rows unchanged when there is no transform', () => {
    expect(applyTransform(SALES, undefined)).to.equal(SALES);
    expect(applyTransform(SALES, {})).to.have.length(SALES.length);
  });

  describe('aggregation (group-by)', () => {
    it('sums a measure per group, collapsing rows', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
      };
      const result = applyTransform(SALES, transform);
      // 4 distinct regions, in first-seen order
      expect(result.map((r) => r.region)).to.deep.equal(['North', 'South', 'East', 'West']);
      expect(result.map((r) => r.revenue)).to.deep.equal([150, 200, 30, 10]);
    });

    it('counts non-null values for the count reducer', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'count', orders: 'count' } },
      };
      const result = applyTransform(SALES, transform);
      const south = result.find((r) => r.region === 'South');
      // South has revenue [200, null] -> 1 non-null; orders [4, 2] -> 2
      expect(south?.revenue).to.equal(1);
      expect(south?.orders).to.equal(2);
    });

    it('returns null (not 0) for avg/min/max of an all-null group', () => {
      const rows = [
        { k: 'a', v: null },
        { k: 'a', v: null },
      ];
      const avg = applyTransform(rows, { aggregation: { groupBy: ['k'], measures: { v: 'avg' } } });
      const min = applyTransform(rows, { aggregation: { groupBy: ['k'], measures: { v: 'min' } } });
      const sum = applyTransform(rows, { aggregation: { groupBy: ['k'], measures: { v: 'sum' } } });
      expect(avg[0].v).to.equal(null);
      expect(min[0].v).to.equal(null);
      // sum of an empty set is 0 by convention
      expect(sum[0].v).to.equal(0);
    });

    it('computes avg over non-null members only', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'avg' } },
      };
      const result = applyTransform(SALES, transform);
      const south = result.find((r) => r.region === 'South');
      // South revenue [200, null] -> avg over 1 value = 200
      expect(south?.revenue).to.equal(200);
    });

    it('groups by multiple fields', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region', 'channel'], measures: { revenue: 'sum' } },
      };
      const result = applyTransform(SALES, transform);
      // North/web, North/store, South/web, South/store, East/web, West/web
      expect(result).to.have.length(6);
    });
  });

  describe('topN', () => {
    it('keeps the n largest by measure, descending', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
        topN: { measure: 'revenue', n: 2 },
      };
      const result = applyTransform(SALES, transform);
      expect(result.map((r) => r.region)).to.deep.equal(['South', 'North']);
    });

    it('buckets the remainder into an Other row when otherBucket is set', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
        topN: { measure: 'revenue', n: 2, otherBucket: true },
      };
      const result = applyTransform(SALES, transform);
      expect(result.map((r) => r.region)).to.deep.equal(['South', 'North', 'Other']);
      // Other = East(30) + West(10)
      expect(result[2].revenue).to.equal(40);
    });

    it('returns all rows untouched when n exceeds the row count', () => {
      const transform: TransformSpec = {
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
        topN: { measure: 'revenue', n: 99, otherBucket: true },
      };
      const result = applyTransform(SALES, transform);
      expect(result).to.have.length(4);
      expect(result.some((r) => r.region === 'Other')).to.equal(false);
    });
  });

  describe('filter', () => {
    it('keeps rows matching an eq filter', () => {
      const result = applyTransform(SALES, {
        filter: [{ field: 'channel', op: 'eq', value: 'web' }],
      });
      expect(result).to.have.length(4);
      expect(result.every((r) => r.channel === 'web')).to.equal(true);
    });

    it('excludes rows with neq', () => {
      const result = applyTransform(SALES, {
        filter: [{ field: 'channel', op: 'neq', value: 'web' }],
      });
      expect(result.every((r) => r.channel === 'store')).to.equal(true);
    });

    it('supports gt / between / in', () => {
      expect(
        applyTransform(SALES, { filter: [{ field: 'revenue', op: 'gt', value: 100 }] }),
      ).to.have.length(1);
      expect(
        applyTransform(SALES, { filter: [{ field: 'orders', op: 'between', value: [2, 4] }] }).length,
      ).to.equal(3);
      expect(
        applyTransform(SALES, { filter: [{ field: 'region', op: 'in', value: ['East', 'West'] }] }),
      ).to.have.length(2);
    });

    it('combines multiple filters with AND', () => {
      const result = applyTransform(SALES, {
        filter: [
          { field: 'channel', op: 'eq', value: 'web' },
          { field: 'revenue', op: 'gt', value: 50 },
        ],
      });
      expect(result.map((r) => r.region)).to.deep.equal(['North', 'South']);
    });
  });

  describe('dateWindow', () => {
    const TS = [
      { day: '2024-01-01', v: 1 },
      { day: '2024-03-01', v: 2 },
      { day: '2024-05-15', v: 3 },
      { day: '2024-06-01', v: 4 }, // max date
    ];

    it('keeps rows within the window measured from the max date', () => {
      // last 3 months from 2024-06-01 -> >= 2024-03-01
      const result = applyTransform(TS, { dateWindow: { field: 'day', last: '3M' } });
      expect(result.map((r) => r.v)).to.deep.equal([2, 3, 4]);
    });

    it('is independent of the wall clock (relative to data max)', () => {
      const result = applyTransform(TS, { dateWindow: { field: 'day', last: '1M' } });
      // >= 2024-05-01
      expect(result.map((r) => r.v)).to.deep.equal([3, 4]);
    });

    it('returns rows unchanged for an unparseable window', () => {
      expect(applyTransform(TS, { dateWindow: { field: 'day', last: 'soon' } })).to.have.length(4);
    });
  });

  describe('pipeline order', () => {
    it('filters before aggregating before topN', () => {
      const transform: TransformSpec = {
        filter: [{ field: 'channel', op: 'eq', value: 'web' }],
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
        topN: { measure: 'revenue', n: 2, otherBucket: true },
      };
      const result = applyTransform(SALES, transform);
      // web only: South 200, North 100, East 30, West 10 -> top2 + Other(40)
      expect(result.map((r) => r.region)).to.deep.equal(['South', 'North', 'Other']);
      expect(result.map((r) => r.revenue)).to.deep.equal([200, 100, 40]);
    });

    it('does not mutate the input rows', () => {
      const snapshot = JSON.stringify(SALES);
      applyTransform(SALES, {
        filter: [{ field: 'channel', op: 'eq', value: 'web' }],
        aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } },
        topN: { measure: 'revenue', n: 1 },
      });
      expect(JSON.stringify(SALES)).to.equal(snapshot);
    });
  });
});
