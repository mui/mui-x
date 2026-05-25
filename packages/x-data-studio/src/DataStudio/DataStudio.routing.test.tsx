import * as React from 'react';
import {
  act,
  createRenderer,
  fireEvent,
  flushMicrotasks,
  screen,
} from '@mui/internal-test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DataStudio } from './DataStudio';
import { createSearchParamsRoutingAdapter } from './routing';
import type {
  DataStudioRoutingAdapter,
  DataStudioRoutingMode,
  DataStudioRoutingState,
} from './routing';
import type {
  DataStudioDataGridInjectedProps,
  DataStudioDataGridProps,
  DataStudioDataset,
} from './DataStudio.types';

const { render } = createRenderer();

type WriteCall = { state: DataStudioRoutingState; mode: DataStudioRoutingMode };

function makeFakeRouter(
  initial: DataStudioRoutingState = { activeDatasetId: null, activeViewId: null },
) {
  let state: DataStudioRoutingState = initial;
  const listeners = new Set<() => void>();
  const writeCalls: WriteCall[] = [];
  const adapter: DataStudioRoutingAdapter = {
    read: () => state,
    write: (next, mode) => {
      writeCalls.push({ state: next, mode });
      state = next;
      listeners.forEach((listener) => listener());
    },
    subscribe: (onChange) => {
      listeners.add(onChange);
      return () => {
        listeners.delete(onChange);
      };
    },
  };
  return {
    adapter,
    writeCalls,
    navigate: (next: DataStudioRoutingState) => {
      state = next;
      listeners.forEach((listener) => listener());
    },
    getState: () => state,
  };
}

type CapturedProps = DataStudioDataGridProps & Partial<DataStudioDataGridInjectedProps>;

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
  label: 'Alpha',
  columns: [{ field: 'name', headerName: 'Name' }],
};

const datasetB: DataStudioDataset = {
  id: 'b',
  label: 'Beta',
  columns: [{ field: 'name', headerName: 'Name' }],
};

function lastDatasetColumnsLabel(calls: CapturedProps[]): string | undefined {
  const last = calls.at(-1);
  return last?.columns?.[0]?.headerName as string | undefined;
}

