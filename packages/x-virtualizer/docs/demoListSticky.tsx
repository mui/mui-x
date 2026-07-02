import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import { useVirtualizer, Virtualizer, LayoutList, LayoutListSticky } from '@mui/x-virtualizer';

/* eslint-disable @typescript-eslint/no-use-before-define */

const items = Array.from({ length: 100_000 }, (_, index) => ({
  id: index,
  model: { label: `Item ${index + 1}` },
}));
const range = { firstRowIndex: 0, lastRowIndex: items.length };

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

function StickyList() {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => new LayoutListSticky(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: 48,
    },
    virtualization: {},

    rows: items,
    range,
    rowCount: items.length,

    renderRow: (params) => <ListItem key={params.id} id={params.id} model={params.model as any} />,
  });

  useJank(refs.scroller);

  const containerProps = virtualizer.store.use(LayoutListSticky.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutListSticky.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutListSticky.selectors.positionerProps);
  const windowProps = virtualizer.store.use(LayoutListSticky.selectors.windowProps);

  return (
    <Box
      {...containerProps}
      sx={{
        height: 352,
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        border: '1px solid #666',
        borderRadius: 1,
      }}
    >
      <div className="List--content" {...contentProps}>
        <div className="List--positioner" {...positionerProps} />
        <div className="List--window" {...windowProps}>
          <VirtualizerContext.Provider value={virtualizer}>
            <ListContent />
          </VirtualizerContext.Provider>
        </div>
      </div>
    </Box>
  );
}

function ClassicList() {
  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
  };
  const layout = useLazyRef(() => new LayoutList(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: 48,
    },
    virtualization: {},

    rows: items,
    range,
    rowCount: items.length,

    renderRow: (params) => <ListItem key={params.id} id={params.id} model={params.model as any} />,
  });

  useJank(refs.scroller);

  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);

  return (
    <Box
      {...containerProps}
      sx={{
        height: 352,
        flex: 1,
        overflowX: 'hidden',
        overflowY: 'auto',
        border: '1px solid #666',
        borderRadius: 1,
      }}
    >
      <div className="List--filler" {...contentProps} />
      <div className="List--positioner" {...positionerProps} />
      <VirtualizerContext.Provider value={virtualizer}>
        <ListContent />
      </VirtualizerContext.Provider>
    </Box>
  );
}

const ListContent = React.memo(() => {
  const virtualizer = React.useContext(VirtualizerContext)!;
  const { getRows } = virtualizer.api.getters;

  const rows = getRows();

  return <React.Fragment>{rows}</React.Fragment>;
});

function ListItem({ id: _id, model }: { id: number; model: { label: string } }) {
  return (
    <Box
      sx={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid #666',
      }}
    >
      {model.label}
    </Box>
  );
}

export default function VirtualizerListSticky() {
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
      <Box sx={{ display: 'flex', gap: 2 }}>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Inverse sticky layout
          </Typography>
          <StickyList />
        </div>
        <div style={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Classic layout
          </Typography>
          <ClassicList />
        </div>
      </Box>
    </JankContext.Provider>
  );
}
