'use client';
import * as React from 'react';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
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
  useTreeViewRootProps,
  useTreeViewStyleContext,
} from '@mui/x-tree-view/internals';
import useSlotProps from '@mui/utils/useSlotProps';
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

export function RichTreeViewVirtualizedItems<TProps extends object>(
  props: RichTreeViewItemsProps<TProps>,
) {
  const { slots, slotProps, ownerState, forwardedProps, rootRef } = props;
  const { store } = useTreeViewContext<RichTreeViewProStore<any, any>>();
  const { classes } = useTreeViewStyleContext();

  const domStructure = useStore(store, itemsSelectors.domStructure);
  if (domStructure === 'nested') {
    throw new Error('MUI X: RichTreeViewItems only supports flat DOM structure when virtualized.');
  }

  const items = useStore(store, expandedItemsIdSelectors);
  const defaultItemHeight = useStore(store, itemsSelectors.itemHeight);

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
      rowHeight: defaultItemHeight!, // The defaultItemHeight is always defined when virtualization is enabled.
    },
    virtualization: {},

    rows: items,
    range,
    rowCount: items.length,

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

  const containerProps = virtualizer.store.use(LayoutList.selectors.containerProps);
  const contentProps = virtualizer.store.use(LayoutList.selectors.contentProps);
  const positionerProps = virtualizer.store.use(LayoutList.selectors.positionerProps);

  const getRootProps = useTreeViewRootProps(store, forwardedProps, rootRef);
  const Root = slots.root;
  const rootProps = useSlotProps({
    elementType: Root,
    externalSlotProps: slotProps?.root,
    className: classes.root,
    getSlotProps: getRootProps,
    additionalProps: {
      ...containerProps,
      'data-virtualized': '',
    },
    ownerState,
  });

  return (
    <VirtualizerContext.Provider value={virtualizer}>
      <Root {...rootProps}>
        <div className="List--filler" {...contentProps} />
        <div className="List--positioner" {...positionerProps} />
        <ListContent />
      </Root>
    </VirtualizerContext.Provider>
  );
}