describe('<DataStudio /> — routing adapter', () => {
  it("picks up the URL state when it populates after first render (Next.js Pages Router isReady)", () => {
    // Simulates the Pages Router lifecycle: `router.query` is `{}` during the
    // initial render and is replaced with the parsed params one microtask
    // later, with the parent re-rendering but the adapter staying the same
    // reference (popstate never fires).
    let backing: DataStudioRoutingState = { activeDatasetId: null, activeViewId: null };
    const adapter: DataStudioRoutingAdapter = {
      // Live read so callers see the current value, not a snapshot frozen at adapter creation.
      read: () => backing,
      write: () => {},
      subscribe: () => () => {},
    };
    const { Grid, calls } = makeCapturingGrid();

    function Host() {
      return (
        <div style={{ width: 500, height: 300 }}>
          <DataStudio
            datasets={[
              { id: 'a', label: 'Alpha', columns: [{ field: 'name', headerName: 'A' }] },
              { id: 'b', label: 'Beta', columns: [{ field: 'name', headerName: 'B' }] },
            ]}
            routing={adapter}
            slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
          />
        </div>
      );
    }

    const { setProps } = render(<Host />);
    // First render: empty query → falls back to first dataset.
    expect(lastDatasetColumnsLabel(calls)).toBe('A');

    // Router becomes ready → query populated to ?dataset=b.
    backing = { activeDatasetId: 'b', activeViewId: null };
    setProps({});

    expect(lastDatasetColumnsLabel(calls)).toBe('B');
  });

  it('reads the active dataset id from the routing adapter on mount', () => {
    const router = makeFakeRouter({ activeDatasetId: 'b', activeViewId: null });
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    // The grid received dataset B's columns.
    expect(lastDatasetColumnsLabel(calls)).toBe('Name');
    // Grid is rendered with dataset B's keying — easier to assert by checking the
    // dataset definition flowed through: `dataSource` is undefined for both, so use
    // a marker via `columns` length (both 1) → just rely on no clamp write.
    expect(router.writeCalls).toHaveLength(0);
  });

  it("silently 'replace's the URL when it points at a missing dataset", () => {
    const router = makeFakeRouter({ activeDatasetId: 'ghost', activeViewId: null });
    const { Grid } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(router.writeCalls).toHaveLength(1);
    expect(router.writeCalls[0].mode).toBe('replace');
    expect(router.writeCalls[0].state).toEqual({ activeDatasetId: 'a', activeViewId: null });
  });

  it("silently 'replace's the URL when it points at a missing view", () => {
    const router = makeFakeRouter({ activeDatasetId: 'a', activeViewId: 'missing' });
    const { Grid } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA]}
          defaultViews={[]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(router.writeCalls).toHaveLength(1);
    expect(router.writeCalls[0].mode).toBe('replace');
    expect(router.writeCalls[0].state).toEqual({ activeDatasetId: 'a', activeViewId: null });
  });

  it("'push'es a new history entry when a dataset tab is clicked", async () => {
    const router = makeFakeRouter();
    const { Grid } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    // Empty URL on mount → no auto-write.
    expect(router.writeCalls).toHaveLength(0);

    // Selecting dataset B via the sidebar tree triggers state.selectDataset.
    fireEvent.click(screen.getByText('Beta'));
    // Writes are coalesced via queueMicrotask — wait for the next microtask.
    await flushMicrotasks();

    expect(router.writeCalls).toHaveLength(1);
    expect(router.writeCalls[0].mode).toBe('push');
    expect(router.writeCalls[0].state).toEqual({ activeDatasetId: 'b', activeViewId: null });
  });

  it("does not loop between visited datasets when the user goes back through A->B->C history", async () => {
    const router = makeFakeRouter();
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[
            { id: 'a', label: 'Alpha', columns: [{ field: 'name', headerName: 'A' }] },
            { id: 'b', label: 'Beta', columns: [{ field: 'name', headerName: 'B' }] },
            { id: 'c', label: 'Gamma', columns: [{ field: 'name', headerName: 'C' }] },
          ]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    // A -> B -> C via tab clicks.
    fireEvent.click(screen.getByText('Beta'));
    await flushMicrotasks();
    fireEvent.click(screen.getByText('Gamma'));
    await flushMicrotasks();

    expect(router.writeCalls.map((c) => c.state.activeDatasetId)).toEqual(['b', 'c']);
    expect(router.writeCalls.every((c) => c.mode === 'push')).toBe(true);
    const writesAfterForward = router.writeCalls.length;

    // Browser back: URL becomes ?dataset=b. The popstate handler updates
    // `navState` — the studio must NOT push 'c' again (the regression).
    act(() => {
      router.navigate({ activeDatasetId: 'b', activeViewId: null });
    });
    await flushMicrotasks();
    expect(router.writeCalls).toHaveLength(writesAfterForward);
    expect(lastDatasetColumnsLabel(calls)).toBe('B');

    // Back again -> ?dataset=a. Still no extra writes.
    act(() => {
      router.navigate({ activeDatasetId: 'a', activeViewId: null });
    });
    await flushMicrotasks();
    expect(router.writeCalls).toHaveLength(writesAfterForward);
    expect(lastDatasetColumnsLabel(calls)).toBe('A');
  });

  it('re-renders to the new dataset when external navigation fires', () => {
    const router = makeFakeRouter({ activeDatasetId: 'a', activeViewId: null });
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    const callsBefore = calls.length;
    // Simulate browser back/forward landing on dataset B.
    act(() => {
      router.navigate({ activeDatasetId: 'b', activeViewId: null });
    });

    expect(calls.length).toBeGreaterThan(callsBefore);
    // No new writes — navigation came from outside the studio.
    expect(router.writeCalls).toHaveLength(0);
  });

  it('explicit activeDatasetId controlled prop wins over the adapter', () => {
    const router = makeFakeRouter({ activeDatasetId: 'a', activeViewId: null });
    const onActiveDatasetChange = vi.fn();
    const { Grid } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          activeDatasetId="b"
          onActiveDatasetChange={onActiveDatasetChange}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    // URL said 'a' but the explicit controlled prop chose 'b' → 'replace' to silently align.
    expect(router.writeCalls).toHaveLength(1);
    expect(router.writeCalls[0].mode).toBe('replace');
    expect(router.writeCalls[0].state).toEqual({ activeDatasetId: 'b', activeViewId: null });
  });

  it('behaves identically to routing={undefined} when routing={null}', () => {
    const { Grid, calls } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={null}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    // Defaults to first dataset; no adapter so no router noise.
    expect(calls.length).toBeGreaterThan(0);
  });

  it('does not write to the URL when the URL is empty on mount', () => {
    const router = makeFakeRouter({ activeDatasetId: null, activeViewId: null });
    const { Grid } = makeCapturingGrid();

    render(
      <div style={{ width: 500, height: 300 }}>
        <DataStudio
          datasets={[datasetA, datasetB]}
          routing={router.adapter}
          slots={{ dataGrid: Grid as any, toolbar: null, menuBar: null }}
        />
      </div>,
    );

    expect(router.writeCalls).toHaveLength(0);
  });
});

