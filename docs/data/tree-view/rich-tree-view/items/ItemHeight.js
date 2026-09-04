import * as React from 'react';
import Box from '@mui/material/Box';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { MUI_X_PRODUCTS } from '../../datasets/products';

export default function ItemHeight() {
  return (
    <Box sx={{ minHeight: 264, minWidth: 250 }}>
      <RichTreeView items={MUI_X_PRODUCTS} itemHeight={24} />
    </Box>
  );
}
