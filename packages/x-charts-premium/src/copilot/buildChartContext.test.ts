import { describe, expect, it } from 'vitest';
import type { ChartCopilotState } from './chartState';
import type { ChartCopilotDataset } from './resolveForRenderer';
import { buildChartContext } from './buildChartContext';

const DATASET: ChartCopilotDataset = {
  id: 'beverage',
  columns: [
    { field: 'month', headerName: 'Month', type: 'string' },
    { field: 'coffee', headerName: 'Coffee', type: 'number' },
  ],
  rows: [
    { month: 'Jan', coffee: 100 },
    { month: 'Feb', coffee: 200 },
    { month: 'Mar', coffee: 300 },
  ],
};

const STATE: ChartCopilotState = {
  type: 'line',
  dimensions: [{ field: 'month' }],
  values: [{ field: 'coffee' }],
  configuration: {},
  label: 'Coffee over time',
};

describe('buildChartContext summary (Explain grounding)', () => {
  it('attaches a summary with categories and per-series stats from the resolved data', () => {
    const context = buildChartContext(STATE, DATASET) as any;
    expect(context.summary.categories).to.deep.equal(['Jan', 'Feb', 'Mar']);
    expect(context.summary.series).to.have.length(1);

    const series = context.summary.series[0];
    expect(series.id).to.equal('coffee');
    expect(series.label).to.equal('Coffee');
    expect(series.data).to.deep.equal([100, 200, 300]);
    // Stats are real client-computed numbers the model narrates from.
    expect(series.stats.total).to.equal(600);
    expect(series.stats.min).to.equal(100);
    expect(series.stats.max).to.equal(300);
    // 100 -> 300 is +200%.
    expect(series.stats.changePct).to.equal(200);
    expect(series.trend.fit).to.be.a('string');
  });

  it('reflects the transform layer (aggregation) in the summary', () => {
    const dataset: ChartCopilotDataset = {
      id: 'sales',
      columns: [
        { field: 'region', type: 'string' },
        { field: 'revenue', type: 'number' },
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
    const context = buildChartContext(state, dataset) as any;
    expect(context.summary.categories).to.deep.equal(['North', 'South']);
    expect(context.summary.series[0].data).to.deep.equal([150, 200]);
  });
});
