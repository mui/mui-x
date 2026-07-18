import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import { useVirtualizer, Virtualization, LayoutGridSticky } from '@mui/x-virtualizer';
import { isJSDOM } from 'test/utils/skipIf';

const ROW_COUNT = 1000;
const COLUMN_COUNT = 20;
const COLUMN_WIDTH = 100;
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;
const VIEWPORT_WIDTH = 600;
// Pin the scrollbar lane in tests: measured scrollbar size is host-dependent (0 on
// overlay-scrollbar systems like macOS, ~15 on Linux CI)
const SCROLLBAR_SIZE = 15;

const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => ({
  field: `col-${index}`,
  computedWidth: COLUMN_WIDTH,
}));
const columnsTotalWidth = COLUMN_COUNT * COLUMN_WIDTH;
const pinnedColumns = { left: [columns[0]], right: [columns[COLUMN_COUNT - 1]] };

const rows = Array.from({ length: ROW_COUNT }, (_, index) => ({
  id: index,
  model: {},
}));
const range = { firstRowIndex: 0, lastRowIndex: rows.length };
const pinnedRows = {
  top: [{ id: 'pinned-top', model: {} }],
  bottom: [{ id: 'pinned-bottom', model: {} }],
};

const cellStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: COLUMN_WIDTH,
  boxSizing: 'border-box',
};

