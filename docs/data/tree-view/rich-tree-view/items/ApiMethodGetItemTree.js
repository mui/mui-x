import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';

import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';

const MUI_X_PRODUCTS = [
  {
    id: 'grid',
    label: 'Data Grid',
    children: [
      { id: 'grid-community', label: '@mui/x-data-grid' },
      { id: 'grid-pro', label: '@mui/x-data-grid-pro' },
      { id: 'grid-premium', label: '@mui/x-data-grid-premium' },
    ],
  },
  {
    id: 'pickers',
    label: 'Date and Time Pickers',
    children: [
      { id: 'pickers-community', label: '@mui/x-date-pickers' },
      { id: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
    ],
  },
  {
    id: 'charts',
    label: 'Charts',
    children: [{ id: 'charts-community', label: '@mui/x-charts' }],
  },
  {
    id: 'tree-view',
    label: 'Tree View',
    children: [{ id: 'tree-view-community', label: '@mui/x-tree-view' }],
  },
];

export default function ApiMethodGetItemTree() {
  const apiRef = useTreeViewApiRef();

  const [items, setItems] = React.useState(MUI_X_PRODUCTS);
  const [itemOnTop, setItemOnTop] = React.useState(items[0].label);

  const handleInvertItems = () => {
    setItems((prevItems) => [...prevItems].reverse());
  };

  const handleUpdateItemOnTop = () => {
    setItemOnTop(apiRef.current.getItemTree()[0].label);
  };

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <Button onClick={handleInvertItems}>Invert first tree</Button>
        <Button onClick={handleUpdateItemOnTop}>Update item on top</Button>
      </Stack>
      <Typography>Item on top: {itemOnTop}</Typography>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeView apiRef={apiRef} items={items} />
      </Box>
    </Stack>
  );
}
