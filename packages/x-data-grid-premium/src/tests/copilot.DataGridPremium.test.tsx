import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { act, createRenderer, fireEvent, screen, waitFor } from '@mui/internal-test-utils';
import type { ChatAdapter, ChatMessageChunk, ChatStreamEnvelope } from '@mui/x-chat-headless';
import {
  DataGridPremium,
  GridSidebarValue,
  createGridCopilotLocalStorageAdapter,
  type DataGridPremiumProps,
  type GridApi,
  type GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid-premium';
import {
  copilotToolInputToAppliedEntries,
  entryToChanges,
} from '../components/copilotPanel/CopilotAppliedChanges';

const ROWS = [
  { id: 1, country: 'FR', position: 'Engineer', salary: 100 },
  { id: 2, country: 'FR', position: 'Manager', salary: 120 },
  { id: 3, country: 'US', position: 'Engineer', salary: 110 },
  { id: 4, country: 'US', position: 'Manager', salary: 130 },
];

const COLUMNS: GridColDef[] = [
  { field: 'id', type: 'number' },
  { field: 'country', groupable: true },
  { field: 'position', groupable: true },
  { field: 'salary', type: 'number', aggregable: true },
];

const PIVOT_MODEL_PATCH = JSON.stringify({
  op: 'replace',
  path: '/pivot/model',
  value: {
    rows: [{ field: 'country' }],
    columns: [{ field: 'position' }],
    values: [{ field: 'salary', aggFunc: 'avg' }],
  },
});

const EMPTY_PIVOT_MODEL_PATCH = JSON.stringify({
  op: 'replace',
  path: '/pivot/model',
  value: { rows: [], columns: [], values: [] },
});

const PIVOT_ACTIVE_FALSE_PATCH = JSON.stringify({
  op: 'replace',
  path: '/pivot/active',
  value: false,
});

const PIVOT_ACTIVE_TRUE_PATCH = JSON.stringify({
  op: 'replace',
  path: '/pivot/active',
  value: true,
});

const WHOLE_PIVOT_INACTIVE_PATCH = JSON.stringify({
  op: 'replace',
  path: '/pivot',
  value: {
    active: false,
    model: {
      rows: [{ field: 'country' }],
      columns: [],
      values: [{ field: 'salary', aggFunc: 'avg' }],
    },
  },
});

function isPivotActive(apiRef: RefObject<GridApi | null>): boolean {
  return Boolean((apiRef.current as any)?.state?.pivoting?.active);
}

function createAssistantDoneStream(
  messageId: string,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      controller.enqueue({ type: 'start', messageId });
      controller.enqueue({ type: 'finish', messageId, finishReason: 'stop' });
      controller.close();
    },
  });
}

function createAssistantTextStream(
  messageId: string,
  text: string,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      controller.enqueue({ type: 'start', messageId });
      controller.enqueue({ type: 'text-start', id: `${messageId}-text` });
      controller.enqueue({ type: 'text-delta', id: `${messageId}-text`, delta: text });
      controller.enqueue({ type: 'text-end', id: `${messageId}-text` });
      controller.enqueue({ type: 'finish', messageId, finishReason: 'stop' });
      controller.close();
    },
  });
}

function createAssistantSetGridStateStream(
  messageId: string,
  patchesJsonl: string,
): ReadableStream<ChatMessageChunk | ChatStreamEnvelope> {
  const toolCallId = `${messageId}-set-grid-state`;
  return new ReadableStream<ChatMessageChunk | ChatStreamEnvelope>({
    start(controller) {
      controller.enqueue({ type: 'start', messageId });
      controller.enqueue({
        type: 'tool-input-start',
        toolCallId,
        toolName: 'setGridState',
      } as ChatMessageChunk);
      controller.enqueue({
        type: 'tool-input-available',
        toolCallId,
        toolName: 'setGridState',
        input: { patches: patchesJsonl },
      } as ChatMessageChunk);
      controller.enqueue({ type: 'finish', messageId, finishReason: 'stop' });
      controller.close();
    },
  });
}