/* Pinned cells are sticky elements in the flow of the row: their constraints resolve
 * against the scrollport, so they compose with the horizontally-sticky window. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'sticky',
  zIndex: 1,
  background: '#eee',
};

function Row(props: {
  id: any;
  height: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
}) {
  const { id, height, firstColumnIndex, lastColumnIndex } = props;

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div key={i} data-col={i} style={cellStyle}>
        {id}:{i}
      </div>,
    );
  }

  return (
    <div
      data-testid="row"
      data-id={id}
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height,
        background: '#fff',
      }}
    >
      <div data-col={0} style={{ ...pinnedCellStyle, left: 0 }}>
        {id}:0
      </div>
      {cells}
      <div data-col={COLUMN_COUNT - 1} style={{ ...pinnedCellStyle, right: 'var(--pinned-right)' }}>
        {id}:{COLUMN_COUNT - 1}
      </div>
    </div>
  );
}

const Scrollbar = React.forwardRef<
  HTMLDivElement,
  { contentStyle?: React.CSSProperties; [key: string]: any }
>(function Scrollbar(props, ref) {
  const { contentStyle, ...other } = props;
  return (
    <div {...other} ref={ref}>
      <div style={contentStyle} />
    </div>
  );
});

function StickyGrid(props: { width?: number; scrollbarSize?: number }) {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
    scrollbarVertical: React.useRef<HTMLDivElement>(null),
    scrollbarHorizontal: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => new LayoutGridSticky(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: ROW_HEIGHT,
      columnsTotalWidth,
      topPinnedHeight: HEADER_HEIGHT,
      leftPinnedWidth: COLUMN_WIDTH,
      rightPinnedWidth: COLUMN_WIDTH,
      scrollbarSize: props.scrollbarSize,
    },
    virtualization: { layoutMode: 'sticky' },

    rows,
    range,
    rowCount: rows.length,
    columns,
    pinnedRows,
    pinnedColumns,

    renderRow: (params) => (
      <Row
        key={params.id}
        id={params.id}
        height={params.baseRowHeight as number}
        firstColumnIndex={params.firstColumnIndex}
        lastColumnIndex={params.lastColumnIndex}
      />
    ),
  });

  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);

  const containerProps = virtualizer.store.use(LayoutGridSticky.selectors.containerProps);
  const scrollerProps = virtualizer.store.use(LayoutGridSticky.selectors.scrollerProps);
  const scrollbarVerticalProps = virtualizer.store.use(
    LayoutGridSticky.selectors.scrollbarVerticalProps,
  );
  const scrollbarHorizontalProps = virtualizer.store.use(
    LayoutGridSticky.selectors.scrollbarHorizontalProps,
  );
  const contentProps = virtualizer.store.use(LayoutGridSticky.selectors.contentProps);
  const topContainerProps = virtualizer.store.use(LayoutGridSticky.selectors.topContainerProps);
  const spacerTopProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerTopProps);
  const spacerLeftProps = virtualizer.store.use(
    LayoutGridSticky.selectors.spacerLeftProps,
    columns,
  );
  const innerContainerProps = virtualizer.store.use(
    LayoutGridSticky.selectors.innerContainerProps,
    columns,
  );
  const windowProps = virtualizer.store.use(LayoutGridSticky.selectors.windowProps);
  const innerWindowProps = virtualizer.store.use(
    LayoutGridSticky.selectors.innerWindowProps,
    columns,
  );
  const spacerBottomProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerBottomProps);
  const bottomContainerProps = virtualizer.store.use(
    LayoutGridSticky.selectors.bottomContainerProps,
  );

  const { getRows } = virtualizer.api.getters;

  const headerCells = [];
  for (let i = renderContext.firstColumnIndex; i < renderContext.lastColumnIndex; i += 1) {
    headerCells.push(
      <div key={i} data-col={i} style={cellStyle}>
        {columns[i].field}
      </div>,
    );
  }

  return (
    <div
      {...containerProps}
      style={{
        ...containerProps.style,
        width: props.width ?? VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      }}
    >
      <div {...scrollerProps} data-testid="scroller">
        <div {...contentProps}>
          <div {...topContainerProps} data-testid="top-container">
            <div {...spacerLeftProps} />
            <div {...innerContainerProps}>
              <div
                data-testid="header"
                style={{
                  position: 'relative',
                  display: 'flex',
                  width: '100%',
                  height: HEADER_HEIGHT,
                  background: '#ddd',
                }}
              >
                <div data-col={0} style={{ ...pinnedCellStyle, left: 0, background: '#ddd' }}>
                  {columns[0].field}
                </div>
                {headerCells}
                <div
                  data-col={COLUMN_COUNT - 1}
                  style={{ ...pinnedCellStyle, right: 'var(--pinned-right)', background: '#ddd' }}
                >
                  {columns[COLUMN_COUNT - 1].field}
                </div>
              </div>
              {getRows({ position: 'top', rows: pinnedRows.top })}
            </div>
          </div>
          <div {...spacerTopProps} />
          <div {...windowProps} data-testid="outer-window">
            <div {...spacerLeftProps} />
            <div {...innerWindowProps} data-testid="window">
              {getRows()}
            </div>
          </div>
          <div {...spacerBottomProps} />
          <div {...bottomContainerProps} data-testid="bottom-container">
            <div {...spacerLeftProps} />
            <div {...innerContainerProps}>
              {getRows({ position: 'bottom', rows: pinnedRows.bottom })}
            </div>
          </div>
        </div>
      </div>
      <Scrollbar data-testid="scrollbar-vertical" {...scrollbarVerticalProps} />
      <Scrollbar data-testid="scrollbar-horizontal" {...scrollbarHorizontalProps} />
    </div>
  );
}

function rect(testId: string) {
  return screen.getByTestId(testId).getBoundingClientRect();
}

/**
 * The lanes reserved by the layout are sized to the measured scrollbar size, which is 0 on platforms with overlay scrollbars.
 * The scrollbar widgets keep a minimum 14px hit area even then, so their rendered size can't be used in lane expectations.
 * Instead, probe the platform size, like `measureScrollbarSize` does.
 */
let measuredScrollbarSize: number | undefined;
function scrollbarSize() {
  if (measuredScrollbarSize === undefined) {
    const probe = document.createElement('div');
    probe.style.width = '99px';
    probe.style.height = '99px';
    probe.style.position = 'absolute';
    probe.style.overflow = 'scroll';
    document.body.appendChild(probe);
    measuredScrollbarSize = probe.offsetWidth - probe.clientWidth;
    document.body.removeChild(probe);
  }
  return measuredScrollbarSize;
}

