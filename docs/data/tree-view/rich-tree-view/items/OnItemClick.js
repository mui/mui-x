import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function OnItemClick() {
  const [lastClickedItem, setLastClickedItem] = React.useState(null);

  return (
    <Stack spacing={2}>
      <Typography>
        {lastClickedItem == null
          ? 'No item click recorded'
          : `Last clicked item: ${lastClickedItem}`}
      </Typography>
      <Box sx={{ minHeight: 352, minWidth: 250 }}>
        <RichTreeView
          items={MUI_X_PRODUCTS}
          onItemClick={(event, itemId) => setLastClickedItem(itemId)}
        />
      </Box>
    </Stack>
  );
}
