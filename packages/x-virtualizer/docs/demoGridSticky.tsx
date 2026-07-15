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

/* The horizontal axis is controlled: pinned cells are absolutely positioned,
 * since sticky positioning ignores the positioner's transform. Their offsets
 * arrive through the `--pinned-left`/`--pinned-right` variables set on the
 * positioner, so per-pixel scrolling is a style update to avoid row re-renders. */
const pinnedCellStyle: React.CSSProperties = {
  ...cellStyle,
  position: 'absolute',
  top: 0,
  height: '100%',
  zIndex: 1,
  background: '#f5f5f5',
};

const pinnedCellLeftStyle: React.CSSProperties = {
  ...pinnedCellStyle,
  left: 'var(--pinned-left)',
};
const pinnedCellRightStyle: React.CSSProperties = {
  ...pinnedCellStyle,
  right: 'var(--pinned-right)',
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

const headerRowStyle: React.CSSProperties = {
  ...rowStyle,
  height: HEADER_HEIGHT,
  background: '#e8e8e8',
};
const headerCellStyle: React.CSSProperties = { ...cellStyle, fontWeight: 600 };
const headerPinnedLeftStyle: React.CSSProperties = {
  ...pinnedCellLeftStyle,
  fontWeight: 600,
  background: '#e8e8e8',
};
const headerPinnedRightStyle: React.CSSProperties = {
  ...pinnedCellRightStyle,
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

  return (
    <div style={background ? { ...rowStyle, background } : rowStyle}>
      <div style={background ? { ...pinnedCellLeftStyle, background } : pinnedCellLeftStyle}>
        {id} × 0
      </div>
      {cells}
      <div style={background ? { ...pinnedCellRightStyle, background } : pinnedCellRightStyle}>
        {id} × {COLUMN_COUNT - 1}
      </div>
    </div>
  );
});

const HeaderCells = React.memo(function HeaderCells(props: {
  offsetLeft: number;
  firstColumnIndex: number;
  lastColumnIndex: number;
}) {
  const { offsetLeft, firstColumnIndex, lastColumnIndex } = props;

  const cells = [];
  for (let i = firstColumnIndex; i < lastColumnIndex; i += 1) {
    cells.push(
      <div
        key={i}
        style={
          i === firstColumnIndex ? { ...headerCellStyle, marginLeft: offsetLeft } : headerCellStyle
        }
      >
        {columns[i].field}
      </div>,
    );
  }

  return (
    <div style={headerRowStyle}>
      <div style={headerPinnedLeftStyle}>{columns[0].field}</div>
      {cells}
      <div style={headerPinnedRightStyle}>{columns[COLUMN_COUNT - 1].field}</div>
    </div>
  );
});

const HeaderRow = React.memo(function HeaderRow() {
  const virtualizer = React.useContext(VirtualizerContext);
  const renderContext = virtualizer.store.use(Virtualization.selectors.renderContext);
  const offsetLeft = computeOffsetLeft(
    columnPositions,
    renderContext,
    pinnedColumns.left.length,
    'sticky',
  );

  return (
    <HeaderCells
      offsetLeft={offsetLeft}
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
        offsetLeft={params.offsetLeft}
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
  const windowProps = virtualizer.store.use(LayoutGridSticky.selectors.windowProps);
  const spacerBottomProps = virtualizer.store.use(LayoutGridSticky.selectors.spacerBottomProps);
  const bottomContainerProps = virtualizer.store.use(
    LayoutGridSticky.selectors.bottomContainerProps,
  );
  const positionerProps = virtualizer.store.use(LayoutGridSticky.selectors.positionerProps);

  const pinnedLeftOffset = virtualizer.store.use(Virtualization.selectors.pinnedLeftOffsetSelector);
  const pinnedRightOffset = virtualizer.store.use(
    Virtualization.selectors.pinnedRightOffsetSelector,
  );

  const positionerStyle = React.useMemo(
    () =>
      ({
        ...positionerProps.style,
        '--pinned-left': `${pinnedLeftOffset}px`,
        '--pinned-right': `${pinnedRightOffset}px`,
      }) as React.CSSProperties,
    [positionerProps, pinnedLeftOffset, pinnedRightOffset],
  );

  const { getRows } = virtualizer.api.getters;

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      <Box {...containerProps} sx={containerSx}>
        <Box className="Grid--scroller" {...scrollerProps} sx={scrollerSx}>
          <div className="Grid--content" {...contentProps}>
            <div className="Grid--topContainer" {...topContainerProps}>
              <div {...positionerProps} style={positionerStyle}>
                <HeaderRow />
                {getRows({ position: 'top', rows: pinnedRows.top })}
              </div>
            </div>
            <div className="Grid--spacerTop" {...spacerTopProps} />
            <div className="Grid--window" {...windowProps}>
              <div {...positionerProps} style={positionerStyle}>
                {getRows()}
              </div>
            </div>
            <div className="Grid--spacerBottom" {...spacerBottomProps} />
            <div className="Grid--bottomContainer" {...bottomContainerProps}>
              <div {...positionerProps} style={positionerStyle}>
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