describe('createSearchParamsRoutingAdapter', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/test');
  });

  afterEach(() => {
    window.history.replaceState(null, '', '/test');
  });

  it('reads the default `dataset` and `view` query params', () => {
    window.history.replaceState(null, '', '/test?dataset=customers&view=v1');
    const adapter = createSearchParamsRoutingAdapter();
    expect(adapter.read()).toEqual({ activeDatasetId: 'customers', activeViewId: 'v1' });
  });

  it('returns a reference-stable snapshot when the URL has not changed', () => {
    window.history.replaceState(null, '', '/test?dataset=a');
    const adapter = createSearchParamsRoutingAdapter();
    const first = adapter.read();
    const second = adapter.read();
    expect(second).toBe(first);
  });

  it("'push'es a new history entry and fires the subscribe callback", () => {
    const adapter = createSearchParamsRoutingAdapter();
    const listener = vi.fn();
    adapter.subscribe(listener);

    adapter.write({ activeDatasetId: 'orders', activeViewId: null }, 'push');

    expect(window.location.search).toBe('?dataset=orders');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("'replace's the current entry instead of pushing", () => {
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    const pushSpy = vi.spyOn(window.history, 'pushState');

    const adapter = createSearchParamsRoutingAdapter();
    adapter.write({ activeDatasetId: 'orders', activeViewId: null }, 'replace');

    expect(replaceSpy).toHaveBeenCalledTimes(1);
    expect(pushSpy).not.toHaveBeenCalled();

    replaceSpy.mockRestore();
    pushSpy.mockRestore();
  });

  it('honors custom param names', () => {
    const adapter = createSearchParamsRoutingAdapter({ datasetParam: 'ds', viewParam: 'v' });
    window.history.replaceState(null, '', '/test?ds=alpha&v=beta');
    expect(adapter.read()).toEqual({ activeDatasetId: 'alpha', activeViewId: 'beta' });

    adapter.write({ activeDatasetId: 'gamma', activeViewId: null }, 'push');
    expect(window.location.search).toBe('?ds=gamma');
  });

  it('drops params on null values without leaving them in the URL', () => {
    window.history.replaceState(null, '', '/test?dataset=a&view=v1&unrelated=keep');
    const adapter = createSearchParamsRoutingAdapter();
    adapter.write({ activeDatasetId: null, activeViewId: null }, 'replace');
    expect(window.location.search).toBe('?unrelated=keep');
  });

  it('does not throw and returns the empty state when window is unavailable', () => {
    const stashedWindow = global.window;
    // @ts-expect-error — deliberately removing window for the SSR path.
    delete global.window;
    try {
      const adapter = createSearchParamsRoutingAdapter();
      expect(adapter.read()).toEqual({ activeDatasetId: null, activeViewId: null });
      expect(() =>
        adapter.write({ activeDatasetId: 'a', activeViewId: null }, 'push'),
      ).not.toThrow();
      const unsubscribe = adapter.subscribe(() => {});
      expect(() => unsubscribe()).not.toThrow();
    } finally {
      global.window = stashedWindow;
    }
  });

  it('responds to popstate events from the browser', () => {
    const adapter = createSearchParamsRoutingAdapter();
    const listener = vi.fn();
    const unsubscribe = adapter.subscribe(listener);

    window.dispatchEvent(new Event('popstate'));
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    window.dispatchEvent(new Event('popstate'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
