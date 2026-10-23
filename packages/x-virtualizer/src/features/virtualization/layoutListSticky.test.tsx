import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { useVirtualizer, LayoutListSticky, type RowEntry } from '@mui/x-virtualizer';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect, vi } from 'vitest';

const ROW_HEIGHT = 48;
const VIEWPORT_HEIGHT = 400;
const ROW_COUNT = 1000;

const defaultRows = Array.from({ length: ROW_COUNT }, (_, index) => ({
  id: index,
  model: { label: `Item ${index}` },
}));

type VirtualizerApi = ReturnType<typeof useVirtualizer>['api'];

function StickyList(props: { rows?: RowEntry[]; apiRef?: React.RefObject<VirtualizerApi | null> }) {
  const rows = props.rows ?? defaultRows;
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => new LayoutListSticky(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: ROW_HEIGHT,
    },
    virtualization: { layoutMode: 'sticky' },

    rows,
    range: { firstRowIndex: 0, lastRowIndex: rows.length },
    rowCount: rows.length,

    renderRow: (params) => (
      <div key={params.id} data-testid="row" data-id={params.id} style={{ height: ROW_HEIGHT }}>
        {(params.model as { label: string }).label}
      </div>
    ),
  });

  if (props.apiRef) {
    props.apiRef.current = virtualizer.api;
  }

  const containerProps = virtualizer.store.use(LayoutListSticky.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutListSticky.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutListSticky.selectors.positionerProps);
  const windowProps = virtualizer.store.use(LayoutListSticky.selectors.windowProps);
  const windowContentProps = virtualizer.store.use(LayoutListSticky.selectors.windowContentProps);

  return (
    <div
      {...containerProps}
      data-testid="scroller"
      style={{ ...containerProps.style, height: VIEWPORT_HEIGHT, overflowY: 'auto' }}
    >
      <div {...contentProps}>
        <div {...positionerProps} />
        <div {...windowProps} data-testid="window">
          <div {...windowContentProps} data-testid="window-content">
            {virtualizer.api.getters.getRows()}
          </div>
        </div>
      </div>
    </div>
  );
}

function expectViewportCovered() {
  const scrollerRect = screen.getByTestId('scroller').getBoundingClientRect();
  const windowRect = screen.getByTestId('window').getBoundingClientRect();
  expect(windowRect.top).to.be.at.most(scrollerRect.top + 0.5);
  expect(windowRect.bottom).to.be.at.least(scrollerRect.bottom - 0.5);
}

function getWindowRowIds() {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-testid="row"]')).map((node) =>
    Number(node.dataset.id),
  );
}