function expectInnerViewportCovered() {
  const scroller = rect('scroller');
  const topContainer = rect('top-container');
  const bottomContainer = rect('bottom-container');
  const windowRect = rect('window');

  // The pinned containers are pinned to the scrollport edges: the top container at the
  // top, the bottom container above the horizontal scrollbar lane.
  expect(topContainer.top).to.be.closeTo(scroller.top, 1);
  expect(bottomContainer.bottom).to.be.closeTo(scroller.bottom - scrollbarSize(), 1);

  // The window covers the region between them, and horizontally to the vertical lane.
  expect(windowRect.top).to.be.at.most(topContainer.bottom + 0.5);
  expect(windowRect.bottom).to.be.at.least(bottomContainer.top - 0.5);
  expect(windowRect.left).to.be.at.most(scroller.left + 0.5);
  expect(windowRect.right).to.be.at.least(scroller.right - scrollbarSize() - 0.5);
}

function expectPinnedCellsAtEdges(rowId: string | number) {
  const scroller = rect('scroller');
  const row = document.querySelector(`[data-id="${rowId}"]`)!;

  // Pinned cells stay at the viewport edges: pinned-left at the scrollport edge,
  // pinned-right at the inner viewport edge (before the vertical scrollbar lane).
  const pinnedLeft = row.querySelector('[data-col="0"]')!.getBoundingClientRect();
  expect(pinnedLeft.left).to.be.closeTo(scroller.left, 1);
  const pinnedRight = row
    .querySelector(`[data-col="${COLUMN_COUNT - 1}"]`)!
    .getBoundingClientRect();
  expect(pinnedRight.right).to.be.closeTo(scroller.right - scrollbarSize(), 1);
}

function getWindowRowIds() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="window"] [data-testid="row"]'),
  ).map((node) =>
    Number.isNaN(Number(node.dataset.id)) ? node.dataset.id : Number(node.dataset.id),
  );
}

function middleColumnsOf(rowId: string | number) {
  return Array.from(document.querySelectorAll<HTMLElement>(`[data-id="${rowId}"] [data-col]`))
    .map((cell) => Number(cell.dataset.col))
    .filter((col) => col !== 0 && col !== COLUMN_COUNT - 1);
}

