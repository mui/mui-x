import { describe, it, expect } from 'vitest';
import {
  buildCommandRegistry,
  buildPatchRegistry,
  makeExecutor,
  type Executor,
  type Guards,
} from '@mui/x-copilot';
import type { ChartCopilotState } from '../chartState';
import { EMPTY_CHART_COPILOT_STATE, snapshotState } from '../chartState';
import type { ChartsHostAdapter } from '../chartsHostAdapter';
import { createChartsHostAdapter } from '../chartsHostAdapter';
import type { ChartCopilotDataset } from '../resolveForRenderer';
import { buildChartGuards } from '../guards';
import { chartsCommandPack, chartsReconcilerPack } from '../chartsPacks';
import {
  chartConfigurationHandler,
  chartOverlayHandler,
  chartTransformHandler,
  chartTypeHandler,
  chartValuesHandler,
} from './index';

const DATASET: ChartCopilotDataset = {
  id: 'sales',
  columns: [
    { field: 'region', headerName: 'Region', type: 'string' },
    { field: 'revenue', headerName: 'Revenue', type: 'number' },
    { field: 'units', headerName: 'Units', type: 'number' },
  ],
  rows: [
    { region: 'North', revenue: 100, units: 3 },
    { region: 'South', revenue: 200, units: 5 },
  ],
};

interface TestExecutorBundle {
  executor: Executor;
  // The latest state committed via `setChartState`.
  getCommitted: () => ChartCopilotState | null;
  host: ChartsHostAdapter;
}

function createTestExecutor(options?: {
  initialState?: ChartCopilotState;
  dataset?: ChartCopilotDataset;
  guardOverrides?: Partial<ReturnType<typeof buildChartGuards>>;
}): TestExecutorBundle {
  let state: ChartCopilotState = options?.initialState
    ? snapshotState(options.initialState)
    : snapshotState(EMPTY_CHART_COPILOT_STATE);
  let committed: ChartCopilotState | null = null;
  const dataset = options?.dataset ?? DATASET;

  const guards: Guards = buildChartGuards(options?.guardOverrides);
  const host = createChartsHostAdapter({
    getState: () => state,
    setState: (next) => {
      state = next;
      committed = next;
    },
    getDataset: () => dataset,
  });

  const commandRegistry = buildCommandRegistry<ChartsHostAdapter, ChartCopilotState>(guards, [
    chartsCommandPack,
  ]);
  const patchRegistry = buildPatchRegistry<ChartsHostAdapter, ChartCopilotState>(guards, [
    chartsReconcilerPack,
  ]);
  const executor = makeExecutor<ChartsHostAdapter, ChartCopilotState>({
    adapter: host,
    guards,
    commandRegistry,
    patchRegistry,
  });

  return { executor, getCommitted: () => committed, host };
}

function envelope(ops: ReadonlyArray<{ op: string; path: string; value?: unknown }>) {
  return { setGridState: ops.map((o) => JSON.stringify(o)).join('\n') };
}