describe('<DataGridPremium /> - Copilot pivot auto-activation', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps> = {}) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium rows={ROWS} columns={COLUMNS} apiRef={apiRef} copilot {...props} />
      </div>
    );
  }

  it('auto-activates pivoting when only /pivot/model is patched', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: PIVOT_MODEL_PATCH,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(true);

    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry, 'auto-activation entry should be present').to.not.equal(undefined);
    expect(autoEntry.description).to.contain('auto-activated');
  });

  it('does not auto-activate when the patched model is empty', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: EMPTY_PIVOT_MODEL_PATCH,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(false);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry).to.equal(undefined);
  });

  it('respects an explicit /pivot/active: false from the LLM', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: `${PIVOT_MODEL_PATCH}\n${PIVOT_ACTIVE_FALSE_PATCH}`,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(false);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry).to.equal(undefined);
  });

  it('keeps pivoting active when LLM sends /pivot/active: true alongside model', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: `${PIVOT_MODEL_PATCH}\n${PIVOT_ACTIVE_TRUE_PATCH}`,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(true);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry, 'no synthetic entry should appear when LLM was explicit').to.equal(undefined);
  });

  it('respects an explicit /pivot slice with active: false and a non-empty model', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: WHOLE_PIVOT_INACTIVE_PATCH,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(false);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry).to.equal(undefined);
  });

  it('does not auto-activate when pivot is already active', async () => {
    render(
      <Test
        initialState={{
          pivoting: {
            model: {
              rows: [{ field: 'country' }],
              columns: [],
              values: [{ field: 'salary', aggFunc: 'avg' }],
            },
          },
        }}
      />,
    );

    await act(async () => {
      (apiRef.current as any)?.setPivotActive(true);
    });
    expect(isPivotActive(apiRef)).to.equal(true);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: PIVOT_MODEL_PATCH,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(true);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry).to.equal(undefined);
  });

  it('does not auto-activate when disablePivoting is set', async () => {
    render(<Test disablePivoting />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: PIVOT_MODEL_PATCH,
      });
    });

    expect(isPivotActive(apiRef)).to.equal(false);
    const autoEntry = result.applied.find(
      (entry: any) => entry.path === '/pivot/active' && entry.line === '<auto>',
    );
    expect(autoEntry).to.equal(undefined);
  });
});

describe('<DataGridPremium /> - Copilot per-op chip generation', () => {
  // Tested in isolation against `entryToChanges` because the chip strip is
  // populated via the streaming-cache (`consumeForExecutor` → `onResults`),
  // which is exercised by manual / e2e flows. Unit-testing the pure mapping
  // keeps the suite fast and avoids tee'ing fake streams.

  const helpers: any = {
    apiRef: {
      current: {
        getLocaleText: (key: string) => {
          const map: Record<string, any> = {
            promptChangeSortDescription: (col: string, dir: string) => `Sort by ${col} (${dir})`,
            promptChangeGroupDescription: (col: string) => `Group by ${col}`,
            promptChangeAggregationLabel: (col: string, agg: string) => `${col} (${agg})`,
            promptChangeAggregationDescription: (col: string, agg: string) =>
              `Aggregate ${col} (${agg})`,
            promptChangeFilterLabel: (col: string, op: string, value: string) =>
              `${col} ${op} ${value}`,
            promptChangeFilterDescription: (col: string, op: string, value: string) =>
              `Filter ${col} ${op} ${value}`,
            promptChangePivotEnableLabel: 'Pivot',
            promptChangePivotEnableDescription: 'Enable pivot',
            promptChangePivotColumnsLabel: (count: number) => `Columns (${count})`,
            promptChangePivotColumnsDescription: (col: string, dir?: string) =>
              `${col}${dir ? ` (${dir})` : ''}`,
            promptChangePivotRowsLabel: (count: number) => `Rows (${count})`,
            promptChangePivotValuesLabel: (count: number) => `Values (${count})`,
            promptChangePivotValuesDescription: (col: string, agg: string) => `${col} (${agg})`,
            promptChangeChartsLabel: (dims: number, vals: number) =>
              `Dimensions (${dims}), Values (${vals})`,
            toolbarCharts: 'Charts',
          };
          const v = map[key];
          return typeof v === 'function' ? v : (v ?? key);
        },
      },
    },
    slots: {
      promptGroupIcon: 'span',
      promptAggregationIcon: 'span',
      promptFilterIcon: 'span',
      promptSortAscIcon: 'span',
      promptSortDescIcon: 'span',
      promptPivotIcon: 'span',
      promptChartsIcon: 'span',
      promptIcon: 'span',
      columnMenuManageColumnsIcon: 'span',
      densityStandardIcon: 'span',
    },
    columns: {
      salary: { headerName: 'Salary' },
      country: { headerName: 'Country' },
      name: { headerName: 'Name' },
      position: { headerName: 'Position' },
    },
  };

  it('renders one chip per sort entry when /sort is replaced', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/sort',
      line: JSON.stringify({
        op: 'replace',
        path: '/sort',
        value: [
          { field: 'salary', sort: 'desc' },
          { field: 'name', sort: 'asc' },
        ],
      }),
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(2);
    expect(changes[0].label).to.equal('Salary');
    expect(changes[0].description).to.equal('Sort by Salary (desc)');
    expect(changes[1].label).to.equal('Name');
    expect(changes[1].description).to.equal('Sort by Name (asc)');
  });

  it('preserves order across mixed entries (sort then grouping)', () => {
    const sortEntry = {
      kind: 'patch' as const,
      path: '/sort',
      line: JSON.stringify({
        op: 'replace',
        path: '/sort',
        value: [{ field: 'salary', sort: 'desc' }],
      }),
    };
    const groupingEntry = {
      kind: 'patch' as const,
      path: '/grouping',
      line: JSON.stringify({
        op: 'replace',
        path: '/grouping',
        value: ['country'],
      }),
    };
    const out = [...entryToChanges(sortEntry, helpers), ...entryToChanges(groupingEntry, helpers)];
    expect(out).to.have.lengthOf(2);
    expect(out[0].label).to.equal('Salary');
    expect(out[1].label).to.equal('Country');
    expect(out[1].description).to.equal('Group by Country');
  });

  it('renders a single "Pivot enabled" chip for /pivot/active=true', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/pivot/active',
      line: JSON.stringify({ op: 'replace', path: '/pivot/active', value: true }),
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Pivot enabled');
  });

  it('renders a humanized chip for a command entry', () => {
    const entry = {
      kind: 'command' as const,
      type: 'history.undo',
      line: JSON.stringify({ type: 'history.undo' }),
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Undo all previous message actions');
    expect(changes[0].description).to.equal('history.undo');
  });

  it('renders the reset chip for the state.reset command', () => {
    const entry = {
      kind: 'command' as const,
      type: 'state.reset',
      line: JSON.stringify({ type: 'state.reset' }),
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Reset grid state');
    expect(changes[0].description).to.equal('state.reset');
  });

  it('falls back to a generic chip for unknown paths', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/foo',
      line: JSON.stringify({ op: 'replace', path: '/foo', value: 'bar' }),
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('foo');
  });

  it('handles the synthetic <auto> pivot-active entry', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/pivot/active',
      line: '<auto>',
      description: 'auto-activated because /pivot/model was configured',
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Pivot enabled');
    expect(changes[0].description).to.contain('auto-activated');
  });

  it('derives applied entries from a persisted setGridState tool input', () => {
    const entries = copilotToolInputToAppliedEntries('setGridState', {
      patches: JSON.stringify({
        op: 'replace',
        path: '/sort',
        value: [{ field: 'salary', sort: 'desc' }],
      }),
    });

    expect(entries).to.have.lengthOf(1);
    expect(entries[0]).to.include({ kind: 'patch', path: '/sort' });

    const changes = entryToChanges(entries[0], helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Salary');
    expect(changes[0].description).to.equal('Sort by Salary (desc)');
  });

  it('derives applied entries from a persisted runCommands tool input', () => {
    const entries = copilotToolInputToAppliedEntries('runCommands', {
      commands: JSON.stringify({ type: 'selection.clear' }),
    });

    expect(entries).to.have.lengthOf(1);
    expect(entries[0]).to.include({ kind: 'command', type: 'selection.clear' });

    const changes = entryToChanges(entries[0], helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Cleared selection');
  });

  it('renders chip for synthetic <auto> /columns/pinned (auto-pin)', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/columns/pinned',
      line: '<auto>',
      description: 'auto-pinned grouping columns to the left',
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Pinned grouping columns');
    expect(changes[0].description).to.contain('auto-pinned');
  });

  it('renders chip for synthetic <auto> /columns/pinned (auto-unpin)', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/columns/pinned',
      line: '<auto>',
      description: 'auto-unpinned grouping columns',
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Unpinned grouping columns');
  });

  it('renders chip for synthetic <auto> /columns/order (auto-move)', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/columns/order',
      line: '<auto>',
      description: 'auto-moved aggregated columns to start: salary',
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Moved aggregated columns');
    expect(changes[0].description).to.contain('salary');
  });

  it('renders chip for synthetic <auto> /columns/order (auto-restore)', () => {
    const entry = {
      kind: 'patch' as const,
      path: '/columns/order',
      line: '<auto>',
      description: 'auto-restored columns to original position: salary',
    };
    const changes = entryToChanges(entry, helpers);
    expect(changes).to.have.lengthOf(1);
    expect(changes[0].label).to.equal('Restored column order');
  });
});

