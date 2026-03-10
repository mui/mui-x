import * as React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import { TreeViewDefaultItemModelProperties } from '@mui/x-tree-view/models';

const INITIAL_ITEMS: TreeViewDefaultItemModelProperties[] = Array.from(
  { length: 100 },
  (_1, i) => ({
    id: `item-${i + 1}`,
    label: `Item ${i + 1}`,
  }),
);

export default function FlexRichTreeView() {
  const [nbItems, setNbItems] = React.useState(3);
  const removeItem = () => setNbItems((x) => Math.max(0, x - 1));
  const addItem = () => setNbItems((x) => Math.min(100, x + 1));

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Button size="small" onClick={removeItem}>
          Remove an item
        </Button>
        <Button size="small" onClick={addItem}>
          Add an item
        </Button>
      </Stack>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <RichTreeViewPro items={INITIAL_ITEMS.slice(0, nbItems)} />
      </div>
    </Box>
  );
}