describe('Charts copilot reconcilers', () => {
  describe('/type', () => {
    it('applies a valid chart type and commits via setChartState', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/type', value: 'line' }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.type).toBe('line');
    });

    it('rejects an unrenderable chart type in validate()', () => {
      expect(chartTypeHandler.validate?.({ op: 'replace', path: '/type', value: 'scatter' }, EMPTY_CHART_COPILOT_STATE, {} as any)).toEqual({
        ok: false,
        reason: expect.stringContaining('not renderable'),
      });
    });

    it('skips an unrenderable type at the executor level', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/type', value: 'scatter' }]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('invalid');
      expect(getCommitted()).toBeNull();
    });
  });

  describe('/dimensions', () => {
    it('sets dimension fields that exist in the dataset', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/dimensions', value: [{ field: 'region' }] }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.dimensions).toEqual([{ field: 'region' }]);
    });

    it('rejects a dimension field that is not a dataset column', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/dimensions', value: [{ field: 'unknown' }] }]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('invalid');
      expect(getCommitted()).toBeNull();
    });
  });

  describe('/values', () => {
    it('sets numeric value fields', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/values', value: [{ field: 'revenue' }] }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.values).toEqual([{ field: 'revenue' }]);
    });

    it('rejects a non-numeric value field in validate()', () => {
      const docWithStringValue: ChartCopilotState = {
        ...snapshotState(EMPTY_CHART_COPILOT_STATE),
        values: [{ field: 'region' }],
      };
      const ctx = {
        adapter: { api: { getDataset: () => DATASET } },
      } as any;
      expect(
        chartValuesHandler.validate?.(
          { op: 'replace', path: '/values', value: [{ field: 'region' }] },
          docWithStringValue,
          ctx,
        ),
      ).toEqual({ ok: false, reason: expect.stringContaining('numeric') });
    });
  });

  describe('/label', () => {
    it('sets the chart label', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'add', path: '/label', value: 'Revenue by region' }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.label).toBe('Revenue by region');
    });
  });

  describe('/configuration/<key>', () => {
    it('updates a configuration entry for the current chart type', () => {
      const { executor, getCommitted } = createTestExecutor({
        initialState: { ...snapshotState(EMPTY_CHART_COPILOT_STATE), type: 'column' },
      });
      const result = executor.applyEnvelope(
        envelope([{ op: 'add', path: '/configuration/borderRadius', value: 4 }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.configuration).toEqual({ borderRadius: 4 });
    });

    it('rejects an unknown configuration key for the chart type in validate()', () => {
      const doc: ChartCopilotState = { ...snapshotState(EMPTY_CHART_COPILOT_STATE), type: 'column' };
      expect(
        chartConfigurationHandler.validate?.(
          { op: 'add', path: '/configuration/notARealKey', value: 1 },
          doc,
          {} as any,
        ),
      ).toEqual({ ok: false, reason: expect.stringContaining('not a known configuration key') });
    });
  });

  describe('/transform', () => {
    it('applies a whole aggregation slice and commits', () => {
      const { executor, getCommitted } = createTestExecutor();
      const transform = { aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } } };
      const result = executor.applyEnvelope(
        envelope([{ op: 'add', path: '/transform', value: transform }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.transform).toEqual(transform);
    });

    it('patches a single transform key when the slice already exists', () => {
      const { executor, getCommitted } = createTestExecutor({
        initialState: {
          ...snapshotState(EMPTY_CHART_COPILOT_STATE),
          transform: { aggregation: { groupBy: ['region'], measures: { revenue: 'sum' } } },
        },
      });
      const result = executor.applyEnvelope(
        envelope([{ op: 'add', path: '/transform/topN', value: { measure: 'revenue', n: 1 } }]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.transform?.topN).toEqual({ measure: 'revenue', n: 1 });
    });

    it('rejects an aggregation grouping by an unknown field', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([
          {
            op: 'add',
            path: '/transform',
            value: { aggregation: { groupBy: ['nope'], measures: { revenue: 'sum' } } },
          },
        ]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('invalid');
      expect(getCommitted()).toBeNull();
    });

    it('rejects a non-numeric measure for a numeric reducer in validate()', () => {
      const ctx = { adapter: { api: { getDataset: () => DATASET } } } as any;
      expect(
        chartTransformHandler.validate?.(
          {
            op: 'add',
            path: '/transform',
            value: { aggregation: { groupBy: ['region'], measures: { region: 'sum' } } },
          },
          snapshotState(EMPTY_CHART_COPILOT_STATE),
          ctx,
        ),
      ).toEqual({ ok: false, reason: expect.stringContaining('numeric') });
    });
  });

  describe('/annotations and /overlays', () => {
    it('adds a reference-line annotation', () => {
      const { executor, getCommitted } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([
          {
            op: 'add',
            path: '/annotations/target',
            value: { id: 'target', kind: 'refLine', axis: 'y', value: 150 },
          },
        ]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.annotations?.target).toEqual({
        id: 'target',
        kind: 'refLine',
        axis: 'y',
        value: 150,
      });
    });

    it('rejects an annotation with an unknown kind', () => {
      const { executor } = createTestExecutor();
      const result = executor.applyEnvelope(
        envelope([{ op: 'add', path: '/annotations/x', value: { id: 'x', kind: 'wat' } }]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('invalid');
    });

    it('adds an SMA overlay on a line chart', () => {
      const { executor, getCommitted } = createTestExecutor({
        initialState: {
          ...snapshotState(EMPTY_CHART_COPILOT_STATE),
          type: 'line',
          values: [{ field: 'revenue' }],
        },
      });
      const result = executor.applyEnvelope(
        envelope([
          {
            op: 'add',
            path: '/overlays/sma',
            value: { id: 'sma', kind: 'sma', target: 'revenue', period: 3 },
          },
        ]),
      );
      expect(result.applied).toHaveLength(1);
      expect(getCommitted()?.overlays?.sma?.kind).toBe('sma');
    });

    it('rejects an overlay on a non-line chart in validate()', () => {
      const doc: ChartCopilotState = {
        ...snapshotState(EMPTY_CHART_COPILOT_STATE),
        type: 'bar',
      };
      const ctx = { adapter: { api: { getDataset: () => DATASET } } } as any;
      expect(
        chartOverlayHandler.validate?.(
          { op: 'add', path: '/overlays/sma', value: { id: 'sma', kind: 'sma', target: 'revenue' } },
          doc,
          ctx,
        ),
      ).toEqual({ ok: false, reason: expect.stringContaining('line and area') });
    });

    it('rejects an overlay whose target is not numeric', () => {
      const doc: ChartCopilotState = {
        ...snapshotState(EMPTY_CHART_COPILOT_STATE),
        type: 'line',
      };
      const ctx = { adapter: { api: { getDataset: () => DATASET } } } as any;
      expect(
        chartOverlayHandler.validate?.(
          { op: 'add', path: '/overlays/x', value: { id: 'x', kind: 'sma', target: 'region' } },
          doc,
          ctx,
        ),
      ).toEqual({ ok: false, reason: expect.stringContaining('numeric') });
    });
  });

  describe('annotate guard', () => {
    it('removes the annotation/overlay handlers when disabled', () => {
      const { executor, getCommitted } = createTestExecutor({
        guardOverrides: { annotate: false },
      });
      const result = executor.applyEnvelope(
        envelope([
          { op: 'add', path: '/annotations/x', value: { id: 'x', kind: 'refLine', value: 1 } },
        ]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('unknown');
      expect(getCommitted()).toBeNull();
    });
  });

  describe('chartsIntegration guard', () => {
    it('removes the chart-shaping handlers when disabled', () => {
      const { executor, getCommitted } = createTestExecutor({
        guardOverrides: { chartsIntegration: false },
      });
      const result = executor.applyEnvelope(
        envelope([{ op: 'replace', path: '/type', value: 'line' }]),
      );
      expect(result.applied).toHaveLength(0);
      expect(result.skipped[0].reason).toBe('unknown');
      expect(getCommitted()).toBeNull();
    });
  });
});