describe('<DataGridPremium /> - Copilot grouping + aggregation auto-layout', () => {
  const { render } = createRenderer();

  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps> = {}) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium rows={ROWS} columns={COLUMNS} apiRef={apiRef} copilot {...props} />
      </div>
    );
  }

  function findAutoEntry(result: any, path: string, descriptionPrefix?: string) {
    return result.applied.find(
      (entry: any) =>
        entry.kind === 'patch' &&
        entry.line === '<auto>' &&
        entry.path === path &&
        (descriptionPrefix === undefined ||
          (typeof entry.description === 'string' &&
            entry.description.startsWith(descriptionPrefix))),
    );
  }

  it('auto-pins grouping column when /grouping is applied', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({
          op: 'replace',
          path: '/grouping',
          value: ['country'],
        }),
      });
    });

    const pinned = (apiRef.current as any)?.getPinnedColumns();
    expect(pinned.left).to.include('__row_group_by_columns_group__');

    const autoEntry = findAutoEntry(result, '/columns/pinned', 'auto-pinned');
    expect(autoEntry, 'auto-pin entry should be present').to.not.equal(undefined);
  });

  it('auto-unpins grouping column when /grouping is cleared', async () => {
    render(
      <Test
        initialState={{
          rowGrouping: { model: ['country'] },
          pinnedColumns: { left: ['__row_group_by_columns_group__'], right: [] },
        }}
      />,
    );

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({ op: 'replace', path: '/grouping', value: [] }),
      });
    });

    const pinned = (apiRef.current as any)?.getPinnedColumns();
    expect(pinned.left).to.not.include('__row_group_by_columns_group__');

    const autoEntry = findAutoEntry(result, '/columns/pinned', 'auto-unpinned');
    expect(autoEntry).to.not.equal(undefined);
  });

  it('moves freshly-aggregated column to the start', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({
          op: 'replace',
          path: '/aggregation',
          value: { salary: 'sum' },
        }),
      });
    });

    const order: string[] = (apiRef.current as any)?.state.columns.orderedFields ?? [];
    expect(order[0]).to.equal('salary');

    const autoEntry = findAutoEntry(result, '/columns/order', 'auto-moved');
    expect(autoEntry).to.not.equal(undefined);
    expect(autoEntry.description).to.contain('salary');
  });

  it('restores a previously-aggregated column to its original position', async () => {
    render(<Test />);

    await act(async () => {
      (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({
          op: 'replace',
          path: '/aggregation',
          value: { salary: 'sum' },
        }),
      });
    });

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({ op: 'replace', path: '/aggregation', value: {} }),
      });
    });

    const order: string[] = (apiRef.current as any)?.state.columns.orderedFields ?? [];
    // Original position for salary was index 3 (after id, country, position).
    expect(order.indexOf('salary')).to.equal(3);

    const autoEntry = findAutoEntry(result, '/columns/order', 'auto-restored');
    expect(autoEntry).to.not.equal(undefined);
  });

  it('pins grouping column and moves aggregated column in one envelope', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: [
          JSON.stringify({ op: 'replace', path: '/grouping', value: ['country'] }),
          JSON.stringify({
            op: 'replace',
            path: '/aggregation',
            value: { salary: 'sum' },
          }),
        ].join('\n'),
      });
    });

    const pinned = (apiRef.current as any)?.getPinnedColumns();
    expect(pinned.left).to.include('__row_group_by_columns_group__');

    const order: string[] = (apiRef.current as any)?.state.columns.orderedFields ?? [];
    // Aggregated column lands immediately after the pinned region.
    const pinnedCount = pinned.left.length;
    expect(order[pinnedCount]).to.equal('salary');

    expect(findAutoEntry(result, '/columns/pinned', 'auto-pinned')).to.not.equal(undefined);
    expect(findAutoEntry(result, '/columns/order', 'auto-moved')).to.not.equal(undefined);
  });

  it('skips auto-pin when the LLM explicitly sets /columns/pinned', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: [
          JSON.stringify({ op: 'replace', path: '/grouping', value: ['country'] }),
          JSON.stringify({
            op: 'replace',
            path: '/columns/pinned',
            value: { left: ['id'], right: [] },
          }),
        ].join('\n'),
      });
    });

    const autoEntry = findAutoEntry(result, '/columns/pinned', 'auto-');
    expect(autoEntry, 'no auto-pin entry should appear').to.equal(undefined);
  });

  it('skips auto-reorder when the LLM explicitly sets /columns/order', async () => {
    render(<Test />);

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: [
          JSON.stringify({
            op: 'replace',
            path: '/aggregation',
            value: { salary: 'sum' },
          }),
          JSON.stringify({
            op: 'replace',
            path: '/columns/order',
            value: ['country', 'id', 'position', 'salary'],
          }),
        ].join('\n'),
      });
    });

    const autoEntry = findAutoEntry(result, '/columns/order', 'auto-');
    expect(autoEntry, 'no auto-reorder entry should appear').to.equal(undefined);
  });

  it('does not re-pin when grouping column is already pinned', async () => {
    render(
      <Test
        initialState={{
          rowGrouping: { model: ['country'] },
          pinnedColumns: { left: ['__row_group_by_columns_group__'], right: [] },
        }}
      />,
    );

    let result: any;
    await act(async () => {
      result = (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: JSON.stringify({
          op: 'replace',
          path: '/grouping',
          value: ['country'],
        }),
      });
    });

    const autoEntry = findAutoEntry(result, '/columns/pinned', 'auto-');
    expect(autoEntry, 'no auto-pin entry when state already matches').to.equal(undefined);
  });
});

