import * as React from 'react';
import { type RefObject } from '@mui/x-internals/types';
import { act, createRenderer } from '@mui/internal-test-utils';
import {
  DataGridPremium,
  type DataGridPremiumProps,
  type GridApi,
  type GridColDef,
  useGridApiRef,
} from '@mui/x-data-grid-premium';

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
