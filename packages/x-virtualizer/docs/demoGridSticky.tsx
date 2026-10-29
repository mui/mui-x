import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { Virtualizer } from '@mui/x-virtualizer';
import {
  useVirtualizer,
  Virtualization,
  Dimensions,
  LayoutGridSticky,
  useScrollUnderlay,
} from '@mui/x-virtualizer';
import { clone, createItemsBox, pickTypical } from './underlay';

const ROW_COUNT = 100_000;
const COLUMN_COUNT = 40;
const COLUMN_WIDTH = 120;
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;

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

const borderColor = '#c4c4c4';

const cellStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: COLUMN_WIDTH,
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  paddingLeft: 8,
  borderRight: `1px solid ${borderColor}`,
  overflow: 'hidden',
  whiteSpace: 'nowrap',
};

/* Pinned cells of the header and the pinned rows are sticky elements in the flow of the
 * row: their constraints resolve against the scrollport, so they compose with the
 * horizontally-sticky window. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'sticky',
  zIndex: 1,
  background: '#f5f5f5',
};

// Holds a pinned cell's place in a window row: `PinnedColumns` draws the cell.
const pinnedPlaceholderStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: COLUMN_WIDTH,
};

/* Covers the scrollbar lane in the top band — the only region the lane mask keeps
 * visible at full width (see `scrollerStyle`) — where unpinned cells passing
 * beneath would otherwise show through the strip beyond the pinned-right column.
 * Sticky like the pinned cells, so it holds the scrollport edge; collapses with
 * the lane on overlay-scrollbar hosts. */
const laneFillerStyle: React.CSSProperties = {
  flex: '0 0 var(--lane-right, 0px)',
  position: 'sticky',
  right: 0,
  zIndex: 1,
};

const rowStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  width: '100%',
  height: ROW_HEIGHT,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${borderColor}`,
  background: '#fff',
};

const headerRowStyle: React.CSSProperties = {
  ...rowStyle,
  height: HEADER_HEIGHT,
  background: '#e8e8e8',
};
const headerCellStyle: React.CSSProperties = { ...cellStyle, fontWeight: 600 };
const headerPinnedStyle: React.CSSProperties = {
  ...pinnedCellStyle,
  fontWeight: 600,
  background: '#e8e8e8',
};

/* The container's own border closes the grid on the right and at the bottom. A reserved
 * scrollbar lane keeps the content clear of it, but the lane collapses to 0 where the
 * platform uses overlay scrollbars — the last column's and last row's trailing borders
 * then land right on the container's and stack into one 2px line. Scale them with the
 * lane so they disappear exactly when it does. */
const lastColumnStyle: React.CSSProperties = {
  borderRightWidth: 'min(1px, var(--lane-right, 0px))',
};
const lastRowStyle: React.CSSProperties = {
  borderBottomWidth: 'min(1px, var(--lane-bottom, 0px))',
};

// A pinned cell with its row's bottom border, as the pinned columns stack them.
const stackedCellStyle: React.CSSProperties = {
  ...cellStyle,
  height: ROW_HEIGHT,
  borderBottom: `1px solid ${borderColor}`,
  background: '#f5f5f5',
};
const stackedLastCellStyle: React.CSSProperties = { ...stackedCellStyle, ...lastColumnStyle };

// Zero height, so the rows still start at its top; the columns overflow it.
const pinnedColumnsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  height: 0,
};
// Sticky like the pinned cells, so they hold the same place.
const pinnedLeftColumnStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: COLUMN_WIDTH,
  position: 'sticky',
  left: 0,
  zIndex: 1,
};
const pinnedRightColumnStyle: React.CSSProperties = {
  flex: '0 0 auto',
  width: COLUMN_WIDTH,
  position: 'sticky',
  right: 'var(--pinned-right)',
  zIndex: 1,
};

const containerSx = {
  height: 480,
  border: `1px solid ${borderColor}`,
  borderRadius: 1,
  background: '#fff',
  color: '#000',
  fontFamily: 'monospace',
  fontSize: 13,
};
const scrollerSx = { '&::-webkit-scrollbar': { display: 'none' } };

const VirtualizerContext = React.createContext(null as unknown as Virtualizer);

const JankContext = React.createContext({ current: false });

/** Burns the main thread on each scroll event to simulate the virtualizer
 * falling behind the scroll position. */
function useJank(scroller: React.RefObject<HTMLDivElement | null>) {
  const jank = React.useContext(JankContext);
  React.useEffect(() => {
    const node = scroller.current;
    if (!node) {
      return undefined;
    }
    const onScroll = () => {
      if (jank.current) {
        const start = performance.now();
        while (performance.now() - start < 100) {
          /* burn */
        }
      }
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, [scroller, jank]);
}

const Row = React.memo(function Row(props: {
  id: any;
  firstColumnIndex: number;
  lastColumnIndex: number;
  background?: string;
  isLastRow?: boolean;
  laneFiller?: boolean;
  isPinnedRow?: boolean;
}) {
  const { id, firstColumnIndex, lastColumnIndex, background, isLastRow, laneFiller, isPinnedRow } =
    props;

  // `data-colindex` and `data-rowindex` (window rows only) let `getUnderlayRows` find the cells.
  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div key={i} style={cellStyle} data-colindex={i}>
        {id} × {i}
      </div>,
    );
  }

  const pinnedStyle = background ? { ...pinnedCellStyle, background } : pinnedCellStyle;
  const base = isLastRow ? { ...rowStyle, ...lastRowStyle } : rowStyle;

  return (
    <div
      style={background ? { ...base, background } : base}
      data-rowindex={isPinnedRow ? undefined : id}
    >
      {isPinnedRow ? (
        <div style={{ ...pinnedStyle, left: 0 }}>{id} × 0</div>
      ) : (
        <div style={pinnedPlaceholderStyle} />
      )}
      {cells}
      {isPinnedRow ? (
        <div style={{ ...pinnedStyle, ...lastColumnStyle, right: 'var(--pinned-right)' }}>
          {id} × {COLUMN_COUNT - 1}
        </div>
      ) : (
        <div style={pinnedPlaceholderStyle} />
      )}
      {laneFiller ? <div style={{ ...laneFillerStyle, background }} /> : null}
    </div>
  );
});

const HeaderCells = React.memo(function HeaderCells(props: {
  firstColumnIndex: number;
  lastColumnIndex: number;
}) {
  const { firstColumnIndex, lastColumnIndex } = props;

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div key={i} style={headerCellStyle}>
        {columns[i].field}
      </div>,
    );
  }

  return (
    <div style={headerRowStyle}>
      <div style={{ ...headerPinnedStyle, left: 0 }}>{columns[0].field}</div>
      {cells}
      <div style={{ ...headerPinnedStyle, ...lastColumnStyle, right: 'var(--pinned-right)' }}>
        {columns[COLUMN_COUNT - 1].field}
      </div>
      <div style={{ ...laneFillerStyle, background: '#e8e8e8' }} />
    </div>
  );
});

const HeaderRow = React.memo(function HeaderRow() {
  const virtualizer = React.useContext(VirtualizerContext);
  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);

  return (
    <HeaderCells
      firstColumnIndex={renderContext.firstColumnIndex}
      lastColumnIndex={renderContext.lastColumnIndex}
    />
  );
});

// The window rows' pinned cells, as one sticky column per side. A sticky cell per row is a
// layer per cell, which Chrome rasterizes after its row, so on a fast scroll a drawn row
// can show without its pinned cells. First in the window content, with a z-index, so the
// columns paint over the rows' unpinned cells. Anchored like the rows: the pad holds each
// cell at a fixed offset in its column, so an update repaints only the cells it adds.
const PinnedColumns = React.memo(function PinnedColumns() {
  const virtualizer = React.useContext(VirtualizerContext);
  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);
  const windowContentProps = virtualizer.store.use(LayoutGridSticky.selectors.windowContentProps);
  const padTop = windowContentProps.style.paddingTop as number;

  const left = [];
  const right = [];
  const lastRowIndex = Math.min(renderContext.lastRowIndex, rows.length);
  for (let index = renderContext.firstRowIndex; index < lastRowIndex; index += 1) {
    const { id } = rows[index];
    left.push(
      <div key={id} style={stackedCellStyle} data-colindex={0}>
        {id} × 0
      </div>,
    );
    right.push(
      <div key={id} style={stackedLastCellStyle} data-colindex={COLUMN_COUNT - 1}>
        {id} × {COLUMN_COUNT - 1}
      </div>,
    );
  }

  const anchorStyle = { marginTop: -padTop, paddingTop: padTop };
  return (
    <div style={pinnedColumnsStyle}>
      <div style={{ ...pinnedLeftColumnStyle, ...anchorStyle }}>{left}</div>
      {/* The unpinned cells' width, so the right column starts where its placeholders do. */}
      <div style={{ flex: 1 }} />
      <div style={{ ...pinnedRightColumnStyle, ...anchorStyle }}>{right}</div>
    </div>
  );
});

// The underlay content (see `useScrollUnderlay`): copies of a rendered row, each cell
// swapped for a copy of a rendered cell of its column, picked per column among those of
// typical width, so no underlay row repeats a real one. The pinned columns' cells stack at
// their side.
function getUnderlayRows(windowContent: HTMLElement, scroller: HTMLElement, count: number) {
  const rowElements = windowContent.querySelectorAll<HTMLElement>('[data-rowindex]');
  if (rowElements.length === 0) {
    return null;
  }
  const cellsByColumn = new Map<number, HTMLElement[]>();
  windowContent.querySelectorAll<HTMLElement>('[data-colindex]').forEach((cell) => {
    const column = Number(cell.dataset.colindex);
    const cells = cellsByColumn.get(column);
    if (cells) {
      cells.push(cell);
    } else {
      cellsByColumn.set(column, [cell]);
    }
  });
  const picks = new Map<number, HTMLElement[]>();
  cellsByColumn.forEach((cells, column) => picks.set(column, pickTypical(cells, count)));

  const underlayRows = createItemsBox(rowElements[0], scroller);
  for (let index = 0; index < count; index += 1) {
    const underlayRow = clone(rowElements[0]);
    underlayRow.querySelectorAll<HTMLElement>('[data-colindex]').forEach((cell) => {
      const pick = picks.get(Number(cell.dataset.colindex));
      if (pick) {
        cell.replaceWith(clone(pick[index]));
      }
    });
    underlayRows.append(underlayRow);
  }

  const pinnedColumn = (column: number, side: 'insetInlineStart' | 'insetInlineEnd') => {
    const stack = windowContent.ownerDocument.createElement('div');
    stack.style.position = 'absolute';
    stack.style.top = '0';
    stack.style[side] = '0';
    picks.get(column)?.forEach((cell) => stack.append(clone(cell)));
    return stack;
  };
  return {
    content: [underlayRows],
    pinned: [pinnedColumn(0, 'insetInlineStart'), pinnedColumn(COLUMN_COUNT - 1, 'insetInlineEnd')],
  };
}

// The geometry is derived from the dimensions the grid already reads: the widget
// collapses to 0 on a non-scrolling axis, so the scrollbar-size probe can still measure inside it.
const Scrollbar = React.memo(function Scrollbar(props: {
  position: 'vertical' | 'horizontal';
  dimensions: any;
  [key: string]: any;
}) {
  const { position, dimensions, ...other } = props;
  // On platforms with overlay scrollbars the measured size is 0: the lane
  // collapses but the floating widget still needs a hit area.
  const size = Math.max(dimensions.scrollbarSize, 14);
  const style: React.CSSProperties =
    position === 'vertical'
      ? {
          position: 'absolute',
          top: dimensions.topContainerHeight,
          right: 0,
          bottom: dimensions.hasScrollX ? dimensions.scrollbarSize : 0,
          width: dimensions.hasScrollY ? size : 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          zIndex: 3,
        }
      : {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: dimensions.hasScrollY ? dimensions.scrollbarSize : 0,
          height: dimensions.hasScrollX ? size : 0,
          overflowX: 'auto',
          overflowY: 'hidden',
          zIndex: 3,
        };
  const contentStyle: React.CSSProperties =
    position === 'vertical'
      ? {
          width: 1,
          height: dimensions.hasScrollY
            ? dimensions.contentSize.height + dimensions.bottomContainerHeight
            : 0,
        }
      : {
          height: 1,
          width: dimensions.hasScrollX ? dimensions.columnsTotalWidth : 0,
        };
  return (
    <div {...other} aria-hidden style={style}>
      <div style={contentStyle} />
    </div>
  );
});

function Grid() {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
    scrollbarVertical: React.useRef<HTMLDivElement>(null),
    scrollbarHorizontal: React.useRef<HTMLDivElement>(null),
  };
  const windowContentRef = React.useRef<HTMLDivElement>(null);
  const underlayRef = React.useRef<HTMLDivElement>(null);
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
        firstColumnIndex={params.firstColumnIndex}
        lastColumnIndex={params.lastColumnIndex}
        background={typeof params.id === 'string' ? '#fff8e0' : undefined}
        isLastRow={params.id === 'pinned-bottom'}
        laneFiller={params.id === 'pinned-top'}
        isPinnedRow={typeof params.id === 'string'}
      />
    ),
  });

  useJank(refs.scroller);
  useScrollUnderlay({
    scrollerRef: refs.scroller,
    underlayRef,
    itemHeight: ROW_HEIGHT,
    itemCount: rows.length,
    getUnderlayContent: ({ itemCount }) =>
      windowContentRef.current && refs.scroller.current
        ? getUnderlayRows(windowContentRef.current, refs.scroller.current, itemCount)
        : null,
  });

  const containerProps = virtualizer.store.use(LayoutGridSticky.selectors.containerProps);
  const dimensions = virtualizer.store.use(Dimensions.selectors.dimensions);
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
  const windowContentProps = virtualizer.store.use(LayoutGridSticky.selectors.windowContentProps);
  const spacerBottomProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerBottomProps);
  const bottomContainerProps = virtualizer.store.use(
    LayoutGridSticky.selectors.bottomContainerProps,
  );

  const { getRows } = virtualizer.api.getters;

  // The reserved lanes, published to the trailing borders (see `lastColumnStyle`).
  const containerStyle = React.useMemo(
    () =>
      ({
        ...containerProps.style,
        '--lane-right': `${dimensions.hasScrollY ? dimensions.scrollbarSize : 0}px`,
        '--lane-bottom': `${dimensions.hasScrollX ? dimensions.scrollbarSize : 0}px`,
      }) as React.CSSProperties,
    [containerProps.style, dimensions],
  );

  const scrollerStyle = React.useMemo(() => {
    const laneRight = dimensions.hasScrollY ? dimensions.scrollbarSize : 0;
    const laneBottom = dimensions.hasScrollX ? dimensions.scrollbarSize : 0;
    if (laneRight === 0 && laneBottom === 0) {
      return scrollerProps.style;
    }
    const top = dimensions.topContainerHeight;
    return {
      ...scrollerProps.style,
      maskImage: 'linear-gradient(#000, #000), linear-gradient(#000, #000)',
      maskSize: `100% ${top}px, calc(100% - ${laneRight}px) calc(100% - ${top + laneBottom}px)`,
      maskPosition: `0 0, 0 ${top}px`,
      maskRepeat: 'no-repeat, no-repeat',
    } as React.CSSProperties;
  }, [scrollerProps.style, dimensions]);

  // Behind the scroller, over the rows: between the top and bottom containers, clear of the
  // scrollbar lanes.
  const underlayStyle = React.useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top: dimensions.topContainerHeight,
      bottom:
        dimensions.bottomContainerHeight + (dimensions.hasScrollX ? dimensions.scrollbarSize : 0),
      left: 0,
      right: dimensions.hasScrollY ? dimensions.scrollbarSize : 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }),
    [dimensions],
  );

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      <Box {...containerProps} style={containerStyle} sx={containerSx}>
        <div className="Grid--underlay" ref={underlayRef} style={underlayStyle} />
        <Box className="Grid--scroller" {...scrollerProps} style={scrollerStyle} sx={scrollerSx}>
          <div className="Grid--content" {...contentProps}>
            <div className="Grid--topContainer" {...topContainerProps}>
              <div {...spacerLeftProps} />
              <div className="Grid--innerContainer" {...innerContainerProps}>
                <HeaderRow />
                {getRows({ position: 'top', rows: pinnedRows.top })}
              </div>
            </div>
            <div className="Grid--spacerTop" {...spacerTopProps} />
            <div className="Grid--window" {...windowProps}>
              <div {...spacerLeftProps} />
              <div className="Grid--innerWindow" {...innerWindowProps}>
                <div className="Grid--windowContent" {...windowContentProps} ref={windowContentRef}>
                  <PinnedColumns />
                  {getRows()}
                </div>
              </div>
            </div>
            <div className="Grid--spacerBottom" {...spacerBottomProps} />
            <div className="Grid--bottomContainer" {...bottomContainerProps}>
              <div {...spacerLeftProps} />
              <div className="Grid--innerContainer" {...innerContainerProps}>
                {getRows({ position: 'bottom', rows: pinnedRows.bottom })}
              </div>
            </div>
          </div>
        </Box>
        <Scrollbar
          position="vertical"
          className="Grid--scrollbarVertical"
          dimensions={dimensions}
          {...scrollbarVerticalProps}
        />
        <Scrollbar
          position="horizontal"
          className="Grid--scrollbarHorizontal"
          dimensions={dimensions}
          {...scrollbarHorizontalProps}
        />
      </Box>
    </VirtualizerContext.Provider>
  );
}

export default function VirtualizerGridSticky() {
  const jank = React.useRef(false);

  return (
    <JankContext.Provider value={jank}>
      <FormControlLabel
        control={
          <Checkbox
            onChange={(event) => {
              jank.current = event.target.checked;
            }}
          />
        }
        label="Simulate main-thread jank on scroll (100ms per scroll event)"
      />
      <Grid />
    </JankContext.Provider>
  );
}