// Regression suite for the chartsIntegration stale-closure overwrite. The
// failure mode was: when an envelope set `/aggregation` and `/charts/<id>` in
// the same tick, the chart hook's debounced `updateOtherModels` would re-read
// `aggregationModel` from a stale React closure and overwrite the just-set
// function with the first available one (`'sum'` for most numeric columns).
// These tests pin down the multi-feature behaviour the Copilot reconciler
// relies on so any future regression surfaces fast.
describe('<DataGridPremium /> - Copilot multi-feature envelopes', () => {
  const { render } = createRenderer();
  let apiRef: RefObject<GridApi | null>;

  function Test(props: Partial<DataGridPremiumProps> = {}) {
    apiRef = useGridApiRef();
    return (
      <div style={{ width: 700, height: 500 }}>
        <DataGridPremium
          rows={ROWS}
          columns={COLUMNS}
          apiRef={apiRef}
          copilot
          chartsIntegration
          {...props}
        />
      </div>
    );
  }

  function envelopeFromPatches(patches: Array<Record<string, unknown>>): string {
    return patches.map((p) => JSON.stringify(p)).join('\n');
  }

  it('preserves /aggregation when applied alongside /charts/<id> in one envelope', async () => {
    render(<Test />);

    await act(async () => {
      (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: envelopeFromPatches([
          { op: 'replace', path: '/grouping', value: ['country'] },
          { op: 'replace', path: '/aggregation', value: { salary: 'avg' } },
          {
            op: 'replace',
            path: '/charts/main',
            value: {
              type: 'column',
              dimensions: [{ field: 'country' }],
              values: [{ field: 'salary' }],
              synced: true,
            },
          },
        ]),
      });
    });

    // Wait for the debounced chart pipeline to flush.
    await new Promise((r) => {
      setTimeout(r, 50);
    });

    expect((apiRef.current as any)?.state.aggregation.model).to.deep.equal({ salary: 'avg' });
  });

  ['min', 'max', 'avg', 'size'].forEach((aggFn) => {
    it(`preserves /aggregation='${aggFn}' with a chart in the same envelope`, async () => {
      render(<Test />);

      await act(async () => {
        (apiRef.current as any)?.copilot.applyEnvelope({
          setGridState: envelopeFromPatches([
            { op: 'replace', path: '/grouping', value: ['country'] },
            { op: 'replace', path: '/aggregation', value: { salary: aggFn } },
            {
              op: 'replace',
              path: '/charts/main',
              value: {
                type: 'column',
                dimensions: [{ field: 'country' }],
                values: [{ field: 'salary' }],
                synced: true,
              },
            },
          ]),
        });
      });

      await new Promise((r) => {
        setTimeout(r, 50);
      });

      expect((apiRef.current as any)?.state.aggregation.model).to.deep.equal({ salary: aggFn });
    });
  });

  it('preserves a multi-column /aggregation alongside a multi-value chart', async () => {
    render(<Test />);

    await act(async () => {
      (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: envelopeFromPatches([
          { op: 'replace', path: '/grouping', value: ['country'] },
          { op: 'replace', path: '/aggregation', value: { salary: 'avg', id: 'max' } },
          {
            op: 'replace',
            path: '/charts/main',
            value: {
              type: 'column',
              dimensions: [{ field: 'country' }],
              values: [{ field: 'salary' }, { field: 'id' }],
              synced: true,
            },
          },
        ]),
      });
    });

    await new Promise((r) => {
      setTimeout(r, 50);
    });

    expect((apiRef.current as any)?.state.aggregation.model).to.deep.equal({
      salary: 'avg',
      id: 'max',
    });
  });

  it('applies filter, sort, grouping, aggregation and chart together without cross-feature corruption', async () => {
    render(<Test />);

    await act(async () => {
      (apiRef.current as any)?.copilot.applyEnvelope({
        setGridState: envelopeFromPatches([
          {
            op: 'replace',
            path: '/filter',
            value: {
              items: [{ id: 0, field: 'salary', operator: '>', value: 100 }],
            },
          },
          {
            op: 'replace',
            path: '/sort',
            value: [{ field: 'salary', sort: 'desc' }],
          },
          { op: 'replace', path: '/grouping', value: ['country'] },
          { op: 'replace', path: '/aggregation', value: { salary: 'avg' } },
          {
            op: 'replace',
            path: '/charts/main',
            value: {
              type: 'column',
              dimensions: [{ field: 'country' }],
              values: [{ field: 'salary' }],
              synced: true,
            },
          },
        ]),
      });
    });

    await new Promise((r) => {
      setTimeout(r, 50);
    });

    const state = (apiRef.current as any)?.state;
    expect(state.filter.filterModel.items.length).to.equal(1);
    expect(state.filter.filterModel.items[0].field).to.equal('salary');
    expect(state.sorting.sortModel).to.deep.equal([{ field: 'salary', sort: 'desc' }]);
    expect(state.rowGrouping.model).to.deep.equal(['country']);
    expect(state.aggregation.model).to.deep.equal({ salary: 'avg' });
  });
});