describe.skipIf(isJSDOM)('<LayoutListSticky />', () => {
  const { render } = createRenderer();

  async function renderList(props?: {
    rows?: RowEntry[];
    apiRef?: React.RefObject<VirtualizerApi | null>;
  }) {
    const view = render(<StickyList {...props} />);
    await waitFor(() => {
      expect(getWindowRowIds().length).to.be.greaterThan(0);
    });
    return view;
  }

  it('renders only a window of rows', async () => {
    await renderList();
    expect(getWindowRowIds().length).to.be.lessThan(ROW_COUNT / 10);
    expectViewportCovered();
  });

  it('keeps the viewport covered when scrolling down past the rendered window', async () => {
    await renderList();
    const scroller = screen.getByTestId('scroller');
    const scrollTop = 500 * ROW_HEIGHT;

    act(() => {
      scroller.scrollTop = scrollTop;
    });
    // The virtualizer hasn't received the scroll event yet: the stale window must
    // already cover the viewport through sticky clamping alone.
    expect(getWindowRowIds()).not.to.include(500);
    expectViewportCovered();

    // Once the virtualizer catches up, the correct rows are rendered in place.
    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(500);
    });
    expectViewportCovered();

    const scrollerRect = scroller.getBoundingClientRect();
    const rowRect = document.querySelector('[data-id="500"]')!.getBoundingClientRect();
    expect(rowRect.top - scrollerRect.top).to.be.closeTo(500 * ROW_HEIGHT - scrollTop, 1);
  });

  it('keeps the viewport covered when scrolling back up past the rendered window', async () => {
    await renderList();
    const scroller = screen.getByTestId('scroller');

    await act(async () => {
      scroller.scrollTop = 500 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(500);
    });

    const scrollTop = 250 * ROW_HEIGHT;
    act(() => {
      scroller.scrollTop = scrollTop;
    });
    expect(getWindowRowIds()).not.to.include(250);
    expectViewportCovered();

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(250);
    });
    expectViewportCovered();

    const scrollerRect = scroller.getBoundingClientRect();
    const rowRect = document.querySelector('[data-id="250"]')!.getBoundingClientRect();
    expect(rowRect.top - scrollerRect.top).to.be.closeTo(250 * ROW_HEIGHT - scrollTop, 1);
  });

  it('keeps retained rows at identical content-local offsets across context updates', async () => {
    // The rows paint into the composited windowContent box, and any change of their
    // offset within that box re-rasterizes them. A context update must therefore
    // grow the box's anchor pad by exactly the dropped rows' height, leaving
    // carried-over rows byte-identical in its local space.
    await renderList();
    const scroller = screen.getByTestId('scroller');

    await act(async () => {
      scroller.scrollTop = 40 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(40);
    });

    const localOffsets = () => {
      const contentTop = screen.getByTestId('window-content').getBoundingClientRect().top;
      return new Map(
        Array.from(document.querySelectorAll<HTMLElement>('[data-testid="row"]')).map((node) => [
          node.dataset.id,
          node.getBoundingClientRect().top - contentTop,
        ]),
      );
    };
    const before = localOffsets();
    const beforeKeys = [...before.keys()];

    await act(async () => {
      scroller.scrollTop = 55 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    // The advance commits inside the scroll event, however fast the scroll.
    const after = localOffsets();

    // The context did advance...
    expect([...after.keys()]).to.not.deep.equal(beforeKeys);
    // ...and every carried-over row sits at the exact same offset inside the box.
    const retained = [...after.keys()].filter((id) => before.has(id));
    expect(retained.length).to.be.greaterThan(0);
    for (const id of retained) {
      expect(after.get(id)).to.equal(before.get(id));
    }
  });

  it('keeps sticky positioning inert when all rows fit in the viewport', async () => {
    await renderList({ rows: defaultRows.slice(0, 3) });
    await waitFor(() => {
      expect(getWindowRowIds().length).to.equal(3);
    });
    const windowStyle = screen.getByTestId('window').style;
    expect(windowStyle.top).to.equal('0px');
    expect(windowStyle.bottom).to.equal('0px');
  });

  it('renders the window for a written scroll position without waiting for its scroll event', async () => {
    const apiRef = React.createRef<VirtualizerApi | null>();
    await renderList({ apiRef });
    const scroller = screen.getByTestId('scroller');

    act(() => {
      scroller.scrollTop = 400 * ROW_HEIGHT;
      apiRef.current!.syncScrollPosition();
    });

    expect(getWindowRowIds()).to.include(400);
    expectViewportCovered();
  });

  it('keeps the scroll direction across a written correction', async () => {
    const apiRef = React.createRef<VirtualizerApi | null>();
    await renderList({ apiRef });
    const scroller = screen.getByTestId('scroller');

    await act(async () => {
      scroller.scrollTop = 100 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    // Scrolling down: the whole buffer is allocated below the viewport.
    act(() => {
      scroller.scrollTop = 101 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    const idsScrollingDown = getWindowRowIds();
    expect(Math.min(...idsScrollingDown)).to.be.at.least(100);

    // A correction that moves the position up by a row is not the user scrolling up, so the
    // buffer stays below the viewport rather than moving above it.
    act(() => {
      scroller.scrollTop = 100 * ROW_HEIGHT;
      apiRef.current!.syncScrollPosition();
    });
    expect(Math.min(...getWindowRowIds())).to.be.at.least(99);
    expectViewportCovered();

    // The scroll event the write echoes carries no movement.
    const idsAfterCorrection = getWindowRowIds();
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(getWindowRowIds()).to.deep.equal(idsAfterCorrection);
  });

  it('keeps the window size at the end of the content whichever way the buffer points', async () => {
    await renderList();
    const scroller = screen.getByTestId('scroller');
    const maxScrollTop = ROW_COUNT * ROW_HEIGHT - VIEWPORT_HEIGHT;

    // The settle pass runs a second after the last context update. Fake timers skip the wait,
    // and have to be installed before the scroll that arms it.
    vi.useFakeTimers();
    let sizeScrollingDown: number;
    let sizeSettled: number;
    let sizeScrollingUp: number;
    try {
      // Scrolling down into the end: the leading buffer has no rows left to cover below.
      act(() => {
        scroller.scrollTop = maxScrollTop;
        scroller.dispatchEvent(new Event('scroll'));
      });
      sizeScrollingDown = getWindowRowIds().length;
      expectViewportCovered();

      // The settle pass splits the buffer evenly.
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1100);
      });
      sizeSettled = getWindowRowIds().length;
      expectViewportCovered();

      // Scrolling up allocates the whole buffer above the viewport.
      act(() => {
        scroller.scrollTop = maxScrollTop - ROW_HEIGHT;
        scroller.dispatchEvent(new Event('scroll'));
      });
      sizeScrollingUp = getWindowRowIds().length;
      expectViewportCovered();
    } finally {
      vi.useRealTimers();
    }

    // Each boundary is row-quantized, allowing one row of play per boundary.
    expect(Math.abs(sizeSettled - sizeScrollingDown)).to.be.at.most(2);
    expect(Math.abs(sizeScrollingUp - sizeScrollingDown)).to.be.at.most(2);
  });
});
