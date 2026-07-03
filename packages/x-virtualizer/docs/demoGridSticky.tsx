import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  useVirtualizer,
  Virtualizer,
  Virtualization,
  Dimensions,
  LayoutGridSticky,
  computeOffsetLeft,
} from '@mui/x-virtualizer';

const ROW_COUNT = 100_000;
const COLUMN_COUNT = 40;
const COLUMN_WIDTH = 120;
const ROW_HEIGHT = 40;
const HEADER_HEIGHT = 40;

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

/* The horizontal axis is controlled: pinned cells are absolutely positioned with
 * JS offsets, since sticky positioning ignores the positioner's transform. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'absolute',
  top: 0,
  height: '100%',
  zIndex: 1,
  background: '#f5f5f5',
};

const rowStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  width: columnsTotalWidth,
  height: ROW_HEIGHT,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${borderColor}`,
  background: '#fff',
};

const VirtualizerContext = React.createContext(null as unknown as Virtualizer);

const PinnedOffsetsContext = React.createContext({ left: 0, right: 0 });

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

function Row(props: {
  id: any;
  offsetLeft: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
  background?: string;
}) {
  const { id, offsetLeft, firstColumnIndex, lastColumnIndex, background } = props;
  const offsets = React.useContext(PinnedOffsetsContext);

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div
        key={i}
        style={
          i === firstColumnIndex
            ? // `offsetLeft` is relative to the end of the left pinned section; since the
              // pinned cells are out of the flow, add their width back.
              { ...cellStyle, marginLeft: offsetLeft + COLUMN_WIDTH }
            : cellStyle
        }
      >
        {id} × {i}
      </div>,
    );
  }

  const pinnedStyle = background ? { ...pinnedCellStyle, background } : pinnedCellStyle;

  return (
    <div style={background ? { ...rowStyle, background } : rowStyle}>
      <div style={{ ...pinnedStyle, left: offsets.left }}>{id} × 0</div>
      {cells}
      <div style={{ ...pinnedStyle, right: offsets.right }}>
        {id} × {COLUMN_COUNT - 1}
      </div>
    </div>
  );
}

function HeaderRow() {
  const virtualizer = React.useContext(VirtualizerContext);
  const offsets = React.useContext(PinnedOffsetsContext);
  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);
  const offsetLeft = computeOffsetLeft(
    columnPositions,
    renderContext,
    pinnedColumns.left.length,
    'controlled',
  );

  const cells = [];
  for (let i = renderContext.firstColumnIndex; i < renderContext.lastColumnIndex; i += 1) {
    cells.push(
      <div
        key={i}
        style={
          i === renderContext.firstColumnIndex
            ? { ...cellStyle, marginLeft: offsetLeft, fontWeight: 600 }
            : { ...cellStyle, fontWeight: 600 }
        }
      >
        {columns[i].field}
      </div>,
    );
  }

  const headerCellStyle = { ...pinnedCellStyle, fontWeight: 600, background: '#e8e8e8' };

  return (
    <div style={{ ...rowStyle, height: HEADER_HEIGHT, background: '#e8e8e8' }}>
      <div style={{ ...headerCellStyle, left: offsets.left }}>{columns[0].field}</div>
      {cells}
      <div style={{ ...headerCellStyle, right: offsets.right }}>
        {columns[COLUMN_COUNT - 1].field}
      </div>
    </div>
  );
}

function Grid() {
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
        offsetLeft={params.offsetLeft}
        firstColumnIndex={params.firstColumnIndex}
        lastColumnIndex={params.lastColumnIndex}
        background={typeof params.id === 'string' ? '#fff8e0' : undefined}
      />
    ),
  });

  useJank(refs.scroller);

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

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      <PinnedOffsetsContext.Provider value={pinnedOffsets}>
        <Box
          {...containerProps}
          sx={{
            height: 480,
            overflow: 'auto',
            border: `1px solid ${borderColor}`,
            borderRadius: 1,
            background: '#fff',
            color: '#000',
            fontFamily: 'monospace',
            fontSize: 13,
          }}
        >
          <div className="Grid--content" {...contentProps}>
            <div className="Grid--topContainer" {...topContainerProps}>
              <div {...positionerProps}>
                <HeaderRow />
                {getRows({ position: 'top', rows: pinnedRows.top })}
              </div>
            </div>
            <div className="Grid--spacerTop" {...spacerTopProps} />
            <div className="Grid--window" {...windowProps}>
              <div {...positionerProps}>{getRows()}</div>
            </div>
            <div className="Grid--spacerBottom" {...spacerBottomProps} />
            <div className="Grid--bottomContainer" {...bottomContainerProps}>
              <div {...positionerProps}>
                {getRows({ position: 'bottom', rows: pinnedRows.bottom })}
              </div>
            </div>
          </div>
        </Box>
      </PinnedOffsetsContext.Provider>
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
