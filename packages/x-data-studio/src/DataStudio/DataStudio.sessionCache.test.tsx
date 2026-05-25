import * as React from 'react';
import { createRenderer, fireEvent, screen } from '@mui/internal-test-utils';
import { describe, expect, it, vi } from 'vitest';
import type {
  GridDataSourceCache,
  GridGetRowsParams,
  GridGetRowsResponse,
} from '@mui/x-data-grid';
import { DataStudio } from './DataStudio';
import { DataStudioSessionCache, createDataStudioSessionCache } from './sessionCache';
import { useDataStudioState } from './useDataStudioState';
import type { DataStudioDataGridProps, DataStudioDataset } from './DataStudio.types';

const { render } = createRenderer();

const buildParams = (overrides: Partial<GridGetRowsParams> = {}): GridGetRowsParams =>
  ({
    start: 0,
    end: 24,
    filterModel: { items: [] },
    sortModel: [],
    groupKeys: [],
    ...overrides,
  }) as GridGetRowsParams;

const buildResponse = (rowCount: number): GridGetRowsResponse => ({
  rows: Array.from({ length: rowCount }, (_, index) => ({ id: index })),
  rowCount,
});

describe('DataStudioSessionCache', () => {
  it('namespaces entries per dataset', () => {
    const cache = createDataStudioSessionCache();
    const a = cache.forDataset('a');
    const b = cache.forDataset('b');
    const params = buildParams();
    const responseA = buildResponse(1);
    const responseB = buildResponse(2);

    a.set(params, responseA);
    b.set(params, responseB);

    expect(a.get(params)).toBe(responseA);
    expect(b.get(params)).toBe(responseB);
    expect(cache.size).toBe(2);
  });

  it('only clears its own namespace when a per-dataset view calls clear()', () => {
    const cache = createDataStudioSessionCache();
    const a = cache.forDataset('a');
    const b = cache.forDataset('b');
    const params = buildParams();

    a.set(params, buildResponse(1));
    b.set(params, buildResponse(2));
    a.clear();

    expect(a.get(params)).toBeUndefined();
    expect(b.get(params)).not.toBeUndefined();
  });

  it('expires entries after the configured TTL', () => {
    vi.useFakeTimers();
    try {
      const cache = createDataStudioSessionCache({ ttl: 1_000 });
      const a = cache.forDataset('a');
      const params = buildParams();
      a.set(params, buildResponse(1));

      expect(a.get(params)).not.toBeUndefined();
      vi.advanceTimersByTime(1_500);
      expect(a.get(params)).toBeUndefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('evicts the oldest entry when maxEntries is exceeded', () => {
    const cache = createDataStudioSessionCache({ maxEntries: 2 });
    const a = cache.forDataset('a');
    const first = buildParams({ start: 0, end: 24 });
    const second = buildParams({ start: 25, end: 49 });
    const third = buildParams({ start: 50, end: 74 });
    a.set(first, buildResponse(1));
    a.set(second, buildResponse(1));
    a.set(third, buildResponse(1));

    expect(a.get(first)).toBeUndefined();
    expect(a.get(second)).not.toBeUndefined();
    expect(a.get(third)).not.toBeUndefined();
  });

  it('LRU touch on get keeps recently-read entries alive under pressure', () => {
    const cache = createDataStudioSessionCache({ maxEntries: 2 });
    const a = cache.forDataset('a');
    const first = buildParams({ start: 0, end: 24 });
    const second = buildParams({ start: 25, end: 49 });
    const third = buildParams({ start: 50, end: 74 });

    a.set(first, buildResponse(1));
    a.set(second, buildResponse(1));
    // Read `first` → it becomes most-recently-used.
    a.get(first);
    a.set(third, buildResponse(1));

    expect(a.get(first)).not.toBeUndefined();
    expect(a.get(second)).toBeUndefined();
    expect(a.get(third)).not.toBeUndefined();
  });

  it('invalidateAll drops every entry', () => {
    const cache = createDataStudioSessionCache();
    cache.forDataset('a').set(buildParams(), buildResponse(1));
    cache.forDataset('b').set(buildParams(), buildResponse(2));

    cache.invalidateAll();
    expect(cache.size).toBe(0);
  });

  it('uses a custom getKey when provided', () => {
    const getKey = vi.fn((p: GridGetRowsParams) => `custom:${p.start}-${p.end}`);
    const cache = createDataStudioSessionCache({ getKey });
    const a = cache.forDataset('a');
    a.set(buildParams(), buildResponse(1));

    expect(getKey).toHaveBeenCalled();
    expect(a.get(buildParams())).not.toBeUndefined();
  });
});

describe('useDataStudioState — cache invalidation API', () => {
  function HookProbe(props: { cache: DataStudioSessionCache | null }) {
    const state = useDataStudioState({
      datasets: [
        { id: 'a', label: 'A', columns: [] },
        { id: 'b', label: 'B', columns: [] },
      ],
      sessionCache: props.cache,
    });
    return (
      <div>
        <button type="button" data-testid="invalidate-a" onClick={() => state.invalidateDataset('a')}>
          drop a
        </button>
        <button type="button" data-testid="invalidate-all" onClick={() => state.invalidateAll()}>
          drop all
        </button>
      </div>
    );
  }

  it('invalidateDataset drops only the given namespace', () => {
    const cache = createDataStudioSessionCache();
    cache.forDataset('a').set(buildParams(), buildResponse(1));
    cache.forDataset('b').set(buildParams(), buildResponse(2));

    render(<HookProbe cache={cache} />);
    fireEvent.click(screen.getByTestId('invalidate-a'));

    expect(cache.size).toBe(1);
    expect(cache.forDataset('b').get(buildParams())).not.toBeUndefined();
  });

  it('invalidateAll is a no-op when no cache is wired (per-dataset / none strategies)', () => {
    render(<HookProbe cache={null} />);
    expect(() => fireEvent.click(screen.getByTestId('invalidate-all'))).not.toThrow();
  });
});

describe('<DataStudio /> — cacheStrategy', () => {
  type CapturedProps = DataStudioDataGridProps & {
    dataSourceCache?: GridDataSourceCache | null;
    rows?: unknown;
  };

  function makeCapturingGrid() {
    const calls: CapturedProps[] = [];
    function Grid(props: CapturedProps) {
      calls.push(props);
      return <div data-testid="capturing-grid">grid</div>;
    }
    return { Grid, calls };
  }

  const datasetA: DataStudioDataset = {
    id: 'a',
    label: 'A',
    columns: [{ field: 'name', headerName: 'A' }],
  };

  const datasetB: DataStudioDataset = {
    id: 'b',
    label: 'B',
    columns: [{ field: 'name', headerName: 'B' }],
  };

  it("defaults to 'shared' and passes a per-dataset cache view to the grid", () => {
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    const last = calls.at(-1)!;
    expect(last.dataSourceCache).toBeTruthy();
    // The view should be the cache-shape `{ set, get, clear }` (not a class instance).
    expect(typeof (last.dataSourceCache as GridDataSourceCache).get).toBe('function');
    expect(typeof (last.dataSourceCache as GridDataSourceCache).clear).toBe('function');
  });

  it("passes null when cacheStrategy='none'", () => {
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA]}
          cacheStrategy="none"
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(calls.at(-1)!.dataSourceCache).toBeNull();
  });

  it("passes undefined when cacheStrategy='per-dataset' (legacy default cache)", () => {
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA]}
          cacheStrategy="per-dataset"
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(calls.at(-1)!.dataSourceCache).toBeUndefined();
  });

  it('per-dataset dataSourceCache wins over the shared strategy', () => {
    const { Grid, calls } = makeCapturingGrid();
    const datasetCache: GridDataSourceCache = {
      get: vi.fn(),
      set: vi.fn(),
      clear: vi.fn(),
    };

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[{ ...datasetA, dataSourceCache: datasetCache }]}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(calls.at(-1)!.dataSourceCache).toBe(datasetCache);
  });

  it("passes a stable per-dataset cache view across renders when 'shared'", () => {
    const { Grid, calls } = makeCapturingGrid();

    const { setProps } = render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          initialDatasetId="a"
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );
    const firstCache = calls.at(-1)!.dataSourceCache;

    // Force a re-render without switching dataset.
    setProps({});

    const secondCache = calls.at(-1)!.dataSourceCache;
    expect(secondCache).toBe(firstCache);
  });

});