describe('<DataGridPremium /> - Copilot chat persistence', () => {
  const { render } = createRenderer();
  const getStorageKey = (key = 'default') => `mui-x-copilot-history:v1:${key}`;
  let apiRef: RefObject<GridApi | null>;

  function createMemoryStorage(): Storage {
    const store = new Map<string, string>();
    return {
      get length() {
        return store.size;
      },
      clear() {
        store.clear();
      },
      getItem(key: string) {
        return store.get(key) ?? null;
      },
      key(index: number) {
        return Array.from(store.keys())[index] ?? null;
      },
      removeItem(key: string) {
        store.delete(key);
      },
      setItem(key: string, value: string) {
        store.set(key, value);
      },
    };
  }

  beforeEach(() => {
    class TestResizeObserver {
      observe() {
        return undefined;
      }
      unobserve() {
        return undefined;
      }
      disconnect() {
        return undefined;
      }
    }

    Object.defineProperty(globalThis, 'ResizeObserver', {
      configurable: true,
      value: TestResizeObserver,
    });
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: createMemoryStorage(),
    });
  });

  function Test({
    adapter,
    initialState,
  }: {
    adapter: ChatAdapter;
    initialState?: DataGridPremiumProps['initialState'];
  }) {
    apiRef = useGridApiRef();

    return (
      <div style={{ width: 600, height: 400 }}>
        <DataGridPremium
          rows={ROWS}
          columns={COLUMNS}
          apiRef={apiRef}
          copilot
          copilotAdapter={adapter}
          initialState={
            initialState ?? {
              sidebar: {
                open: true,
                value: GridSidebarValue.Copilot,
              },
            }
          }
        />
      </div>
    );
  }

  function getPromptInput() {
    return screen.getByLabelText('Prompt') as HTMLTextAreaElement;
  }

  async function sendPrompt(text: string, expectedSendCount: number, sendInputs: unknown[]) {
    const input = getPromptInput();
    fireEvent.change(input, { target: { value: text } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(sendInputs).to.have.lengthOf(expectedSendCount);
    });
  }

  function readStoredCopilotState(key?: string): any {
    const raw = window.localStorage.getItem(getStorageKey(key));
    return raw ? JSON.parse(raw) : undefined;
  }

  function getSortModel() {
    return apiRef.current?.exportState().sorting?.sortModel ?? [];
  }

  async function waitForSortModel(
    expectedSortModel: Array<{ field: string; sort: 'asc' | 'desc' | null | undefined }>,
  ) {
    await waitFor(() => {
      expect(getSortModel()).to.deep.equal(expectedSortModel);
    });
  }

  function setSortModel(
    sortModel: Array<{ field: string; sort: 'asc' | 'desc' | null | undefined }>,
  ) {
    act(() => {
      apiRef.current?.setSortModel(sortModel);
    });
  }

  it('uses client-generated conversation ids for persisted draft conversations', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const listMessageInputs: Array<Parameters<NonNullable<ChatAdapter['listMessages']>>[0]> = [];
    const adapter: ChatAdapter = {
      async listConversations() {
        return {
          conversations: [{ id: 'existing-chat', title: 'Earlier chat' }],
          hasMore: false,
        };
      },
      async listMessages(input) {
        listMessageInputs.push(input);
        return { messages: [], hasMore: false };
      },
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantDoneStream(`assistant-${sendInputs.length}`);
      },
    };

    window.localStorage.setItem(
      getStorageKey(),
      JSON.stringify({
        version: 1,
        activeConversationId: 'local-chat',
        conversations: [{ id: 'local-chat', title: 'Local chat' }],
        messagesByConversationId: { 'local-chat': [] },
      }),
    );

    render(<Test adapter={adapter} />);

    expect(screen.queryByText('Earlier chat')).to.equal(null);
    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(await screen.findByText('Earlier chat')).not.to.equal(null);
    expect(screen.queryByText('Local chat')).to.equal(null);
    expect(screen.getByText('History')).not.to.equal(null);
    expect(screen.getByText('More suggestions')).not.to.equal(null);
    fireEvent.click(screen.getByRole('button', { name: 'Back to Copilot' }));

    await sendPrompt('Show admins', 1, sendInputs);

    const firstConversationId = sendInputs[0].conversationId;
    expect(firstConversationId).to.match(/^mui-x-copilot-/);
    expect(sendInputs[0].message.conversationId).to.equal(firstConversationId);
    expect(sendInputs[0].messages[sendInputs[0].messages.length - 1]?.conversationId).to.equal(
      firstConversationId,
    );
    expect(listMessageInputs).to.have.lengthOf(0);

    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    await waitFor(() => {
      expect(getPromptInput().value).to.equal('');
    });

    await sendPrompt('Summarize revenue', 2, sendInputs);

    expect(sendInputs[1].conversationId).to.match(/^mui-x-copilot-/);
    expect(sendInputs[1].conversationId).not.to.equal(firstConversationId);
    expect(sendInputs[1].message.conversationId).to.equal(sendInputs[1].conversationId);
    expect(sendInputs[1].messages[sendInputs[1].messages.length - 1]?.conversationId).to.equal(
      sendInputs[1].conversationId,
    );
    expect(listMessageInputs).to.have.lengthOf(0);
  });

  it('loads a persisted conversation from the menu', async () => {
    const listMessageInputs: Array<Parameters<NonNullable<ChatAdapter['listMessages']>>[0]> = [];
    const adapter: ChatAdapter = {
      async listConversations() {
        return {
          conversations: [{ id: 'existing-chat', title: 'Earlier chat' }],
          hasMore: false,
        };
      },
      async listMessages(input) {
        listMessageInputs.push(input);
        return {
          messages:
            input.conversationId === 'existing-chat'
              ? [
                  {
                    id: 'existing-message',
                    conversationId: 'existing-chat',
                    role: 'assistant',
                    parts: [{ type: 'text', text: 'Loaded history' }],
                  },
                ]
              : [],
          hasMore: false,
        };
      },
      async sendMessage() {
        return createAssistantDoneStream('assistant-unused');
      },
    };

    render(<Test adapter={adapter} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Earlier chat' }));

    expect(await screen.findByText('Loaded history')).not.to.equal(null);
    expect(screen.queryByText('History')).to.equal(null);
    expect(listMessageInputs).to.have.lengthOf(1);
    expect(listMessageInputs[0].conversationId).to.equal('existing-chat');
  });

  it('does not persist send-only adapter conversations unless explicitly wrapped', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream(`assistant-${sendInputs.length}`, 'Unstored answer');
      },
    };

    render(<Test adapter={adapter} />);

    await sendPrompt('Show admins', 1, sendInputs);
    expect(window.localStorage.getItem(getStorageKey())).to.equal(null);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(screen.getByText('No prompt history')).not.to.equal(null);
    expect(screen.queryByRole('menuitem', { name: 'Show admins' })).to.equal(null);
  });

  it('persists explicitly wrapped send-only adapter conversations in localStorage', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream(`assistant-${sendInputs.length}`, 'Saved answer');
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    render(<Test adapter={persistentAdapter} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(screen.getByText('History')).not.to.equal(null);
    expect(screen.getByText('No prompt history')).not.to.equal(null);
    fireEvent.click(screen.getByRole('button', { name: 'Back to Copilot' }));

    await sendPrompt('Show admins', 1, sendInputs);

    const conversationId = sendInputs[0].conversationId;
    expect(conversationId).to.match(/^mui-x-copilot-/);

    await waitFor(() => {
      const storedState = readStoredCopilotState();
      expect(storedState.activeConversationId).to.equal(conversationId);
      expect(storedState.conversations).to.have.lengthOf(1);
      expect(storedState.conversations[0].title).to.equal('Show admins');
      expect(storedState.messagesByConversationId[conversationId!]).to.have.lengthOf(2);
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(await screen.findByRole('menuitem', { name: 'Show admins' })).not.to.equal(null);
  });

  it('persists the final grid state for a localStorage conversation', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream('assistant-grid-state', 'Saved answer');
      },
    };

    render(<Test adapter={createGridCopilotLocalStorageAdapter(adapter)} />);

    setSortModel([{ field: 'salary', sort: 'desc' }]);
    await sendPrompt('Sort by salary', 1, sendInputs);

    const conversationId = sendInputs[0].conversationId;
    await waitFor(() => {
      const storedGridState = readStoredCopilotState().gridStateByConversationId[conversationId!];
      expect(storedGridState.sorting.sortModel).to.deep.equal([{ field: 'salary', sort: 'desc' }]);
    });
  });

  it('reloads the active localStorage conversation grid state after remount', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream('assistant-grid-state-reload', 'Reloaded answer');
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    const { unmount } = render(<Test adapter={persistentAdapter} />);

    setSortModel([{ field: 'salary', sort: 'desc' }]);
    await sendPrompt('Remember salary sort', 1, sendInputs);
    await waitFor(() => {
      expect(
        readStoredCopilotState().gridStateByConversationId[sendInputs[0].conversationId!],
      ).not.to.equal(undefined);
    });

    unmount();
    render(<Test adapter={persistentAdapter} />);

    expect(await screen.findByText('Remember salary sort')).not.to.equal(null);
    await waitForSortModel([{ field: 'salary', sort: 'desc' }]);
  });

  it('restores the selected localStorage conversation grid state from history', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream(
          `assistant-grid-state-${sendInputs.length}`,
          `Answer ${sendInputs.length}`,
        );
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    render(<Test adapter={persistentAdapter} />);

    setSortModel([{ field: 'salary', sort: 'desc' }]);
    await sendPrompt('Salary sort', 1, sendInputs);

    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    await waitForSortModel([]);

    setSortModel([{ field: 'country', sort: 'asc' }]);
    await sendPrompt('Country sort', 2, sendInputs);
    await waitForSortModel([{ field: 'country', sort: 'asc' }]);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'Salary sort' }));

    expect(await screen.findByText('Salary sort')).not.to.equal(null);
    await waitForSortModel([{ field: 'salary', sort: 'desc' }]);
  });

  it('resets the grid to the baseline state for a new localStorage conversation', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream('assistant-new-grid-state', 'Saved answer');
      },
    };

    render(
      <Test
        adapter={createGridCopilotLocalStorageAdapter(adapter)}
        initialState={{
          sidebar: {
            open: true,
            value: GridSidebarValue.Copilot,
          },
          sorting: {
            sortModel: [{ field: 'id', sort: 'asc' }],
          },
        }}
      />,
    );

    await waitForSortModel([{ field: 'id', sort: 'asc' }]);
    setSortModel([{ field: 'salary', sort: 'desc' }]);
    await sendPrompt('Salary sort', 1, sendInputs);

    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));

    await waitForSortModel([{ field: 'id', sort: 'asc' }]);
    await waitFor(() => {
      expect(Object.keys(readStoredCopilotState().gridStateByConversationId)).to.deep.equal([
        sendInputs[0].conversationId,
      ]);
    });
  });

  it('uses the default localStorage namespace when no key is provided', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream('assistant-default-key', 'Default answer');
      },
    };

    render(<Test adapter={createGridCopilotLocalStorageAdapter(adapter)} />);

    await sendPrompt('Default namespace', 1, sendInputs);

    await waitFor(() => {
      expect(readStoredCopilotState().conversations[0].title).to.equal('Default namespace');
    });
  });

  it('isolates localStorage conversations by custom key', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream(`assistant-custom-${sendInputs.length}`, 'Keyed answer');
      },
    };

    const view = render(
      <Test adapter={createGridCopilotLocalStorageAdapter(adapter, { key: 'employees' })} />,
    );

    await sendPrompt('Employees only', 1, sendInputs);
    view.unmount();

    const utils = render(
      <Test adapter={createGridCopilotLocalStorageAdapter(adapter, { key: 'commodities' })} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(await screen.findByText('No prompt history')).not.to.equal(null);
    expect(screen.queryByText('Employees only')).to.equal(null);
    utils.unmount();

    render(<Test adapter={createGridCopilotLocalStorageAdapter(adapter, { key: 'employees' })} />);

    expect(await screen.findByText('Employees only')).not.to.equal(null);
    expect(readStoredCopilotState('employees').conversations).to.have.lengthOf(1);
    expect(readStoredCopilotState('commodities')?.conversations ?? []).to.have.lengthOf(0);
  });

  it('reloads localStorage conversations and messages after remount', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream('assistant-local-reload', 'Reloaded answer');
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    const { unmount } = render(<Test adapter={persistentAdapter} />);

    await sendPrompt('Summarize revenue', 1, sendInputs);
    expect(await screen.findByText('Reloaded answer')).not.to.equal(null);

    unmount();
    render(<Test adapter={persistentAdapter} />);

    expect(await screen.findByText('Summarize revenue')).not.to.equal(null);
    expect(await screen.findByText('Reloaded answer')).not.to.equal(null);
    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(await screen.findByRole('menuitem', { name: 'Summarize revenue' })).not.to.equal(null);
  });

  it('restores the selected localStorage conversation id after remount', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantTextStream(
          `assistant-${sendInputs.length}`,
          `Answer ${sendInputs.length}`,
        );
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    const { unmount } = render(<Test adapter={persistentAdapter} />);

    await sendPrompt('First question', 1, sendInputs);
    const firstConversationId = sendInputs[0].conversationId;
    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));
    await waitFor(() => {
      expect(getPromptInput().value).to.equal('');
    });
    await sendPrompt('Second question', 2, sendInputs);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    fireEvent.click(await screen.findByRole('menuitem', { name: 'First question' }));

    await waitFor(() => {
      expect(readStoredCopilotState().activeConversationId).to.equal(firstConversationId);
    });

    unmount();
    render(<Test adapter={persistentAdapter} />);

    expect(await screen.findByText('First question')).not.to.equal(null);
    expect(screen.queryByText('Second question')).to.equal(null);
  });

  it('does not add a localStorage history row for an unsent draft conversation', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantDoneStream(`assistant-${sendInputs.length}`);
      },
    };
    const persistentAdapter = createGridCopilotLocalStorageAdapter(adapter);

    render(<Test adapter={persistentAdapter} />);

    await sendPrompt('Only sent conversation', 1, sendInputs);
    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }));

    await waitFor(() => {
      expect(readStoredCopilotState().conversations).to.have.lengthOf(1);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(screen.getByRole('menuitem', { name: 'Only sent conversation' })).not.to.equal(null);
    expect(screen.queryByText(/^mui-x-copilot-/)).to.equal(null);
  });

  it('falls back to empty localStorage history when the stored payload is corrupt', async () => {
    const adapter: ChatAdapter = {
      async sendMessage() {
        return createAssistantDoneStream('assistant-unused');
      },
    };

    window.localStorage.setItem(getStorageKey(), '{bad json');

    render(<Test adapter={createGridCopilotLocalStorageAdapter(adapter)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Open Copilot menu' }));
    expect(await screen.findByText('No prompt history')).not.to.equal(null);
  });

  it('persists the executor result on message.metadata so custom UIs survive reload', async () => {
    const sendInputs: Array<Parameters<ChatAdapter['sendMessage']>[0]> = [];
    const patchLine = JSON.stringify({
      op: 'replace',
      path: '/sort',
      value: [{ field: 'salary', sort: 'desc' }],
    });
    const adapter: ChatAdapter = {
      async sendMessage(input) {
        sendInputs.push(input);
        return createAssistantSetGridStateStream(`assistant-${sendInputs.length}`, patchLine);
      },
    };

    render(<Test adapter={createGridCopilotLocalStorageAdapter(adapter)} />);

    await sendPrompt('Sort by salary desc', 1, sendInputs);

    const conversationId = sendInputs[0].conversationId!;

    await waitFor(() => {
      const stored = readStoredCopilotState();
      const persistedMessages = stored.messagesByConversationId[conversationId];
      expect(persistedMessages, 'persisted messages').to.not.equal(undefined);
      const assistantMessage = persistedMessages.find((m: any) => m.role === 'assistant');
      expect(assistantMessage, 'persisted assistant message').to.not.equal(undefined);
      const execResult = assistantMessage.metadata?.gridCopilotExecutionResult;
      expect(execResult, 'gridCopilotExecutionResult on message.metadata').to.not.equal(undefined);
      expect(execResult.applied).to.be.an('array');
      const patchEntry = execResult.applied.find(
        (entry: any) => entry.kind === 'patch' && entry.path === '/sort',
      );
      expect(patchEntry, 'sort patch entry in persisted applied list').to.not.equal(undefined);
    });
  });
});
