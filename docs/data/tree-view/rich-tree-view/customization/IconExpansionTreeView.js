import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { useTreeItem2Utils } from '@mui/x-tree-view/hooks';

import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

const ITEMS = [
  {
    id: '1',
    label: 'Applications',
    children: [{ id: '2', label: 'Calendar' }],
  },
  {
    id: '3',
    label: 'Documents',
    children: [
      { id: '6', label: 'OSS' },
      {
        id: '4',
        label: 'MUI',
        children: [{ id: '5', label: 'index.js' }],
      },
    ],
  },
];

const CustomTreeItem = React.forwardRef(function MyTreeItem(props, ref) {
  const { interactions } = useTreeItem2Utils({
    itemId: props.itemId,
    children: props.children,
  });

  const handleContentClick = (event) => {
    event.defaultMuiPrevented = true;
    interactions.handleSelection(event);
  };

  const handleIconContainerClick = (event) => {
    interactions.handleExpansion(event);
  };

  return (
    <TreeItem2
      {...props}
      ref={ref}
      slotProps={{
        content: { onClick: handleContentClick },
        iconContainer: { onClick: handleIconContainerClick },
      }}
    />
  );
});

export default function IconExpansionTreeView() {
  return (
    <Box sx={{ minHeight: 180, flexGrow: 1, maxWidth: 300 }}>
      <RichTreeView
        aria-label="icon expansion"
        items={ITEMS}
        slots={{ item: CustomTreeItem }}
      />
    </Box>
  );
}
