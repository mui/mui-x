import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useVirtualizer, Virtualizer, Virtualization, LayoutGridSticky } from '@mui/x-virtualizer';

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

/* Pinned cells are sticky elements in the flow of the row: their constraints resolve
 * against the scrollport, so they compose with the horizontally-sticky window. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'sticky',
  zIndex: 1,
  background: '#f5f5f5',
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
}) {
  const { id, firstColumnIndex, lastColumnIndex, background } = props;

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div key={i} style={cellStyle}>
        {id} × {i}
      </div>,
    );
  }

  const pinnedStyle = background ? { ...pinnedCellStyle, background } : pinnedCellStyle;

  return (
    <div style={background ? { ...rowStyle, background } : rowStyle}>
      <div style={{ ...pinnedStyle, left: 0 }}>{id} × 0</div>
      {cells}
      <div style={{ ...pinnedStyle, right: 'var(--pinned-right)' }}>
        {id} × {COLUMN_COUNT - 1}
      </div>
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
      <div style={{ ...headerPinnedStyle, right: 'var(--pinned-right)' }}>
        {columns[COLUMN_COUNT - 1].field}
      </div>
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

const Scrollbar = React.memo(function Scrollbar(props: {
  contentStyle?: React.CSSProperties;
  [key: string]: any;
}) {
  const { contentStyle, ...other } = props;
  return (
    <div {...other}>
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
      />
    ),
  });

  useJank(refs.scroller);

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

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      <Box {...containerProps} sx={containerSx}>
        <Box className="Grid--scroller" {...scrollerProps} sx={scrollerSx}>
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
                {getRows()}
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
        <Scrollbar className="Grid--scrollbarVertical" {...scrollbarVerticalProps} />
        <Scrollbar className="Grid--scrollbarHorizontal" {...scrollbarHorizontalProps} />
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
