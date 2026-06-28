/* eslint-disable testing-library/render-result-naming-convention --
   `resolveForRenderer` is a pure state-to-props mapper, not an RTL render. */
import { describe, it, expect } from 'vitest';
import type { ChartCopilotState } from './chartState';
import type { ChartCopilotDataset } from './resolveForRenderer';
import { resolveForRenderer } from './resolveForRenderer';

const DATASET: ChartCopilotDataset = {
  id: 'sales',
  columns: [
    { field: 'region', headerName: 'Region', type: 'string' },
    { field: 'revenue', headerName: 'Revenue', type: 'number' },
  ],
  rows: [
    { region: 'North', revenue: 100 },
    { region: 'South', revenue: '200' },
    { region: 'East', revenue: null },
  ],
};

describe('resolveForRenderer', () => {
  it('resolves dimensions and values into RenderedItems with labels and numeric coercion', () => {
    const state: ChartCopilotState = {
      type: 'column',
      dimensions: [{ field: 'region' }],
      values: [{ field: 'revenue' }],
      configuration: { borderRadius: 4 },
    };

    const output = resolveForRenderer(state, DATASET);

    expect(output.chartType).toBe('column');
    expect(output.configuration).toEqual({ borderRadius: 4 });

    expect(output.dimensions).toEqual([
      { id: 'region', label: 'Region', data: ['North', 'South', 'East'] },
    ]);

    // '200' coerced to 200, null preserved as null.
    expect(output.values).toEqual([
      { id: 'revenue', label: 'Revenue', data: [100, 200, null] },
    ]);
  });

  it('prefers an explicit item label over the column headerName', () => {
    const state: ChartCopilotState = {
      type: 'bar',
      dimensions: [{ field: 'region', label: 'Sales Region' }],
      values: [{ field: 'revenue' }],
      configuration: {},
    };

    const output = resolveForRenderer(state, DATASET);
    expect(output.dimensions[0].label).toBe('Sales Region');
  });

  it('falls back to the field name when neither label nor headerName exists', () => {
    const dataset: ChartCopilotDataset = {
      id: 'd',
      columns: [{ field: 'revenue', type: 'number' }],
      rows: [{ revenue: 1 }],
    };
    const state: ChartCopilotState = {
      type: 'bar',
      dimensions: [],
      values: [{ field: 'revenue' }],
      configuration: {},
    };
    const output = resolveForRenderer(state, dataset);
    expect(output.values[0].label).toBe('revenue');
  });

  it('aggregates rows via the /transform slice before mapping to series', () => {
    const dataset: ChartCopilotDataset = {
      id: 'sales',
      columns: [
        { field: 'region', headerName: 'Region', type: 'string' },
        { field: 'revenue', headerName: 'Revenue', type: 'number' },
      ],
      rows: [
        { region: 'North', revenue: 100 },
        { region: 'North', revenue: 50 },
        { region: 'South', revenue: 200 },
      ],
    };
    const state: ChartCopilotState = {
      type: 'bar',
      dimensions: [{ field: 'region' }],
      values: [{ field: 'revenue' }],
      configuration: {},
      transform: { aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } } },
    };

    const output = resolveForRenderer(state, dataset);
    // 3 rows collapse to 2 regions; North summed to 150.
    expect(output.dimensions[0].data).toEqual(['North', 'South']);
    expect(output.values[0].data).toEqual([150, 200]);
  });

  it('excludes hidden items from the resolved output', () => {
    const state: ChartCopilotState = {
      type: 'column',
      dimensions: [{ field: 'region' }],
      values: [
        { field: 'revenue' },
        { field: 'revenue', label: 'Hidden', hidden: true },
      ],
      configuration: {},
    };
    const output = resolveForRenderer(state, DATASET);
    expect(output.values).toHaveLength(1);
    expect(output.values[0].label).toBe('Revenue');
  });
});
