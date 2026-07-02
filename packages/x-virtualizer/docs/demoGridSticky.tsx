import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  useVirtualizer,
  Virtualizer,
  Virtualization,
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

const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'sticky',
  zIndex: 1,
  background: '#f5f5f5',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  width: columnsTotalWidth,
  height: ROW_HEIGHT,
  boxSizing: 'border-box',
  borderBottom: `1px solid ${borderColor}`,
  background: '#fff',
};

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

function Row(props: {
  id: any;
  offsetLeft: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
  background?: string;
}) {
  const { id, offsetLeft, firstColumnIndex, lastColumnIndex, background } = props;

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div
        key={i}
        style={i === firstColumnIndex ? { ...cellStyle, marginLeft: offsetLeft } : cellStyle}
      >
        {id} × {i}
      </div>,
    );
  }

  const pinnedStyle = background ? { ...pinnedCellStyle, background } : pinnedCellStyle;

  return (
    <div style={background ? { ...rowStyle, background } : rowStyle}>
      <div style={{ ...pinnedStyle, left: 0 }}>{id} × 0</div>
      {cells}
      <div style={{ ...pinnedStyle, right: 0, marginLeft: 'auto' }}>
        {id} × {COLUMN_COUNT - 1}
      </div>
    </div>
  );
}

function HeaderRow() {
  const virtualizer = React.useContext(VirtualizerContext);
  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);
  const offsetLeft = computeOffsetLeft(columnPositions, renderContext, pinnedColumns.left.length);

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

  const headerCellStyle = { ...pinnedCellStyle, fontWeight: 600 };

  return (
    <div style={{ ...rowStyle, height: HEADER_HEIGHT, background: '#e8e8e8' }}>
      <div style={{ ...headerCellStyle, left: 0, background: '#e8e8e8' }}>{columns[0].field}</div>
      {cells}
      <div style={{ ...headerCellStyle, right: 0, marginLeft: 'auto', background: '#e8e8e8' }}>
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

  const { getRows } = virtualizer.api.getters;

  return (
    <VirtualizerContext.Provider value={virtualizer}>
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
            <HeaderRow />
            {getRows({ position: 'top', rows: pinnedRows.top })}
          </div>
          <div className="Grid--spacerTop" {...spacerTopProps} />
          <div className="Grid--window" {...windowProps}>
            {getRows()}
          </div>
          <div className="Grid--spacerBottom" {...spacerBottomProps} />
          <div className="Grid--bottomContainer" {...bottomContainerProps}>
            {getRows({ position: 'bottom', rows: pinnedRows.bottom })}
          </div>
        </div>
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