describe.skipIf(isJSDOM)('<LayoutGridSticky />', () => {
  const { render } = createRenderer();

  async function renderGrid(props?: { width?: number; scrollbarSize?: number }) {
    const view = render(<StickyGrid {...props} />);
    await waitFor(() => {
      expect(getWindowRowIds().length).to.be.greaterThan(0);
    });
    return view;
  }

  it('renders only a window of rows and columns', async () => {
    await renderGrid();
    expect(getWindowRowIds().length).to.be.lessThan(ROW_COUNT / 10);

    const firstRow = document.querySelector('[data-testid="window"] [data-testid="row"]')!;
    expect(firstRow.children.length).to.be.lessThan(COLUMN_COUNT);

    expectInnerViewportCovered();
  });

  it('renders the column window with directional buffers', async () => {
    await renderGrid({ scrollbarSize: SCROLLBAR_SIZE });
    const scroller = screen.getByTestId('scroller');

    // At scrollLeft = 0, the middle columns extend from the first to the viewport edge
    // (vertical lane excluded) plus the column buffer (150px = 1-2 columns) and the
    // binary-search boundaries.
    const lastVisibleColumn = Math.floor((scroller.clientWidth - SCROLLBAR_SIZE) / COLUMN_WIDTH);
    const middleColumns = middleColumnsOf(0);

    expect(Math.max(...middleColumns)).to.be.at.most(lastVisibleColumn + 5);
    expect(Math.min(...middleColumns)).to.equal(1);
  });

  it('keeps the inner viewport covered when scrolling down past the rendered window', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollTop = 500 * ROW_HEIGHT;

    act(() => {
      scroller.scrollTop = scrollTop;
    });
    // The virtualizer hasn't received the scroll event yet: the stale window and the
    // pinned containers must already be in place through sticky clamping alone.
    expect(getWindowRowIds()).not.to.include(500);
    expectInnerViewportCovered();

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(500);
    });
    expectInnerViewportCovered();

    // Pixel-exact position: flow position of row 500 is
    // topContainerHeight + 500 * ROW_HEIGHT.
    const topContainerHeight = rect('top-container').height;
    const rowRect = document.querySelector('[data-id="500"]')!.getBoundingClientRect();
    expect(rowRect.top - rect('scroller').top).to.be.closeTo(
      topContainerHeight + 500 * ROW_HEIGHT - scrollTop,
      1,
    );
  });

  it('keeps the inner viewport covered when scrolling back up past the rendered window', async () => {
    await renderGrid();
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
    expectInnerViewportCovered();

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(getWindowRowIds()).to.include(250);
    });
    expectInnerViewportCovered();
  });

  it('keeps the latest position when synchronized scroll events are delayed', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollbar = screen.getByTestId('scrollbar-vertical');
    const firstScrollTop = 250 * ROW_HEIGHT;
    const secondScrollTop = 500 * ROW_HEIGHT;
    const thirdScrollTop = 750 * ROW_HEIGHT;
    const fourthScrollTop = 900 * ROW_HEIGHT;

    const verifyDelayedEcho = (source: HTMLElement, target: HTMLElement) => {
      act(() => {
        source.scrollTop = firstScrollTop;
        source.dispatchEvent(new Event('scroll'));
        expect(target.scrollTop).to.equal(firstScrollTop);

        // Process another source event before delivering the target event queued by
        // the first synchronization.
        source.scrollTop = secondScrollTop;
        source.dispatchEvent(new Event('scroll'));
        expect(target.scrollTop).to.equal(secondScrollTop);

        target.dispatchEvent(new Event('scroll'));
      });

      expect(source.scrollTop).to.equal(secondScrollTop);
      expect(target.scrollTop).to.equal(secondScrollTop);

      act(() => {
        source.scrollTop = thirdScrollTop;
        source.dispatchEvent(new Event('scroll'));
        expect(target.scrollTop).to.equal(thirdScrollTop);

        // The latest source position can be applied before its scroll event. The old
        // target echo must not restore the previous position in that window either.
        source.scrollTop = fourthScrollTop;
        target.dispatchEvent(new Event('scroll'));
        expect(source.scrollTop).to.equal(fourthScrollTop);

        source.dispatchEvent(new Event('scroll'));
        expect(target.scrollTop).to.equal(fourthScrollTop);
      });
    };

    verifyDelayedEcho(scroller, scrollbar);
    verifyDelayedEcho(scrollbar, scroller);
  });

  it('keeps pinned columns in place across horizontal scrolling', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollLeft = 8 * COLUMN_WIDTH;

    await act(async () => {
      scroller.scrollLeft = scrollLeft;
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(document.querySelector('[data-id="0"] [data-col="10"]')).not.to.equal(null);
    });

    const scrollerRect = rect('scroller');
    expectPinnedCellsAtEdges(0);

    // Middle cells are at their scrolled position.
    const row = document.querySelector('[data-id="0"]')!;
    const middle = row.querySelector('[data-col="10"]')!.getBoundingClientRect();
    expect(middle.left - scrollerRect.left).to.be.closeTo(10 * COLUMN_WIDTH - scrollLeft, 1);

    // The header and pinned-row cells stay column-aligned with the window cells.
    const headerMiddle = document
      .querySelector('[data-testid="header"] [data-col="10"]')!
      .getBoundingClientRect();
    expect(headerMiddle.left).to.be.closeTo(middle.left, 1);
    const pinnedTopMiddle = document
      .querySelector('[data-id="pinned-top"] [data-col="10"]')!
      .getBoundingClientRect();
    expect(pinnedTopMiddle.left).to.be.closeTo(middle.left, 1);
    const pinnedBottomMiddle = document
      .querySelector('[data-id="pinned-bottom"] [data-col="10"]')!
      .getBoundingClientRect();
    expect(pinnedBottomMiddle.left).to.be.closeTo(middle.left, 1);
  });

  it('keeps the viewport covered when scrolling right past the rendered columns', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollLeft = 8 * COLUMN_WIDTH;

    act(() => {
      scroller.scrollLeft = scrollLeft;
    });
    // The virtualizer hasn't received the scroll event yet: the stale columns and the
    // pinned cells must already cover the viewport through sticky clamping alone.
    // Column 13 is beyond the resting coverage (viewport + trailing buffer + the
    // spilled-over leading buffer) but inside the post-scroll one.
    expect(document.querySelector('[data-id="0"] [data-col="13"]')).to.equal(null);
    expectInnerViewportCovered();
    expectPinnedCellsAtEdges(0);

    // Once the virtualizer catches up, the correct columns are rendered in place.
    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(document.querySelector('[data-id="0"] [data-col="13"]')).not.to.equal(null);
    });
    const scrollerRect = rect('scroller');
    const middle = document.querySelector('[data-id="0"] [data-col="13"]')!.getBoundingClientRect();
    expect(middle.left - scrollerRect.left).to.be.closeTo(13 * COLUMN_WIDTH - scrollLeft, 1);
    expectInnerViewportCovered();
  });

  it('keeps the viewport covered when scrolling left past the rendered columns', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');

    await act(async () => {
      scroller.scrollLeft = 10 * COLUMN_WIDTH;
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(document.querySelector('[data-id="0"] [data-col="12"]')).not.to.equal(null);
    });

    act(() => {
      scroller.scrollLeft = 2 * COLUMN_WIDTH;
    });
    // Leftward clamp: the stale columns still cover the viewport before catch-up.
    expect(document.querySelector('[data-id="0"] [data-col="4"]')).to.equal(null);
    expectInnerViewportCovered();
    expectPinnedCellsAtEdges(0);

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(document.querySelector('[data-id="0"] [data-col="4"]')).not.to.equal(null);
    });
    const scrollerRect = rect('scroller');
    const middle = document.querySelector('[data-id="0"] [data-col="4"]')!.getBoundingClientRect();
    expect(middle.left - scrollerRect.left).to.be.closeTo(4 * COLUMN_WIDTH - 2 * COLUMN_WIDTH, 1);
    expectInnerViewportCovered();
  });

  it('extends the rendered window in the scroll direction (dynamic buffers)', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollTop = 500 * ROW_HEIGHT;

    // The dispatched scroll commits the render synchronously (flushSync), so the
    // directional buffer is read here — before the settle timer collapses it back to
    // a symmetric buffer. The direction (DOWN) is the position delta.
    act(() => {
      scroller.scrollTop = scrollTop;
      scroller.dispatchEvent(new Event('scroll'));
    });

    const ids = getWindowRowIds().filter((id): id is number => typeof id === 'number');
    expect(ids).to.include(500);
    const first = Math.min(...ids);
    const last = Math.max(...ids);

    // The buffer is skewed toward the scroll direction (DOWN): a large buffer below
    // the viewport, a small one above.
    const viewportBottomRow = Math.floor((scrollTop + scroller.clientHeight) / ROW_HEIGHT);
    const rowsAbove = 500 - first;
    const rowsBelow = last - viewportBottomRow;
    expect(rowsBelow).to.be.greaterThan(rowsAbove);
    expect(rowsBelow).to.be.at.least(10);
  });

  it('extends the rendered columns in the scroll direction (dynamic buffers)', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollLeft = 8 * COLUMN_WIDTH;

    // Read synchronously after the dispatched scroll (flushSync), before the settle
    // timer collapses the directional buffer. The direction (RIGHT) is the delta.
    act(() => {
      scroller.scrollLeft = scrollLeft;
      scroller.dispatchEvent(new Event('scroll'));
    });

    const middleColumns = middleColumnsOf(0);
    expect(middleColumns).to.include(10);
    const first = Math.min(...middleColumns);
    const last = Math.max(...middleColumns);

    // The buffer is skewed toward the scroll direction (RIGHT): a buffer after the
    // viewport (300px = 3 columns), a small one before.
    const viewportRightCol = Math.floor(
      (scrollLeft + scroller.clientWidth - scrollbarSize()) / COLUMN_WIDTH,
    );
    const colsBefore = 8 - first;
    const colsAfter = last - viewportRightCol;
    expect(colsAfter).to.be.greaterThan(colsBefore);
    expect(colsAfter).to.be.at.least(2);
  });

  it('keeps the rendered window size constant across scroll direction changes', async () => {
    // Resizing the window layer discards its rasterization wholesale, which the
    // compositor can expose as blank regions at scroll start. The per-axis buffer
    // total is therefore constant: direction changes redistribute it, never resize.
    // The rendered height must stay stable no matter the direction — including at
    // rest at the very top, where the void backward buffer spills forward; each
    // boundary is row-quantized, allowing one row of play per boundary between
    // measurements.
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const heightAtRest = rect('outer-window').height;

    act(() => {
      scroller.scrollTop = 50 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    const heightScrollingDown = rect('outer-window').height;
    expectInnerViewportCovered();

    act(() => {
      scroller.scrollTop = 49 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    const heightScrollingUp = rect('outer-window').height;
    expectInnerViewportCovered();

    // A zero-delta event settles the direction back to NONE: the buffer rebalances
    // to symmetric without resizing the window.
    act(() => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    const heightSettled = rect('outer-window').height;
    expectInnerViewportCovered();

    expect(Math.abs(heightScrollingDown - heightAtRest)).to.be.at.most(2 * ROW_HEIGHT);
    expect(Math.abs(heightScrollingUp - heightScrollingDown)).to.be.at.most(2 * ROW_HEIGHT);
    expect(Math.abs(heightSettled - heightScrollingDown)).to.be.at.most(2 * ROW_HEIGHT);
  });

  it('defers render context updates until the leading buffer runs low', async () => {
    // A context update restarts the window layer's rasterization, so it must not
    // run on every crossed row: after an update, further scrolling within half of
    // the leading buffer (15 rows while moving vertically) keeps the same context.
    await renderGrid();
    const scroller = screen.getByTestId('scroller');

    // Establish the DOWN direction: this first event updates the context (direction
    // change) and allocates the whole vertical buffer below the viewport.
    act(() => {
      scroller.scrollTop = ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    const idsAfterDirectionChange = getWindowRowIds();

    // 5 more rows: far above the old one-row threshold, but well within half of the
    // 15-row leading buffer — the context must not change.
    act(() => {
      scroller.scrollTop = 6 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(getWindowRowIds()).to.deep.equal(idsAfterDirectionChange);

    // Past the rendered buffer: the context must advance.
    act(() => {
      scroller.scrollTop = 30 * ROW_HEIGHT;
      scroller.dispatchEvent(new Event('scroll'));
    });
    expect(getWindowRowIds()).to.include(30);
    expect(getWindowRowIds()).not.to.deep.equal(idsAfterDirectionChange);
  });

  it('keeps the scroller and virtual scrollbar horizontal scroll ranges in sync near the overflow threshold', async () => {
    // Container slightly wider than the columns, classic scrollbars forced (so the
    // geometry is exercised on overlay-scrollbar platforms too): the vertical
    // scrollbar lane makes the columns overflow the inner viewport by less than
    // the lane width. The scroller's scroll range must match the virtual
    // scrollbar's exactly, otherwise the extra range is a dead zone where the
    // widget and the render position no longer follow the scroller.
    await renderGrid({ width: columnsTotalWidth + 10, scrollbarSize: SCROLLBAR_SIZE });
    const scroller = screen.getByTestId('scroller');
    const scrollbar = screen.getByTestId('scrollbar-horizontal');

    const scrollerRange = scroller.scrollWidth - scroller.clientWidth;
    // Guard that the threshold band was actually hit: the axis overflows.
    expect(scrollerRange).to.be.greaterThan(0);
    expect(scrollerRange).to.equal(scrollbar.scrollWidth - scrollbar.clientWidth);
  });
});
