import * as React from 'react';
import useLazyRef from '@mui/utils/useLazyRef';
import Box from '@mui/material/Box';
import { useVirtualizer, Virtualizer, LayoutList } from '@mui/x-virtualizer';

/* eslint-disable @typescript-eslint/no-use-before-define */

const items = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  model: { label: `Item ${index + 1}` },
}));
const range = { firstRowIndex: 0, lastRowIndex: items.length };

const VirtualizerContext = React.createContext(null as unknown as Virtualizer);

function List() {
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

  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);

  return (
    <Box
      {...containerProps}
      sx={{
        height: 352,
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

export default function VirtualizerList() {
  return (
    <div>
      <List />
    </div>
  );
}
