import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import { act, createRenderer, screen, waitFor } from '@mui/internal-test-utils';
import {
  useVirtualizer,
  Virtualization,
  Dimensions,
  LayoutGridSticky,
  computeOffsetLeft,
} from '@mui/x-virtualizer';
import { isJSDOM } from 'test/utils/skipIf';

const ROW_COUNT = 1000;
const COLUMN_COUNT = 20;
const COLUMN_WIDTH = 100;
const ROW_HEIGHT = 48;
const HEADER_HEIGHT = 40;
const VIEWPORT_HEIGHT = 400;
const VIEWPORT_WIDTH = 600;

const columns = Array.from({ length: COLUMN_COUNT }, (_, index) => ({
  field: `col-${index}`,
  computedWidth: COLUMN_WIDTH,
}));
const columnPositions = columns.map((_, index) => index * COLUMN_WIDTH);
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

/* The horizontal axis is controlled: pinned cells are absolutely positioned with
 * JS offsets, since sticky positioning ignores the positioner's transform. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'absolute',
  top: 0,
  height: '100%',
  zIndex: 1,
  background: '#eee',
};

const PinnedOffsetsContext = React.createContext({ left: 0, right: 0 });

function Row(props: {
  id: any;
  height: number;
  offsetLeft: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
}) {
  const { id, height, offsetLeft, firstColumnIndex, lastColumnIndex } = props;
  const offsets = React.useContext(PinnedOffsetsContext);

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div
        key={i}
        data-col={i}
        style={
          i === firstColumnIndex
            ? // `offsetLeft` is relative to the end of the left pinned section; since the
              // pinned cells are out of the flow, add their width back.
              { ...cellStyle, marginLeft: offsetLeft + COLUMN_WIDTH }
            : cellStyle
        }
      >
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
        width: columnsTotalWidth,
        height,
        background: '#fff',
      }}
    >
      <div data-col={0} style={{ ...pinnedCellStyle, left: offsets.left }}>
        {id}:0
      </div>
      {cells}
      <div data-col={COLUMN_COUNT - 1} style={{ ...pinnedCellStyle, right: offsets.right }}>
        {id}:{COLUMN_COUNT - 1}
      </div>
    </div>
  );
}

function StickyGrid() {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
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
    },
    virtualization: {},

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
        offsetLeft={params.offsetLeft}
        firstColumnIndex={params.firstColumnIndex}
        lastColumnIndex={params.lastColumnIndex}
      />
    ),
  });

  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);
  const headerOffsetLeft = computeOffsetLeft(
    columnPositions,
    renderContext,
    pinnedColumns.left.length,
    'controlled',
  );

  const containerProps = virtualizer.store.use(LayoutGridSticky.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutGridSticky.selectors.contentProps);
  const topContainerProps = virtualizer.store.use(LayoutGridSticky.selectors.topContainerProps);
  const spacerTopProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerTopProps);
  const windowProps = virtualizer.store.use(LayoutGridSticky.selectors.windowProps);
  const spacerBottomProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerBottomProps);
  const bottomContainerProps = virtualizer.store.use(
    LayoutGridSticky.selectors.bottomContainerProps,
  );
  const positionerProps = virtualizer.store.use(LayoutGridSticky.selectors.positionerProps);

  const scrollPosition = virtualizer.store.use(Virtualization.selectors.scrollPosition);
  const dimensions = virtualizer.store.use(Dimensions.selectors.dimensions);
  const pinnedOffsets = React.useMemo(
    () => ({
      left: scrollPosition.current.left,
      right: Math.max(
        0,
        columnsTotalWidth - dimensions.viewportInnerSize.width - scrollPosition.current.left,
      ),
    }),
    [scrollPosition, dimensions],
  );

  const { getRows } = virtualizer.api.getters;

  const headerCells = [];
  for (let i = renderContext.firstColumnIndex; i < renderContext.lastColumnIndex; i += 1) {
    headerCells.push(
      <div
        key={i}
        data-col={i}
        style={
          i === renderContext.firstColumnIndex
            ? { ...cellStyle, marginLeft: headerOffsetLeft }
            : cellStyle
        }
      >
        {columns[i].field}
      </div>,
    );
  }

  return (
    <PinnedOffsetsContext.Provider value={pinnedOffsets}>
      <div
        {...containerProps}
        data-testid="scroller"
        style={{
          ...containerProps.style,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          overflow: 'auto',
        }}
      >
        <div {...contentProps}>
          <div {...topContainerProps} data-testid="top-container">
            <div {...positionerProps}>
              <div
                data-testid="header"
                style={{
                  position: 'relative',
                  display: 'flex',
                  width: columnsTotalWidth,
                  height: HEADER_HEIGHT,
                  background: '#ddd',
                }}
              >
                <div
                  data-col={0}
                  style={{ ...pinnedCellStyle, left: pinnedOffsets.left, background: '#ddd' }}
                >
                  {columns[0].field}
                </div>
                {headerCells}
                <div
                  data-col={COLUMN_COUNT - 1}
                  style={{ ...pinnedCellStyle, right: pinnedOffsets.right, background: '#ddd' }}
                >
                  {columns[COLUMN_COUNT - 1].field}
                </div>
              </div>
              {getRows({ position: 'top', rows: pinnedRows.top })}
            </div>
          </div>
          <div {...spacerTopProps} />
          <div {...windowProps} data-testid="window">
            <div {...positionerProps}>{getRows()}</div>
          </div>
          <div {...spacerBottomProps} />
          <div {...bottomContainerProps} data-testid="bottom-container">
            <div {...positionerProps}>
              {getRows({ position: 'bottom', rows: pinnedRows.bottom })}
            </div>
          </div>
        </div>
      </div>
    </PinnedOffsetsContext.Provider>
  );
}

function rect(testId: string) {
  return screen.getByTestId(testId).getBoundingClientRect();
}

function expectInnerViewportCovered() {
  const scroller = rect('scroller');
  const topContainer = rect('top-container');
  const bottomContainer = rect('bottom-container');
  const windowRect = rect('window');

  // The pinned containers are themselves pinned to the scrollport edges.
  expect(topContainer.top).to.be.closeTo(scroller.top, 1);
  expect(bottomContainer.bottom).to.be.closeTo(
    scroller.top + screen.getByTestId('scroller').clientHeight,
    1,
  );

  // The window covers the region between them.
  expect(windowRect.top).to.be.at.most(topContainer.bottom + 0.5);
  expect(windowRect.bottom).to.be.at.least(bottomContainer.top - 0.5);
}

function renderedRowIds() {
  return Array.from(
    document.querySelectorAll<HTMLElement>('[data-testid="window"] [data-testid="row"]'),
  ).map((node) =>
    Number.isNaN(Number(node.dataset.id)) ? node.dataset.id : Number(node.dataset.id),
  );
}

describe.skipIf(isJSDOM)('<LayoutGridSticky />', () => {
  const { render } = createRenderer();

  async function renderGrid() {
    const view = render(<StickyGrid />);
    await waitFor(() => {
      expect(renderedRowIds().length).to.be.greaterThan(0);
    });
    return view;
  }

  it('renders only a window of rows and columns', async () => {
    await renderGrid();
    expect(renderedRowIds().length).to.be.lessThan(ROW_COUNT / 10);

    const firstRow = document.querySelector('[data-testid="window"] [data-testid="row"]')!;
    expect(firstRow.children.length).to.be.lessThan(COLUMN_COUNT);

    expectInnerViewportCovered();
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
    expect(renderedRowIds()).not.to.include(500);
    expectInnerViewportCovered();

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(renderedRowIds()).to.include(500);
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
      expect(renderedRowIds()).to.include(500);
    });

    const scrollTop = 250 * ROW_HEIGHT;
    act(() => {
      scroller.scrollTop = scrollTop;
    });
    expect(renderedRowIds()).not.to.include(250);
    expectInnerViewportCovered();

    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(renderedRowIds()).to.include(250);
    });
    expectInnerViewportCovered();
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
    const row = document.querySelector('[data-id="0"]')!;

    // Pinned cells stay at the scrollport edges.
    const pinnedLeft = row.querySelector('[data-col="0"]')!.getBoundingClientRect();
    expect(pinnedLeft.left).to.be.closeTo(scrollerRect.left, 1);
    const pinnedRight = row
      .querySelector(`[data-col="${COLUMN_COUNT - 1}"]`)!
      .getBoundingClientRect();
    expect(pinnedRight.right).to.be.closeTo(scrollerRect.left + scroller.clientWidth, 1);

    // Middle cells are at their scrolled position.
    const middle = row.querySelector('[data-col="10"]')!.getBoundingClientRect();
    expect(middle.left - scrollerRect.left).to.be.closeTo(10 * COLUMN_WIDTH - scrollLeft, 1);

    // The header is virtualized with the same context.
    expect(document.querySelector('[data-testid="header"] [data-col="10"]')).not.to.equal(null);
  });

  it('keeps the viewport covered when scrolling right past the rendered columns', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');

    const before = document.querySelector('[data-id="0"] [data-col="3"]')!.getBoundingClientRect();

    act(() => {
      scroller.scrollLeft = 8 * COLUMN_WIDTH;
    });
    // Horizontal axis is controlled: until the virtualizer receives the scroll event,
    // nothing moves — the previously rendered columns still cover the viewport
    // (stale content, no gap).
    const after = document.querySelector('[data-id="0"] [data-col="3"]')!.getBoundingClientRect();
    expect(after.left).to.be.closeTo(before.left, 1);

    const windowRect = rect('window');
    const scrollerRect = rect('scroller');
    expect(windowRect.left).to.be.closeTo(scrollerRect.left, 1);
    expect(windowRect.width).to.be.closeTo(scroller.clientWidth, 1);

    // Once the virtualizer catches up, the correct columns are rendered in place.
    await act(async () => {
      scroller.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => {
      expect(document.querySelector('[data-id="0"] [data-col="10"]')).not.to.equal(null);
    });
    const middle = document.querySelector('[data-id="0"] [data-col="10"]')!.getBoundingClientRect();
    expect(middle.left - scrollerRect.left).to.be.closeTo(10 * COLUMN_WIDTH - 8 * COLUMN_WIDTH, 1);
  });

  it('extends the rendered window in the scroll direction (dynamic buffers)', async () => {
    await renderGrid();
    const scroller = screen.getByTestId('scroller');
    const scrollTop = 500 * ROW_HEIGHT;

    // No manual dispatch: let the natural scroll event drive the update so the
    // scroll direction is detected as DOWN.
    act(() => {
      scroller.scrollTop = scrollTop;
    });
    await waitFor(() => {
      expect(renderedRowIds()).to.include(500);
    });

    const ids = renderedRowIds().filter((id): id is number => typeof id === 'number');
    const first = Math.min(...ids);
    const last = Math.max(...ids);

    // Scrolling down: almost no buffer above the viewport...
    expect(first).to.be.at.least(500 - 2);
    // ...and a large buffer below it (15 rows in the scroll direction).
    const viewportBottom = scrollTop + scroller.clientHeight;
    expect((last + 1) * ROW_HEIGHT).to.be.at.least(viewportBottom + 10 * ROW_HEIGHT);
  });
});
