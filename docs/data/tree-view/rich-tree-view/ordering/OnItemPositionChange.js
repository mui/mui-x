import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeViewPro } from '@mui/x-tree-view-pro/RichTreeViewPro';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function OnItemPositionChange() {
  const [lastReorder, setLastReorder] = React.useState(null);

  return (
    <Stack spacing={2}>
      <Box sx={{ minHeight: 352, minWidth: 300 }}>
        <RichTreeViewPro
          items={MUI_X_PRODUCTS}
          itemsReordering
          defaultExpandedItems={['grid', 'pickers']}
          onItemPositionChange={(params) => setLastReorder(params)}
        />
      </Box>
      {lastReorder == null ? (
        <Typography>No reorder registered yet</Typography>
      ) : (
        <Typography>
          Last reordered item: {lastReorder.itemId}
          <br />
          Position before: {lastReorder.oldPosition.parentId ?? 'root'} (index{' '}
          {lastReorder.oldPosition.index})<br />F Position after:{' '}
          {lastReorder.newPosition.parentId ?? 'root'} (index{' '}
          {lastReorder.newPosition.index})
        </Typography>
      )}
    </Stack>
  );
}
