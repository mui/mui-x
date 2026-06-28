import { describe, expect, it } from 'vitest';
import type { ChartCopilotState } from '../chartState';
import { EMPTY_CHART_COPILOT_STATE } from '../chartState';
import { classifyTurn } from './classifyTurn';
import { describeSpecDiff } from './describeSpecDiff';
import { buildStep, isRecordable, resetSteps, undoSteps } from './historyCore';
import type { HistoryStep } from './types';

const COLUMNS = [
  { field: 'region', headerName: 'Region' },
  { field: 'revenue', headerName: 'Revenue' },
  { field: 'month', headerName: 'Month' },
];

const base = (over: Partial<ChartCopilotState> = {}): ChartCopilotState => ({
  ...EMPTY_CHART_COPILOT_STATE,
  ...over,
});

describe('classifyTurn', () => {
  it('classifies creation from an empty spec as ask', () => {
    const before = base();
    const after = base({ type: 'bar', dimensions: [{ field: 'region' }], values: [{ field: 'revenue' }] });
    expect(classifyTurn(before, after, true)).to.equal('ask');
  });

  it('classifies an annotation/overlay change as annotate', () => {
    const before = base({ values: [{ field: 'revenue' }] });
    const after = base({
      values: [{ field: 'revenue' }],
      overlays: { o1: { id: 'o1', kind: 'sma', target: 'revenue', period: 7 } },
    });
    expect(classifyTurn(before, after, true)).to.equal('annotate');
  });

  it('classifies a type change as reshape', () => {
    const before = base({ type: 'bar', values: [{ field: 'revenue' }] });
    const after = base({ type: 'line', values: [{ field: 'revenue' }] });
    expect(classifyTurn(before, after, true)).to.equal('reshape');
  });

  it('classifies a dimension/grouping restructure as reshape', () => {
    const before = base({ values: [{ field: 'revenue' }], dimensions: [{ field: 'region' }] });
    const after = base({ values: [{ field: 'revenue' }], dimensions: [{ field: 'month' }] });
    expect(classifyTurn(before, after, true)).to.equal('reshape');
  });

  it('classifies a config-only change as refine', () => {
    const before = base({ values: [{ field: 'revenue' }], configuration: {} });
    const after = base({ values: [{ field: 'revenue' }], configuration: { stacked: true } });
    expect(classifyTurn(before, after, true)).to.equal('refine');
  });

  it('classifies a top-N change as refine', () => {
    const before = base({ values: [{ field: 'revenue' }] });
    const after = base({ values: [{ field: 'revenue' }], transform: { topN: { measure: 'revenue', n: 10 } } });
    expect(classifyTurn(before, after, true)).to.equal('refine');
  });

  it('classifies a no-patch narrative turn as explain', () => {
    const state = base({ values: [{ field: 'revenue' }] });
    expect(classifyTurn(state, state, false, 'Here is what the chart shows...')).to.equal('explain');
  });
});

describe('describeSpecDiff', () => {
  it('describes type, dimensions, values and aggregation with column labels', () => {
    const before = base();
    const after = base({
      type: 'line',
      dimensions: [{ field: 'region' }],
      values: [{ field: 'revenue' }],
      transform: { aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } } },
    });
    const labels = describeSpecDiff(before, after, COLUMNS).map((c) => c.label);
    expect(labels).to.include('Line');
    expect(labels).to.include('by Region');
    expect(labels).to.include('Revenue');
    expect(labels).to.include('Revenue summed by Region');
  });

  it('describes top-N, window and stacked config', () => {
    const before = base({ values: [{ field: 'revenue' }] });
    const after = base({
      values: [{ field: 'revenue' }],
      configuration: { stacked: true },
      transform: { topN: { measure: 'revenue', n: 10, otherBucket: true }, dateWindow: { field: 'month', last: '6M' } },
    });
    const labels = describeSpecDiff(before, after, COLUMNS).map((c) => c.label);
    expect(labels).to.include('Top 10 (+Other)');
    expect(labels).to.include('last 6 months');
    expect(labels).to.include('Stacked');
  });

  it('describes an overlay definition', () => {
    const before = base({ values: [{ field: 'revenue' }] });
    const after = base({
      values: [{ field: 'revenue' }],
      overlays: { o1: { id: 'o1', kind: 'sma', target: 'revenue', period: 7 } },
    });
    const labels = describeSpecDiff(before, after, COLUMNS).map((c) => c.label);
    expect(labels).to.include('SMA 7 of Revenue');
  });

  it('falls back to the field name without column metadata', () => {
    const before = base();
    const after = base({ values: [{ field: 'revenue' }] });
    const labels = describeSpecDiff(before, after).map((c) => c.label);
    expect(labels).to.include('revenue');
  });
});

describe('historyCore', () => {
  const before = base();
  const after = base({ type: 'bar', values: [{ field: 'revenue' }] });

  it('isRecordable only when a patch changed the spec', () => {
    expect(isRecordable(before, after, true)).to.equal(true);
    expect(isRecordable(before, after, false)).to.equal(false);
    expect(isRecordable(before, before, true)).to.equal(false);
  });

  it('buildStep classifies and describes the turn', () => {
    const step = buildStep({ before, after, hadPatches: true, seq: 1, messageId: 'm1', columns: COLUMNS });
    expect(step.id).to.equal('step-1');
    expect(step.feature).to.equal('ask');
    expect(step.messageId).to.equal('m1');
    expect(step.clauses.length).to.be.greaterThan(0);
  });

  const steps: HistoryStep[] = [
    buildStep({ before, after, hadPatches: true, seq: 1 }),
    buildStep({ before: after, after: base({ type: 'line', values: [{ field: 'revenue' }] }), hadPatches: true, seq: 2 }),
  ];

  it('undoSteps drops the target step and restores its before', () => {
    const result = undoSteps(steps);
    expect(result?.steps).to.have.length(1);
    expect(result?.restore).to.deep.equal(steps[1].before);
  });

  it('undoSteps to a specific id drops it and everything after', () => {
    const result = undoSteps(steps, 'step-1');
    expect(result?.steps).to.have.length(0);
    expect(result?.restore).to.deep.equal(steps[0].before);
  });

  it('resetSteps clears all and restores the first before', () => {
    const result = resetSteps(steps);
    expect(result?.steps).to.have.length(0);
    expect(result?.restore).to.deep.equal(steps[0].before);
  });

  it('returns null when there is nothing to undo/reset', () => {
    expect(undoSteps([])).to.equal(null);
    expect(resetSteps([])).to.equal(null);
  });
});
