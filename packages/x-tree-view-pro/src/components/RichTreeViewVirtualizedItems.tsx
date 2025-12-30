'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import Box from '@mui/material/Box';
import { LayoutList, useVirtualizer, Virtualizer } from '@mui/x-virtualizer';
import { createSelectorMemoized, useStore } from '@mui/x-internals/store';
import { EMPTY_OBJECT } from '@base-ui/utils/empty';
import { TreeItemProps } from '@mui/x-tree-view/TreeItem';
import {
  expansionSelectors,
  itemsSelectors,
  RichTreeViewItem,
  RichTreeViewItemsProps,
  useTreeViewContext,
} from '@mui/x-tree-view/internals';
import { RichTreeViewProStore } from '../internals/RichTreeViewProStore';

const VirtualizerContext = React.createContext<Virtualizer | null>(null);

const expandedItemsIdSelectors = createSelectorMemoized(expansionSelectors.flatList, (items) =>
  items.map((itemId) => ({ id: itemId, model: EMPTY_OBJECT })),
);

const ListContent = React.memo(() => {
  const virtualizer = React.useContext(VirtualizerContext)!;
  const { getRows } = virtualizer.api.getters;

  const rows = getRows();

  return <React.Fragment>{rows}</React.Fragment>;
});

export function RichTreeViewVirtualizedItems(props: RichTreeViewItemsProps) {
  const { slots, slotProps } = props;
  const { store } = useTreeViewContext<RichTreeViewProStore<any, any>>();

  const domStructure = useStore(store, itemsSelectors.domStructure);
  if (domStructure === 'nested') {
    throw new Error('MUI X: RichTreeViewItems only supports flat DOM structure when virtualized.');
  }

  const items = useStore(store, expandedItemsIdSelectors);

  const itemSlot = slots?.item as React.JSXElementConstructor<TreeItemProps> | undefined;
  const itemSlotProps = slotProps?.item;

  const range = React.useMemo(
    () => ({ firstRowIndex: 0, lastRowIndex: items.length }),
    [items.length],
  );

  const refs = {
    container: React.useRef<HTMLDivElement>(null),
    scroller: React.useRef<HTMLDivElement>(null),
  };
  const layout = useRefWithInit(() => new LayoutList(refs)).current;
  const virtualizer = useVirtualizer({
    layout,
    dimensions: {
      rowHeight: 32, // TODO: Make it configurable.
    },
    virtualization: {},

    rows: items,
    range,
    rowCount: items.length,

    // autoHeight: false,

    renderRow: (params) => (
      <RichTreeViewItem
        itemSlot={itemSlot}
        itemSlotProps={itemSlotProps}
        key={params.id}
        itemId={params.id}
        skipChildren
      />
    ),
  });

  // Selector hooks
  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);

  return (
    <Box
      {...containerProps}
      sx={{
        height: 352,
        width: '100%',
        overflowX: 'hidden',
        overflowY: 'auto',
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
