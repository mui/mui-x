import { describe, expect, it } from 'vitest';
import type { GridColDef, GridPivotModel } from '@mui/x-data-grid-premium';
import { buildChartParamsFromPivot } from './pivotViewType';

const columns: GridColDef[] = [
  { field: 'region' },
  { field: 'orderDate', type: 'date' },
  { field: 'units', type: 'number' },
  { field: 'revenue', type: 'number' },
];

describe('buildChartParamsFromPivot', () => {
  it('maps the first row field → groupBy and each value → a metric series', () => {
    const model: GridPivotModel = {
      rows: [{ field: 'region' }],
      columns: [],
      values: [
        { field: 'units', aggFunc: 'sum' },
        { field: 'revenue', aggFunc: 'avg' },
      ],
    } as GridPivotModel;
    const { summary } = buildChartParamsFromPivot(model, columns) as any;
    expect(summary.groupBy).toBe('region');
    expect(summary.metrics).toEqual([
      { agg: 'sum', field: 'units' },
      { agg: 'avg', field: 'revenue' },
    ]);
    expect(summary.chartType).toBe('column');
  });

  it("maps the pivot 'size' aggregation to a count metric", () => {
    const model: GridPivotModel = {
      rows: [{ field: 'region' }],
      columns: [],
      values: [{ field: 'units', aggFunc: 'size' }],
    } as GridPivotModel;
    const { summary } = buildChartParamsFromPivot(model, columns) as any;
    expect(summary.metrics).toEqual([{ agg: 'count', field: 'units' }]);
  });

  it('falls back to a count metric when the pivot has no values', () => {
    const model: GridPivotModel = {
      rows: [{ field: 'region' }],
      columns: [],
      values: [],
    } as GridPivotModel;
    const { summary } = buildChartParamsFromPivot(model, columns) as any;
    expect(summary.metrics).toEqual([{ agg: 'count', field: null }]);
  });

  it('defaults to a line chart when grouping by a date column', () => {
    const model: GridPivotModel = {
      rows: [{ field: 'orderDate' }],
      columns: [],
      values: [{ field: 'revenue', aggFunc: 'sum' }],
    } as GridPivotModel;
    const { summary } = buildChartParamsFromPivot(model, columns) as any;
    expect(summary.groupBy).toBe('orderDate');
    expect(summary.chartType).toBe('line');
  });
});
